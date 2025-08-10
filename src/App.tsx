import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/admin_login";
import AdminHome from "./pages/AdminHome";
import SkillPage from "./pages/SkillsPage";
import ProjectPage from "./pages/ProjectsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import "./index.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Public/admin login route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* All admin routes with navbar */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/skills" element={<SkillPage />} />
          <Route path="/admin/projects" element={<ProjectPage />} />
          <Route path="/admin/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}
