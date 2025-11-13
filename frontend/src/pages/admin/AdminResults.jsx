import React, { useEffect, useState } from "react";
import API from "../../api";
import {
  FaChartBar,
  FaUserGraduate,
  FaClipboardList,
  FaTrophy,
  FaBookOpen,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AdminResults() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    studentId: "",
    subject: "",
    marks: "",
    maxMarks: 100,
    examDate: new Date().toISOString().slice(0, 10),
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [studentResults, setStudentResults] = useState([]); // Existing results
  const [studentInfo, setStudentInfo] = useState(null); // Selected student info

  const subjects = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Computer Science",
  ];

  // ✅ Load all students
  useEffect(() => {
    API.get("/admin/students").then((res) => setStudents(res.data));
  }, []);

  // ✅ Load results for selected student
  useEffect(() => {
    if (!form.studentId) {
      setStudentResults([]);
      setStudentInfo(null);
      return;
    }
    API.get(`/results/student/${form.studentId}`)
      .then((res) => setStudentResults(res.data || []))
      .catch(() => setStudentResults([]));

    const selected = students.find((s) => s.id == form.studentId);
    setStudentInfo(selected || null);
  }, [form.studentId, students]);

  // ✅ Submit new result
  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    API.post("/admin/results", form)
      .then(() => {
        setMessage({ text: "✅ Result added successfully!", type: "success" });
        setForm({ ...form, subject: "", marks: "" });
        setTimeout(() => setMessage(null), 3000);
        API.get(`/results/student/${form.studentId}`).then((res) =>
          setStudentResults(res.data || [])
        );
      })
      .catch(() => {
        setMessage({ text: "❌ Failed to save result.", type: "danger" });
        setTimeout(() => setMessage(null), 3000);
      })
      .finally(() => setLoading(false));
  };

  // ✅ Calculate stats
  const totalMarks = studentResults.reduce(
    (sum, r) => sum + Number(r.marks || 0),
    0
  );
  const totalMax = studentResults.reduce(
    (sum, r) => sum + Number(r.maxMarks || 0),
    0
  );
  const average =
    studentResults.length > 0
      ? (totalMarks / totalMax) * 100
      : 0;

  // ✅ Data for bar chart
  const chartData = studentResults.map((r) => ({
    subject: r.subject,
    percentage: ((r.marks / r.maxMarks) * 100).toFixed(1),
  }));

  return (
    <div className="container py-4">
      <style>
        {`
        body {
          background: linear-gradient(145deg, #f8faff, #edf1fc);
          font-family: 'Inter', sans-serif;
        }

        .results-header {
          background: linear-gradient(120deg, #4c6ef5, #7950f2);
          color: #fff;
          border-radius: 18px;
          padding: 28px 40px;
          margin-bottom: 35px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }

        .results-card, .overview-card {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          padding: 35px 25px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .results-card:hover, .overview-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
        }

        .table th {
          background: #4c6ef5;
          color: white;
          text-align: center;
        }

        .table td {
          text-align: center;
        }

        .alert-custom {
          border-radius: 12px;
          padding: 12px 18px;
          margin-bottom: 20px;
          animation: fadeIn 0.3s ease;
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
        `}
      </style>

      {/* Header */}
      <div className="results-header d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h3>
            <FaChartBar className="me-2" /> Results Management
          </h3>
          <p className="mb-0 text-light opacity-75">
            Add and analyze student performance in one place.
          </p>
        </div>
        <FaUserGraduate size={28} className="opacity-75" />
      </div>

      {/* ✅ Inline message */}
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

      {/* ✅ Add Result Form */}
      <div className="results-card mb-4">
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
            <label className="form-label fw-semibold">Subject</label>
            <select
              className="form-select"
              value={form.subject}
              required
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            >
              <option value="">-- Select Subject --</option>
              {subjects.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label fw-semibold">Marks (out of 100)</label>
            <input
              type="number"
              className="form-control"
              min="0"
              max="100"
              value={form.marks}
              required
              onChange={(e) => setForm({ ...form, marks: e.target.value })}
            />
          </div>

          <div className="col-md-2">
            <label className="form-label fw-semibold">Exam Date</label>
            <input
              type="date"
              className="form-control"
              value={form.examDate}
              onChange={(e) => setForm({ ...form, examDate: e.target.value })}
            />
          </div>

          <div className="col-md-1 d-flex align-items-end">
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* ✅ Student Overview Card */}
      {form.studentId && studentResults.length > 0 && (
        <div className="overview-card mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              <FaBookOpen className="me-2 text-primary" />
              Student Overview: {studentInfo?.name || "Student"}
            </h5>
            <FaTrophy size={20} className="text-warning" />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <div className="overview-metric">
                <h5>{studentResults.length}</h5>
                <small>Subjects Evaluated</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="overview-metric">
                <h5>{totalMarks}</h5>
                <small>Total Marks</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="overview-metric">
                <h5>{average.toFixed(1)}%</h5>
                <small>Average Percentage</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="overview-metric">
                <h5>{totalMax}</h5>
                <small>Total Possible Marks</small>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="percentage" fill="#4c6ef5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ✅ Student Results Table */}
      {form.studentId && (
        <div className="results-card">
          <h5 className="fw-bold mb-3">Results for Student ID: {form.studentId}</h5>
          {studentResults.length === 0 ? (
            <div className="text-center text-muted p-3">No results available.</div>
          ) : (
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Max Marks</th>
                  <th>Percentage</th>
                  <th>Exam Date</th>
                </tr>
              </thead>
              <tbody>
                {studentResults.map((r, i) => (
                  <tr key={i}>
                    <td>{r.subject}</td>
                    <td>{r.marks}</td>
                    <td>{r.maxMarks}</td>
                    <td>{((r.marks / r.maxMarks) * 100).toFixed(1)}%</td>
                    <td>{r.examDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
