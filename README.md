# 🚗 WheelWork-Pro | Tyre Centre Internal Management Frontend

**WheelWork-Pro** is a modern, responsive frontend application built to streamline the internal operations of a tyre centre.  
It simplifies **employee attendance tracking**, **salary computation**, and **stock management** through a clean and intuitive web interface.

This project focuses purely on the **frontend**, developed with **React (TypeScript)** and styled using **shadcn/ui** to ensure scalability, maintainability, and professional-grade design consistency.

---

## 🧩 Key Features

### 👥 Employee Management
- Manage employee records (add, edit, remove)
- Role-based interface for Admins and Employees
- View employee profiles and status (active/inactive)

### 🕒 Attendance Tracking
- Employees can **clock in/out** and view attendance history
- Admins can **monitor, edit, and validate** attendance logs
- Automatic calculation of total working hours

### 💰 Salary Calculation
- Generate salaries based on logged working hours
- Configure hourly rates and deductions
- View salary slips and monthly summaries

### 📦 Stock Management
- Track **incoming stock** (from main branch)
- Log **outgoing stock** (to customers or internal use)
- Low-stock alerts and history logs

### 📊 Dashboard & Reports
- Admin dashboard with quick stats on attendance, stock, and performance
- Filterable data tables and chart visualizations
- Clean navigation between modules

---

## 🛠️ Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend Framework** | [React](https://react.dev/) (with [TypeScript](https://www.typescriptlang.org/)) |
| **UI Library** | [shadcn/ui](https://ui.shadcn.com/) |
| **Styling** | Tailwind CSS |
| **Routing** | React Router DOM |
| **State Management** | React Hooks / Context API |
| **Charts (if used)** | Recharts / Chart.js |
| **Icons** | Lucide React |
| **Package Manager** | npm / pnpm / yarn |

---

## 🧱 Project Structure

wheelwork-pro-frontend/
├── src/
│ ├── components/ # Reusable UI components
│ ├── pages/ # Main pages (Dashboard, Attendance, Stock, etc.)
│ ├── layouts/ # Shared layouts & navigation
│ ├── context/ # App context and state management
│ ├── assets/ # Icons, images
│ ├── lib/ # Utility and helper functions
│ └── App.tsx # Root application file
├── public/ # Static assets
├── package.json
└── README.md

yaml
Copy code

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/wheelwork-pro-frontend.git
cd wheelwork-pro-frontend
2️⃣ Install Dependencies
bash
Copy code
npm install
or

bash
Copy code
pnpm install
3️⃣ Start the Development Server
bash
Copy code
npm run dev
Your app will be running at:
👉 http://localhost:5173 (Vite default port)

📁 Figma Design
The UI/UX design was collaboratively created by a 10-member team in Figma, focusing on:

Consistent component styling

Industrial and professional color palette

Simple, workflow-optimized layouts

👨‍💻 Team Contributions
Role	Responsibility
UI/UX Leads	Design system, color palette, typography
Attendance & Salary Designers	Attendance flow, salary UI, tables
Stock Designers	Incoming & outgoing stock interfaces
Dashboard Team	Analytics, admin navigation
Integrations & Review	Component linking, final prototype testing

🧠 Future Enhancements
🔐 Authentication & role-based routing

📊 Integration with backend APIs for real data

🌓 Dark mode

📱 Mobile-responsive optimization
