import { BrowserRouter, Routes } from "react-router-dom";
import { Route } from "react-router";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/login";
import { AuthProvider } from "./contexts/AuthContext";
import AttendanceManagement from "./pages/AttendanceManagement";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeManagement from "./pages/EmployeeManagement";
import NotFoundPage from "./pages/NotFound";
import SalaryManagement from "./pages/SalaryManagement";
import StockManagement from "./pages/StockManagement";

function App() {

  return (
    <>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/attendance-management" element={<AttendanceManagement />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee-management" element={<EmployeeManagement />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/salary-management" element={<SalaryManagement />} />
          <Route path="/stock-management" element={<StockManagement />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App