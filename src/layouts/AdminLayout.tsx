import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout() {
  return (
    <>
      <AdminNavbar />
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
}
