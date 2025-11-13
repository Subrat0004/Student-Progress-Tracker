import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || user.role !== "ADMIN") {
    navigate("/login");
    return null;
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f9" }}>

      {/* ✅ LEFT SIDEBAR */}
      <div
        style={{
          width: "270px",
          background: "#1e1e2f",
          color: "white",
          padding: "20px",
        }}
      >
        <h3 className="fw-bold mb-4 text-center">Admin Panel</h3>

        <ul className="nav flex-column">
          <li>
            <Link className="nav-link text-white" to="/admin">📊 Dashboard</Link>
          </li>
          <li>
            <Link className="nav-link text-white" to="/admin/students">👥 Students</Link>
          </li>
          <li>
            <Link className="nav-link text-white" to="/admin/attendance">🗓 Attendance</Link>
          </li>
          <li>
            <Link className="nav-link text-white" to="/admin/results">🧪 Results</Link>
          </li>
          <li>
            <Link className="nav-link text-white" to="/admin/assignments">📝 Assignments</Link>
          </li>
        </ul>

        <button
          className="btn btn-danger w-100 mt-4"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* ✅ RIGHT PAGE CONTENT */}
      <div style={{ flexGrow: 1, padding: "30px" }}>
        {children}
      </div>
    </div>
  );
}
