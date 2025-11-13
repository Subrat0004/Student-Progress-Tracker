import React, { useEffect, useState } from "react";
import API from "../../api";
import { FaClipboardList, FaTasks, FaTrashAlt, FaCalendarAlt } from "react-icons/fa";

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    studentId: "",
    title: "",
    description: "",
    dueDate: new Date().toISOString().slice(0, 10),
    status: "PENDING",
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Load data
  const loadAll = () => {
    API.get("/admin/assignments").then((res) => setAssignments(res.data));
    API.get("/admin/students").then((res) => setStudents(res.data));
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ✅ Add assignment
  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    API.post("/admin/assignments", form)
      .then(() => {
        setMessage({ text: "✅ Assignment added successfully!", type: "success" });
        setForm({
          studentId: "",
          title: "",
          description: "",
          dueDate: new Date().toISOString().slice(0, 10),
          status: "PENDING",
        });
        loadAll();
        setTimeout(() => setMessage(null), 3000);
      })
      .catch(() => {
        setMessage({ text: "❌ Failed to save assignment.", type: "danger" });
        setTimeout(() => setMessage(null), 3000);
      })
      .finally(() => setLoading(false));
  };

  // ✅ Delete assignment
  const remove = (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      API.delete(`/admin/assignments/${id}`).then(loadAll);
    }
  };

  // ✅ Format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return !isNaN(d) ? d.toLocaleDateString() : "—";
  };

  return (
    <div className="container py-4">
      {/* 🎨 Custom Styles */}
      <style>
        {`
          body {
            background: linear-gradient(135deg, #f7f9ff, #eef2ff);
            font-family: 'Inter', sans-serif;
          }

          .assign-header {
            background: linear-gradient(120deg, #228be6, #6741d9);
            color: #fff;
            border-radius: 18px;
            padding: 28px 40px;
            margin-bottom: 35px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          }

          .assign-header h3 {
            font-weight: 700;
          }

          .assign-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 18px;
            padding: 35px 25px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
          }

          .assign-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.12);
          }

          .btn-primary {
            background: linear-gradient(90deg, #4c6ef5, #7950f2);
            border: none;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .btn-primary:hover {
            background: linear-gradient(90deg, #7950f2, #4c6ef5);
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(0,0,0,0.15);
          }

          .table-container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            overflow: hidden;
            margin-top: 40px;
          }

          .table th {
            background: #4c6ef5;
            color: white;
            font-weight: 600;
            text-align: center;
          }

          .table td {
            vertical-align: middle;
            text-align: center;
          }

          .badge {
            font-size: 0.8rem;
            padding: 6px 10px;
            border-radius: 8px;
          }

          .alert-custom {
            border-radius: 12px;
            padding: 14px 18px;
            margin-bottom: 20px;
            animation: fadeIn 0.4s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .action-btn {
            border-radius: 8px;
            font-size: 0.85rem;
            transition: 0.2s;
          }

          .action-btn:hover {
            transform: scale(1.1);
          }
        `}
      </style>

      {/* ✅ Header */}
      <div className="assign-header d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3>
            <FaClipboardList className="me-2" /> Assignment Management
          </h3>
          <p className="mb-0 text-light opacity-75">
            Create, track, and manage student assignments with ease.
          </p>
        </div>
        <FaTasks size={30} className="opacity-75" />
      </div>

      {/* ✅ Message */}
      {message && (
        <div
          className={`alert-custom text-center fw-semibold ${
            message.type === "success"
              ? "bg-success text-white"
              : "bg-danger text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ✅ Form Card */}
      <div className="assign-card">
        <form className="row g-4" onSubmit={submit}>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Select Student</label>
            <select
              className="form-select"
              value={form.studentId}
              required
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            >
              <option value="">-- Select Student --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Roll No: {s.rollNo || s.id})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Title</label>
            <input
              className="form-control"
              placeholder="Enter assignment title"
              value={form.title}
              required
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Due Date</label>
            <input
              type="date"
              className="form-control"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>

          <div className="col-md-8">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className="form-control"
              placeholder="Brief description of assignment"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            ></textarea>
          </div>

          <div className="col-md-2">
            <label className="form-label fw-semibold">Status</label>
            <select
              className="form-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="PENDING">Pending</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="LATE">Late</option>
            </select>
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Saving..." : "Add"}
            </button>
          </div>
        </form>
      </div>

      {/* ✅ Assignments Table */}
      <div className="table-container mt-4">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Title</th>
              <th>Student</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  No assignments added yet.
                </td>
              </tr>
            ) : (
              assignments.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{students.find((s) => s.id === a.studentId)?.name || "—"}</td>
                  <td>
                    <FaCalendarAlt className="me-1 text-secondary" />
                    {formatDate(a.dueDate)}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        a.status === "SUBMITTED"
                          ? "bg-success"
                          : a.status === "LATE"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="text-muted">{a.description}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger action-btn"
                      onClick={() => remove(a.id)}
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
