import React from "react";
import { Link } from "react-router-dom";
import { FaChartPie } from "react-icons/fa";

export default function PublicNav() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-white shadow-sm"
      style={{ padding: "0.8rem 1.5rem" }}
    >
      <div className="container-fluid">
        {/* Logo / Brand */}
        <Link
          className="navbar-brand fw-bold text-primary d-flex align-items-center"
          to="/login"
          style={{ fontSize: "1.4rem" }}
        >
          <FaChartPie className="me-2" />
          ProgressTracker
        </Link>

        {/* Buttons */}
        <div className="ms-auto d-flex">
          <Link
            className="btn btn-outline-primary me-2 rounded-pill px-3"
            to="/login"
          >
            Login
          </Link>
          <Link className="btn btn-primary rounded-pill px-3" to="/signup">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
