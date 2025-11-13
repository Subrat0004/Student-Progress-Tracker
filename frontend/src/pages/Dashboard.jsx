import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer,
} from "recharts";

// ===== ✅ HELPER FUNCTIONS =====
const normStatus = (v) => (v ? String(v).trim().toUpperCase() : "");
const toDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};
const pct = (num, den) => (den > 0 ? Math.round((num / den) * 100) : 0);

// ===== ✅ STYLE BLOCK =====
const DashboardStyle = () => (
  <style>
    {`
      /* Ensure navbar doesn’t overlap */
      body {
        margin: 0;
        padding: 0;
        background: linear-gradient(145deg, #f8f9ff, #edf2ff);
        min-height: 100vh;
      }

      /* Proper spacing below navbar */
      .dashboard-wrapper {
        padding-top: 80px; /* fixes content under navbar */
      }

      .dashboard-card {
        transition: all 0.3s ease;
        border-radius: 16px;
        background: rgba(255,255,255,0.9);
        backdrop-filter: blur(10px);
        box-shadow: 0 6px 25px rgba(0,0,0,0.08);
      }

      .dashboard-card:hover {
        transform: translateY(-6px) scale(1.02);
        box-shadow: 0 12px 30px rgba(0,0,0,0.18);
      }

      .dashboard-header {
        background: linear-gradient(120deg, #007bff, #6610f2);
        color: white;
        border-radius: 18px;
        padding: 30px 40px;
        margin-bottom: 35px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      }

      .chart-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 26px rgba(0,0,0,0.12);
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .notification-item {
        animation: fadeIn 0.4s ease;
      }

      .btn-primary.btn-sm {
        background: linear-gradient(90deg, #007bff, #6610f2);
        border: none;
        border-radius: 10px;
        padding: 6px 14px;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .btn-primary.btn-sm:hover {
        background: linear-gradient(90deg, #6610f2, #007bff);
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      }
    `}
  </style>
);

// ===== KPI Card =====
function KpiCard({ title, value, footer, color }) {
  return (
    <div className="card shadow-sm border-0 dashboard-card">
      <div className="card-body d-flex align-items-center justify-content-between">
        <div>
          <div className="text-muted small mb-1">{title}</div>
          <div className="fw-bold fs-4">{value}</div>
        </div>
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: 46,
            height: 46,
            background: `${color}22`,
            color,
            fontWeight: "bold",
          }}
        >
          {title[0]}
        </div>
      </div>
      {footer && (
        <div className="border-top text-muted small px-3 py-2">{footer}</div>
      )}
    </div>
  );
}

// ===== Chart Card =====
function ChartCard({ title, badge, children, onClick }) {
  return (
    <div
      className="card chart-card border-0 h-100 dashboard-card"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <div className="card-header bg-white border-0 pb-0">
        <div className="d-flex align-items-center justify-content-between">
          <h6 className="mb-0">{title}</h6>
          {badge && <span className={`badge ${badge.class}`}>{badge.text}</span>}
        </div>
      </div>
      <div className="card-body">{children}</div>
      <div className="card-footer bg-white border-0 text-end">
        <button className="btn btn-sm btn-outline-primary">View details →</button>
      </div>
    </div>
  );
}

// ===== ✅ NOTIFICATIONS PANEL =====
function NotificationCenter({ assignments = [], results = [], attendance = [] }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newNotifs = [];

    assignments.forEach((a) => {
      if (a.dueDate) {
        const due = new Date(a.dueDate);
        const daysLeft = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24));
        newNotifs.push({
          id: `A-${a.id}`,
          type: "Assignment",
          title: a.title || "New Assignment",
          msg:
            daysLeft > 0
              ? `Due in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`
              : `Assignment due date passed!`,
          color: daysLeft > 0 ? "warning" : "danger",
        });
      }
    });

    results.forEach((r) => {
      newNotifs.push({
        id: `R-${r.id}`,
        type: "Result",
        title: `${r.subject} Result`,
        msg: `Marks: ${r.marks}/${r.maxMarks}`,
        color: "info",
      });
    });

    const total = attendance.length;
    const present = attendance.filter((a) => a.status === "PRESENT").length;
    const rate = total ? Math.round((present / total) * 100) : 0;
    if (rate < 75 && total > 0) {
      newNotifs.push({
        id: "ATT-LOW",
        type: "Attendance",
        title: "Low Attendance",
        msg: `Your attendance is ${rate}%. Try to improve!`,
        color: "danger",
      });
    }

    newNotifs.reverse();
    setNotifications(newNotifs);
  }, [assignments, results, attendance]);

  const dismissNotif = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="card shadow-sm border-0 dashboard-card mt-4">
      <div className="card-header bg-white border-0 pb-0 d-flex justify-content-between">
        <h6 className="mb-0">Notifications</h6>
        {notifications.length > 0 && (
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => setNotifications([])}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="card-body">
        {notifications.length === 0 ? (
          <div className="text-muted text-center py-3">No new notifications 🎉</div>
        ) : (
          <ul className="list-group list-group-flush">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`list-group-item d-flex justify-content-between align-items-start border-0 mb-2 rounded shadow-sm bg-light notification-item`}
              >
                <div className="ms-2 me-auto">
                  <div className="fw-semibold">
                    <span
                      className={`badge bg-${n.color} me-2 text-uppercase`}
                      style={{ fontSize: "0.7rem" }}
                    >
                      {n.type}
                    </span>
                    {n.title}
                  </div>
                  <div className="text-muted small">{n.msg}</div>
                </div>

                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => dismissNotif(n.id)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ===== MAIN DASHBOARD =====
export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [results, setResults] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    setUser(u);
  }, []);

  const fetchAll = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const a1 = await API.get(`/assignments/student/${user.id}`).catch(() => ({ data: [] }));
      const a2 = await API.get(`/results/student/${user.id}`).catch(() => ({ data: [] }));
      const a3 = await API.get(`/attendance/student/${user.id}`).catch(() => ({ data: [] }));
      setAssignments(a1.data || []);
      setResults(a2.data || []);
      setAttendance(a3.data || []);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchAll();
  }, [user, fetchAll]);

  const normAttendance = attendance.map((a) => ({
    ...a,
    status: normStatus(a.status),
    date: toDate(a.date),
  }));
  const present = normAttendance.filter((a) => a.status === "PRESENT").length;
  const absent = normAttendance.filter((a) => a.status === "ABSENT").length;
  const late = normAttendance.filter((a) => a.status === "LATE").length;
  const attendancePie = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
    { name: "Late", value: late },
  ];
  const attendancePct = pct(present, present + absent + late);

  const normAssignments = assignments.map((a) => ({
    ...a,
    status: normStatus(a.status),
    dueDate: toDate(a.dueDate),
    title: a.title || "Untitled",
  }));
  const pending = normAssignments.filter((a) => a.status === "PENDING").length;
  const submitted = normAssignments.filter((a) => a.status === "SUBMITTED").length;
  const lateAssign = normAssignments.filter((a) => a.status === "LATE").length;
  const assignmentBar = [
    { name: "Pending", count: pending },
    { name: "Submitted", count: submitted },
    { name: "Late", count: lateAssign },
  ];

  const normResults = results.map((r) => ({
    ...r,
    examDate: toDate(r.examDate),
    marks: Number(r.marks),
    maxMarks: Number(r.maxMarks),
    subject: r.subject || "Unknown",
  }));
  const resultLine = normResults
    .filter((r) => r.examDate)
    .sort((a, b) => a.examDate - b.examDate)
    .map((r) => ({
      when: r.examDate.toLocaleDateString(),
      pct: pct(r.marks, r.maxMarks),
    }));
  const avgPct =
    normResults.length > 0
      ? Math.round(
          normResults.reduce(
            (acc, r) => acc + (r.maxMarks ? (r.marks / r.maxMarks) * 100 : 0),
            0
          ) / normResults.length
        )
      : 0;

  return (
    <div className="dashboard-wrapper">
      <DashboardStyle />

      <div className="dashboard-header mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h3>Welcome back, {user?.name} 👋</h3>
            <div className="text-muted">
              Here’s a quick look at your academic performance.
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm mt-3 mt-md-0"
            onClick={fetchAll}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <KpiCard
            title="Attendance"
            value={attendancePct + "%"}
            footer={`Present ${present} · Absent ${absent} · Late ${late}`}
            color="#198754"
          />
        </div>
        <div className="col-md-4">
          <KpiCard
            title="Pending Assignments"
            value={pending}
            footer={`Submitted ${submitted} · Late ${lateAssign}`}
            color="#ffc107"
          />
        </div>
        <div className="col-md-4">
          <KpiCard
            title="Average Grade"
            value={avgPct + "%"}
            footer={`Subjects ${new Set(normResults.map((r) => r.subject)).size}`}
            color="#0d6efd"
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-4">
          <ChartCard
            title="Attendance"
            badge={{ text: `${attendancePct}%`, class: "bg-success" }}
            onClick={() => navigate("/attendance")}
          >
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={attendancePie} dataKey="value" nameKey="name" outerRadius={85} label>
                  <Cell fill="#198754" />
                  <Cell fill="#dc3545" />
                  <Cell fill="#ffc107" />
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div className="col-lg-4">
          <ChartCard
            title="Grades Timeline"
            badge={{ text: `${avgPct}% avg`, class: "bg-primary" }}
            onClick={() => navigate("/results")}
          >
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={resultLine}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="when" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pct" name="Score (%)" stroke="#0d6efd" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div className="col-lg-4">
          <ChartCard
            title="Assignments"
            badge={{ text: `${pending} pending`, class: "bg-warning text-dark" }}
            onClick={() => navigate("/assignments")}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={assignmentBar}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#6610f2" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* ✅ New Notification Center */}
      <NotificationCenter
        assignments={assignments}
        results={results}
        attendance={attendance}
      />
    </div>
  );
}
