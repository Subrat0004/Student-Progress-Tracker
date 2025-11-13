import React, { useState, useEffect } from "react";
import API from "../../api";
import { FaCalendarCheck, FaClipboardList, FaUserCheck } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminAttendance() {
  const [students, setStudents] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [form, setForm] = useState({
    studentId: "",
    date: new Date().toISOString().slice(0, 10),
    status: "PRESENT",
    notes: "",
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/admin/students").then((res) => setStudents(res.data));
    API.get("/admin/attendance").then((res) => setAttendanceList(res.data));
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    API.post("/admin/attendance", form)
      .then(() => {
        setMessage({ text: "✅ Attendance added successfully!", type: "success" });
        setTimeout(() => setMessage(null), 3000);
        setForm({
          studentId: "",
          date: new Date().toISOString().slice(0, 10),
          status: "PRESENT",
          notes: "",
        });
        API.get("/admin/attendance").then((res) => setAttendanceList(res.data));
      })
      .catch(() => {
        setMessage({ text: "❌ Failed to save attendance.", type: "danger" });
        setTimeout(() => setMessage(null), 3000);
      })
      .finally(() => setLoading(false));
  };

  const selectedAttendance = attendanceList.filter(
    (a) => a.studentId == form.studentId
  );

  const presentCount = selectedAttendance.filter(
    (a) => a.status === "PRESENT"
  ).length;
  const absentCount = selectedAttendance.filter(
    (a) => a.status === "ABSENT"
  ).length;
  const lateCount = selectedAttendance.filter(
    (a) => a.status === "LATE"
  ).length;
  const totalDays = selectedAttendance.length;
  const attendancePercentage =
    totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

  const pieData = [
    { name: "Present", value: presentCount },
    { name: "Absent", value: absentCount },
    { name: "Late", value: lateCount },
  ];
  const COLORS = ["#4c6ef5", "#f03e3e", "#fab005"];

  return (
    <div className="container py-4">
      <style>
        {`
          body {
            background: linear-gradient(145deg, #f8f9ff, #edf2ff);
            font-family: 'Inter', sans-serif;
          }

          .attendance-header {
            background: linear-gradient(120deg, #4c6ef5, #7950f2);
            color: #fff;
            border-radius: 18px;
            padding: 28px 40px;
            margin-bottom: 35px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          }

          .attendance-header h3 {
            font-weight: 700;
          }

          .attendance-card {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            border-radius: 18px;
            padding: 35px 25px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
          }

          .attendance-card:hover {
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

          .overview-metric {
            background: #f1f3ff;
            border-radius: 12px;
            padding: 15px 20px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            transition: 0.3s;
          }

          .overview-metric:hover {
            transform: translateY(-4px);
          }

          .overview-metric h5 {
            margin: 0;
            font-weight: 700;
            color: #343a40;
          }

          .overview-metric small {
            color: #666;
          }

          .table th {
            background: #4c6ef5;
            color: white;
            text-align: center;
          }

          .table td {
            text-align: center;
          }

          .attendance-table {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            overflow: hidden;
            margin-top: 30px;
          }
        `}
      </style>

      {/* Header */}
      <div className="attendance-header d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3>
            <FaClipboardList className="me-2" /> Attendance Management
          </h3>
          <p className="mb-0 text-light opacity-75">
            Record and analyze student attendance efficiently.
          </p>
        </div>
        <FaCalendarCheck size={28} className="opacity-75" />
      </div>

      {/* ✅ Notification */}
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

      {/* ✅ Add Attendance Form */}
      <div className="attendance-card mb-4">
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

          <div className="col-md-3">
            <label className="form-label fw-semibold">Date</label>
            <input
              type="date"
              className="form-control"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Status</label>
            <select
              className="form-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="LATE">Late</option>
            </select>
          </div>

          <div className="col-md-10">
            <label className="form-label fw-semibold">Notes</label>
            <input
              className="form-control"
              placeholder="Enter notes if any"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* ✅ Overview Dashboard */}
      {form.studentId && selectedAttendance.length > 0 && (
        <div className="attendance-card mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              <FaUserCheck className="me-2 text-primary" />
              Attendance Overview
            </h5>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <div className="overview-metric">
                <h5>{presentCount}</h5>
                <small>Days Present</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="overview-metric">
                <h5>{absentCount}</h5>
                <small>Days Absent</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="overview-metric">
                <h5>{lateCount}</h5>
                <small>Late Entries</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="overview-metric">
                <h5>{attendancePercentage}%</h5>
                <small>Attendance Rate</small>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ✅ Attendance Table */}
      {form.studentId && (
        <div className="attendance-table">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {selectedAttendance.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-3">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                selectedAttendance.map((a, i) => (
                  <tr key={i}>
                    <td>{a.date}</td>
                    <td>
                      <span
                        className={`badge ${
                          a.status === "PRESENT"
                            ? "bg-success"
                            : a.status === "ABSENT"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td>{a.notes || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
