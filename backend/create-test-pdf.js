// Script to create a test PDF and send it to Samsung ML-1670
const { print } = require("pdf-to-printer");
const fs = require("fs");
const path = require("path");

// Step 1: Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Step 2: Write a simple valid PDF to uploads/
const pdfContent = Buffer.from(
    "255044462d312e340a312030206f626a0a3c3c202f54797065202f43617461" +
    "6c6f67202f5061676573203220302052203e3e0a656e646f626a0a0a322030" +
    "206f626a0a3c3c202f54797065202f5061676573202f4b696473205b332030" +
    "20525d202f436f756e7420313e3e0a656e646f626a0a0a332030206f626a0a" +
    "3c3c202f54797065202f50616765202f506172656e742032203020522f4d65" +
    "6469614b6f78205b302030203539352038343275d202f436f6e74656e747320" +
    "342030202f5265736f75726365733c3c2f466f6e743c3c2f46312035203020" +
    "523e3e3e3e3e3e0a656e646f626a0a0a342030206f626a0a3c3c202f4c656e" +
    "677468203434200a3e3e0a73747265616d0a425420202f463120323420546620" +
    "313030203730302054642028205072696e74487562205465737420292054" +
    "6a2020455420200a656e6473747265616d0a656e646f626a0a0a352030206f" +
    "626a0a3c3c202f54797065202f466f6e74202f537562747970652f54797065" +
    "31202f426173654c6f6e672f48656c7665746963613e3e0a656e646f626a0a" +
    "0a787265660a3020360a303030303030303030302036353533352066200a30" +
    "303030303030303039203030303030206e200a3030303030303030353820303" +
    "0303030206e200a303030303030303131352030303030306e200a3030303030" +
    "30303236362030303030306e200a303030303030303336302030303030306e" +
    "200a0a747261696c65720a3c3c202f53697a652036202f526f6f7420312030" +
    "20523e3e0a73746172747872656f0a3434310a2525454f46",
    "hex"
);

const testFilePath = path.join(uploadsDir, "test-print.pdf");

// Use a real simple PDF approach - write raw bytes
const simplePDF = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<</Font<</F1<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>>>>>>>
/Contents 4 0 R>>endobj
4 0 obj<</Length 80>>
stream
BT
/F1 30 Tf
150 700 Td
(PrintHub Test Page) Tj
/F1 16 Tf
0 -50 Td
(Samsung ML-1670 Connected!) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
trailer<</Size 5/Root 1 0 R>>
startxref
399
%%EOF`;

fs.writeFileSync(testFilePath, simplePDF);
console.log("✅ Test PDF created:", testFilePath);

// Step 3: Send to Samsung Printer
const PRINTER_NAME = "Samsung ML-1670 Series";

console.log(`\n🖨️  Sending to printer: ${PRINTER_NAME}`);
console.log("   Please make sure printer is ON and paper is loaded...\n");

const printOptions = {
    printer: PRINTER_NAME,
    copies: 1,
    monochrome: true,
};

// Step 4: Print with 15-second timeout
const printPromise = print(testFilePath, printOptions);
const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Printer timeout - is the printer ON?")), 15000)
);

Promise.race([printPromise, timeoutPromise])
    .then(() => {
        console.log("✅ SUCCESS! Job sent to Samsung ML-1670!");
        console.log("📄 Paper should be coming out now...");
    })
    .catch((err) => {
        console.error("❌ FAILED:", err.message);
        console.log("\nTroubleshooting:");
        console.log("1. Is the printer turned ON? (green light?)");
        console.log("2. Is the USB cable firmly connected?");
        console.log("3. Is there paper in the tray?");
    });
