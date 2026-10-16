const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const pool = require("./db");
const { print, getPrinters } = require("pdf-to-printer");

// ✅ Your Samsung ML-1670 printer name (exact name from Windows)
const PRINTER_NAME = "Samsung ML-1670 Series";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));


// Multer Storage

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/");

    },

    filename: function (req, file, cb) {

        cb(null, Date.now() + "-" + file.originalname);

    }

});

const upload = multer({ storage: storage });


// Upload API

app.post("/upload", upload.single("file"), async (req, res) => {

    const { copies, color_mode } = req.body;

    try {

        await pool.query(

            "INSERT INTO print_jobs (file_name, copies, color_mode, status) VALUES ($1, $2, $3, $4)",

            [
                req.file.filename,
                copies,
                color_mode,
                "Pending"
            ]

        );

        res.json({
            message: "Print job uploaded successfully"
        });

    } catch (err) {

        console.log(err);

    }

});


// Fetch Jobs API

app.get("/jobs", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM print_jobs ORDER BY id DESC"
        );

        res.json(result.rows);

    } catch (err) {

        console.log(err);

    }

});


// Update Status API

app.put("/update-status/:id", async (req, res) => {

    const { id } = req.params;

    const { status } = req.body;

    try {

        await pool.query(

            "UPDATE print_jobs SET status = $1 WHERE id = $2",

            [status, id]

        );

        res.json({
            message: "Status Updated"
        });

    } catch (err) {

        console.log(err);

    }

});


// Delete Job API

app.delete("/delete-job/:id", async (req, res) => {

    const { id } = req.params;

    try {

        await pool.query(
            "DELETE FROM print_jobs WHERE id = $1",
            [id]
        );

        res.json({
            message: "Job Deleted"
        });

    } catch (err) {

        console.log(err);

    }

});



// ─────────────────────────────────────────────────────────
// GET PRINTERS API — Lists all printers connected to this PC
// ─────────────────────────────────────────────────────────

app.get("/get-printers", async (req, res) => {

    try {

        const printers = await getPrinters();
        res.json({ printers });

    } catch (err) {

        console.error("Error fetching printers:", err);
        res.status(500).json({ error: "Could not fetch printers" });

    }

});


// ─────────────────────────────────────────────────────────
// PRINT API — Send a job to Samsung ML-1670 printer
// POST /print/:id
// ─────────────────────────────────────────────────────────

app.post("/print/:id", async (req, res) => {

    const { id } = req.params;

    try {

        // Step 1: Get the job from database
        const result = await pool.query(
            "SELECT * FROM print_jobs WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Job not found" });
        }

        const job = result.rows[0];

        // Step 2: Build the full file path
        const filePath = path.join(__dirname, "uploads", job.file_name);

        // Step 3: Set print options
        const printOptions = {
            printer: PRINTER_NAME,
            copies: parseInt(job.copies) || 1,
            paperSize: "A4",
            orientation: "portrait",
            monochrome: job.color_mode === "B&W" || job.color_mode === "bw" || job.color_mode === "black"
        };

        console.log(`🖨️  Printing job #${id}: ${job.file_name}`);
        console.log(`   Printer : ${PRINTER_NAME}`);
        console.log(`   Copies  : ${printOptions.copies}`);
        console.log(`   Color   : ${printOptions.monochrome ? "B&W" : "Color"}`);

        // Step 4: Update status to "Printing" in DB
        await pool.query(
            "UPDATE print_jobs SET status = $1 WHERE id = $2",
            ["Printing", id]
        );

        // Step 5: Send to printer (with 10-second watchdog timeout)
        const printPromise = print(filePath, printOptions);
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Printer timeout after 10 seconds")), 10000)
        );

        await Promise.race([printPromise, timeoutPromise]);

        // Step 6: Update status to "Completed" in DB
        await pool.query(
            "UPDATE print_jobs SET status = $1 WHERE id = $2",
            ["Completed", id]
        );

        console.log(`✅ Job #${id} printed successfully!`);
        res.json({ message: `Job #${id} sent to ${PRINTER_NAME} successfully!` });

    } catch (err) {

        console.error(`❌ Print failed for job #${id}:`, err.message);

        // Update status to "Failed" in DB so shopkeeper knows
        await pool.query(
            "UPDATE print_jobs SET status = $1 WHERE id = $2",
            ["Failed", id]
        ).catch(() => {});

        res.status(500).json({ error: err.message });

    }

});


// Start Server

app.listen(5000, () => {

    console.log("Server running on port 5000");
    console.log(`🖨️  Printer configured: ${PRINTER_NAME}`);

});