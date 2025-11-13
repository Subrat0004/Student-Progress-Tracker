import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* ✨ Scoped Navbar Styling */}
      <style>
        {`
          /* === Navbar Styling === */
          .navbar {
            background: linear-gradient(90deg, #0052cc, #007bff, #6610f2);
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            padding: 0.6rem 1rem;
          }

          .navbar:hover {
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
          }

          .navbar-brand {
            color: #ffffff !important;
            font-weight: 700;
            font-size: 1.4rem;
            letter-spacing: 0.5px;
            transition: all 0.2s ease;
          }

          .navbar-brand:hover {
            opacity: 0.9;
            transform: scale(1.03);
          }

          .nav-link {
            color: rgba(255, 255, 255, 0.85) !important;
            font-weight: 500;
            border-radius: 8px;
            padding: 8px 14px;
            transition: all 0.25s ease;
          }

          .nav-link:hover {
            background: rgba(255, 255, 255, 0.2);
            color: #fff !important;
          }

          .nav-link.active {
            background: rgba(255, 255, 255, 0.3);
            color: #fff !important;
            font-weight: 600;
            box-shadow: inset 0 -2px 0 rgba(255, 255, 255, 0.5);
          }

          /* === Buttons === */
          .btn-sm {
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.25s ease;
          }

          .btn-outline-secondary {
            color: #fff;
            border-color: rgba(255, 255, 255, 0.6);
          }

          .btn-outline-secondary:hover {
            background: rgba(255, 255, 255, 0.25);
            border-color: #fff;
          }

          .btn-primary {
            background: #fff;
            color: #0052cc;
            border: none;
          }

          .btn-primary:hover {
            background: #e8f0ff;
            color: #003d99;
            transform: translateY(-1px);
          }

          /* === Responsive === */
          @media (max-width: 768px) {
            .navbar {
              padding: 0.5rem;
            }

            .navbar-brand {
              font-size: 1.2rem;
            }

            .nav-link {
              padding: 6px 10px;
            }
          }
        `}
      </style>

      {/* === Top Navbar === */}
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
        <div className="container">
          {/* Brand */}
          <span
            className="navbar-brand fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            ProgressTracker
          </span>

          <button
            className="navbar-toggler bg-light"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#studentNav"
            aria-controls="studentNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="studentNav">
            {/* Main Tabs */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  end
                  to="/"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active fw-semibold" : "")
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/assignments"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active fw-semibold" : "")
                  }
                >
                  Assignments
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/results"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active fw-semibold" : "")
                  }
                >
                  Results
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/attendance"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active fw-semibold" : "")
                  }
                >
                  Attendance
                </NavLink>
              </li>
            </ul>

            {/* Right Side: User + Actions */}
            <div className="d-flex align-items-center gap-2">
              {user ? (
                <>
                  <span className="text-light small d-none d-md-inline">
                    Hi, <span className="fw-semibold">{user.name}</span>
                  </span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={logout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Body */}
      <main className="container py-4">{children}</main>

      {/* Footer */}
      <footer className="border-top mt-4">
        <div className="container py-3 text-muted small">
          © {new Date().getFullYear()} ProgressTracker · Student Area
        </div>
      </footer>
    </>
  );
}
