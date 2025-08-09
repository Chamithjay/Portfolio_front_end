import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/admin_login";
import AdminHome from "./pages/AdminHome";
import SkillPage from "./pages/SkillsPage";
import "./index.css";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/skills" element={<SkillPage />} />
      </Routes>
    </Router>
  );
}
