import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import PublicNav from "../components/PublicNav";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    loginAs: "STUDENT" // ✅ For UI only
  });

  const submit = (e) => {
    e.preventDefault();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    API.post("/auth/login", {
      email: form.email,
      password: form.password
    })
      .then((res) => {
        const user = res.data.user;

        if (form.loginAs === "ADMIN" && user.role !== "ADMIN") {
          alert("This account is NOT an admin!");
          return;
        }

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      })
      .catch(() => alert("Invalid credentials"));
  };

  return (
    <>
      <PublicNav />

      {/* 🎨 Custom Scoped Styles */}
      <style>
        {`
          .login-page {
            min-height: calc(100vh - 70px);
            background: linear-gradient(135deg, #f3f5ff, #e8ecff);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 15px;
          }

          .login-card {
            background: #ffffff;
            border-radius: 18px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            padding: 40px 30px;
            max-width: 420px;
            width: 100%;
            animation: fadeIn 0.6s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .login-card h2 {
            text-align: center;
            margin-bottom: 25px;
            font-weight: 700;
            background: linear-gradient(90deg, #4c6ef5, #7950f2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .form-control, .form-select {
            border-radius: 10px;
            padding: 10px 12px;
            border: 1px solid #dee2e6;
            transition: 0.3s;
          }

          .form-control:focus, .form-select:focus {
            border-color: #4c6ef5;
            box-shadow: 0 0 6px rgba(76,110,245,0.3);
          }

          .btn-login {
            background: linear-gradient(90deg, #4c6ef5, #7950f2);
            border: none;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            padding: 10px;
            width: 100%;
            transition: all 0.3s ease;
          }

          .btn-login:hover {
            transform: translateY(-2px);
            background: linear-gradient(90deg, #7950f2, #4c6ef5);
            box-shadow: 0 6px 15px rgba(0,0,0,0.15);
          }

          .login-footer {
            text-align: center;
            margin-top: 15px;
            font-size: 0.9rem;
            color: #666;
          }

          .login-footer span {
            color: #4c6ef5;
            cursor: pointer;
            font-weight: 600;
          }

          .login-footer span:hover {
            text-decoration: underline;
          }

          @media (max-width: 576px) {
            .login-card {
              padding: 30px 20px;
            }
          }
        `}
      </style>

      {/* ✅ Login Section (Navbar-safe layout) */}
      <div className="login-page">
        <div className="login-card">
          <h2>
            {form.loginAs === "ADMIN" ? "Admin Login" : "Student Login"}
          </h2>

          <form onSubmit={submit}>
            <input
              className="form-control mb-3"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <select
              className="form-select mb-3"
              value={form.loginAs}
              onChange={(e) => setForm({ ...form, loginAs: e.target.value })}
            >
              <option value="STUDENT">Login as Student</option>
              <option value="ADMIN">Login as Admin</option>
            </select>

            <button className="btn-login" type="submit">
              Login
            </button>
          </form>

          <div className="login-footer">
            {form.loginAs === "STUDENT" ? (
              <>
                Don’t have an account?{" "}
                <span onClick={() => navigate("/signup")}>Sign up</span>
              </>
            ) : (
              <>
                Not an Admin?{" "}
                <span onClick={() => setForm({ ...form, loginAs: "STUDENT" })}>
                  Switch to Student
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
