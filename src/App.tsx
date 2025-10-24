import { BrowserRouter, Routes } from "react-router-dom";
import { Route } from "react-router";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/login";
import { AuthProvider } from "./contexts/AuthContext";

function App() {

  return (
    <>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App