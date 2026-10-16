# 🖨️ PrintHub — Online Printing Platform

A web-based smart printing system that allows customers to upload documents, choose print settings, and submit print jobs — all managed through a live dashboard by the shopkeeper.

---

## 🚀 Features

- 📤 Upload documents (PDF, images, Word files)
- 🎨 Choose Color Mode (Color / Black & White)
- 📋 Set number of copies
- 📊 Live shopkeeper dashboard to manage print queue
- ✅ Update job status (Pending → Printing → Completed)
- 🗑️ Delete completed jobs
- 🖨️ Direct printer connection via `pdf-to-printer`
- 🗄️ PostgreSQL database for storing all print jobs

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **File Upload** | Multer |
| **Printer** | pdf-to-printer (Windows Print Spooler) |

---

## 📁 Project Structure

```
smart-printing-system/
├── backend/
│   ├── server.js          # Express server with all API routes
│   ├── db.js              # PostgreSQL connection config
│   ├── package.json       # Backend dependencies
│   └── uploads/           # Uploaded print files stored here
└── frontend/
    ├── index.html         # Customer upload page
    ├── dashboard.html     # Shopkeeper dashboard
    ├── app.js             # Frontend logic (upload form)
    ├── dashboard.js       # Dashboard logic (job management)
    └── style.css          # Styling
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/yashpatil7313/PrintHub-Online-Printing-Platform.git
cd PrintHub-Online-Printing-Platform
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Setup PostgreSQL Database

Create a database named `smart_printing` and run this SQL:

```sql
CREATE TABLE print_jobs (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    copies INTEGER NOT NULL,
    color_mode VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=smart_printing
DB_PASSWORD=your_password_here
DB_PORT=5432
```

### 5. Start the backend server
```bash
cd backend
node server.js
```

Server runs on: `http://localhost:5000`

### 6. Open the frontend

Open `frontend/index.html` in your browser directly, or use Live Server in VS Code.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/upload` | Upload a file and create a print job |
| `GET` | `/jobs` | Fetch all print jobs |
| `PUT` | `/update-status/:id` | Update job status |
| `DELETE` | `/delete-job/:id` | Delete a job |
| `GET` | `/get-printers` | List all connected printers |
| `POST` | `/print/:id` | Send job to physical printer |

---

## 🖨️ Printer Connection

The system connects to any Windows printer via the **pdf-to-printer** library.

- Printer is auto-detected (Samsung ML-1670 or any connected printer)
- Jobs are sent directly to the Windows Print Spooler
- A 10-second watchdog timer handles offline/jammed printers
- Job status updates automatically: `Pending → Printing → Completed`

---

## 📸 Screenshots

> Customer Upload Page — submit print jobs online  
> Shopkeeper Dashboard — manage and print jobs in real time

---

## 👨‍💻 Author

**Yash Patil**  
Final Year Computer Engineering Student  
📧 yashrspatil7313@gmail.com  
🔗 [GitHub](https://github.com/yashpatil7313)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
