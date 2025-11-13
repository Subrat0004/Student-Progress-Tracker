import React, { useEffect, useState } from "react";
import API from "../../api";
import { FaUserGraduate, FaTrash, FaPlus } from "react-icons/fa";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNo: "",
    role: "STUDENT",
  });

  const load = () => API.get("/admin/students").then((r) => setStudents(r.data));
  useEffect(() => {
    load();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    API.post("/admin/students", form).then(() => {
      setForm({ name: "", email: "", rollNo: "", role: "STUDENT" });
      load();
    });
  };

  const remove = (id) => {
    if (window.confirm("Delete this student?"))
      API.delete("/admin/students/" + id).then(load);
  };

  return (
    <div className="container py-4">
      <style>
        {`
          body {
            background: linear-gradient(135deg, #f8faff, #edf1fc);
            font-family: 'Inter', sans-serif;
          }

          .admin-header {
            background: linear-gradient(120deg, #4c6ef5, #7950f2);
            color: white;
            border-radius: 16px;
            padding: 28px 40px;
            margin-bottom: 30px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          }

          .admin-header h3 {
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .form-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
          }

          .form-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.12);
          }

          .table {
            background: white;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          }

          thead {
            background: #eef1ff;
          }

          th {
            color: #4c6ef5;
            font-weight: 600;
          }

          tbody tr {
            transition: all 0.2s ease;
          }

          tbody tr:hover {
            background: #f2f5ff !important;
            transform: scale(1.01);
          }

          .btn-primary {
            background: linear-gradient(90deg, #4c6ef5, #7950f2);
            border: none;
            border-radius: 10px;
            transition: 0.3s;
          }

          .btn-primary:hover {
            background: linear-gradient(90deg, #7950f2, #4c6ef5);
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
          }

          .btn-danger {
            border-radius: 8px;
          }

          input, select {
            border-radius: 10px;
          }

          .add-icon {
            background: rgba(255,255,255,0.2);
            padding: 6px;
            border-radius: 8px;
          }
        `}
      </style>

      {/* Header */}
      <div className="admin-header mb-4 d-flex align-items-center justify-content-between flex-wrap">
        <h3>
          <FaUserGraduate className="add-icon" /> Manage Students
        </h3>
        <p className="mb-0 text-light opacity-75">
          Add, view, or remove students easily from the system.
        </p>
      </div>

      {/* Form */}
      <div className="form-card mb-4">
        <form className="row g-2 align-items-center" onSubmit={submit}>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Roll No"
              value={form.rollNo}
              onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="STUDENT">STUDENT</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
              <FaPlus /> Add
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Roll</th>
                <th>Role</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td className="fw-semibold">{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.rollNo}</td>
                  <td>
                    <span
                      className={
                        s.role === "ADMIN"
                          ? "badge bg-danger"
                          : "badge bg-success"
                      }
                    >
                      {s.role}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => remove(s.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No students found. Add some using the form above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
