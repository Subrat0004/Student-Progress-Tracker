import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import PublicNav from "../components/PublicNav";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNo: "",
    password: "",
    role: "STUDENT"
  });

  const submit = (e) => {
    e.preventDefault();

    API.post("/auth/signup", form)
      .then(() => {
        alert("Student registered! Please login.");
        navigate("/login");
      })
      .catch(() => alert("Signup failed"));
  };

  return (
    <>
      <PublicNav />

      {/* 🎨 Scoped Style */}
      <style>
        {`
          .signup-page {
            min-height: calc(100vh - 70px);
            background: linear-gradient(135deg, #f3f5ff, #e8ecff);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 15px;
          }

          .signup-card {
            background: #ffffff;
            border-radius: 18px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            padding: 40px 30px;
            max-width: 450px;
            width: 100%;
            animation: fadeIn 0.6s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .signup-card h2 {
            text-align: center;
            margin-bottom: 25px;
            font-weight: 700;
            background: linear-gradient(90deg, #4c6ef5, #7950f2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .form-control {
            border-radius: 10px;
            padding: 10px 12px;
            border: 1px solid #dee2e6;
            transition: 0.3s;
          }

          .form-control:focus {
            border-color: #4c6ef5;
            box-shadow: 0 0 6px rgba(76,110,245,0.3);
          }

          .btn-signup {
            background: linear-gradient(90deg, #4c6ef5, #7950f2);
            border: none;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            padding: 10px;
            width: 100%;
            transition: all 0.3s ease;
          }

          .btn-signup:hover {
            transform: translateY(-2px);
            background: linear-gradient(90deg, #7950f2, #4c6ef5);
            box-shadow: 0 6px 15px rgba(0,0,0,0.15);
          }

          .signup-footer {
            text-align: center;
            margin-top: 15px;
            font-size: 0.9rem;
            color: #666;
          }

          .signup-footer span {
            color: #4c6ef5;
            cursor: pointer;
            font-weight: 600;
          }

          .signup-footer span:hover {
            text-decoration: underline;
          }

          @media (max-width: 576px) {
            .signup-card {
              padding: 30px 20px;
            }
          }
        `}
      </style>

      {/* ✅ Signup Page Content */}
      <div className="signup-page">
        <div className="signup-card">
          <h2>Student Sign Up</h2>

          <form onSubmit={submit}>
            <input
              className="form-control mb-3"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              className="form-control mb-3"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              className="form-control mb-3"
              placeholder="Roll No"
              value={form.rollNo}
              onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
              required
            />

            <input
              type="password"
              className="form-control mb-4"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <button className="btn-signup">Sign Up</button>
          </form>

          <div className="signup-footer">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </div>
        </div>
      </div>
    </>
  );
}
