import React, { useEffect, useState } from "react";
import API from "../api";
import { FaUserCircle, FaEnvelope, FaIdBadge, FaCalendarAlt, FaEdit } from "react-icons/fa";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    attendanceRate: 0,
    avgMarks: 0,
    totalAssignments: 0,
    submittedAssignments: 0,
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", rollNo: "" });

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    setUser(u);
    setForm({ name: u?.name || "", email: u?.email || "", rollNo: u?.rollNo || "" });

    if (u) {
      Promise.all([
        API.get(`/attendance/student/${u.id}`),
        API.get(`/results/student/${u.id}`),
        API.get(`/assignments/student/${u.id}`),
      ]).then(([att, res, asg]) => {
        const present = att.data.filter((a) => a.status === "PRESENT").length;
        const total = att.data.length;
        const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

        const avgMarks =
          res.data.length > 0
            ? Math.round(
                res.data.reduce((sum, r) => sum + r.marks, 0) / res.data.length
              )
            : 0;

        const submittedAssignments = asg.data.filter(
          (a) => a.status === "SUBMITTED"
        ).length;

        setStats({
          attendanceRate,
          avgMarks,
          totalAssignments: asg.data.length,
          submittedAssignments,
        });
      });
    }
  }, []);

  const handleSave = () => {
    // Optional: Add an API PUT call if you want profile update functionality
    localStorage.setItem("user", JSON.stringify({ ...user, ...form }));
    setUser({ ...user, ...form });
    setEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="container py-4">
      <ProfileStyle />

      {/* ===== Header Card ===== */}
      <div className="profile-header shadow-sm">
        <div className="d-flex align-items-center flex-wrap">
          <FaUserCircle className="profile-avatar" />
          <div>
            <h2 className="fw-bold mb-0">{user?.name}</h2>
            <div className="text-light small">
              Roll No: {user?.rollNo || "—"} | {user?.email}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Info Section ===== */}
      <div className="row mt-4 g-4">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm profile-card">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold">Profile Information</h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => setEditing(!editing)}
              >
                <FaEdit className="me-1" /> {editing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={!editing}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  className="form-control"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={!editing}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Roll Number</label>
                <input
                  className="form-control"
                  value={form.rollNo}
                  onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
                  disabled={!editing}
                />
              </div>

              {editing && (
                <div className="text-end">
                  <button className="btn btn-primary" onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== Stats Section ===== */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm stats-card p-3 text-center">
            <h6 className="fw-bold text-muted mb-3">Performance Summary</h6>

            <div className="stat-box bg-success text-white mb-3">
              Attendance: {stats.attendanceRate}%
            </div>

            <div className="stat-box bg-primary text-white mb-3">
              Avg Marks: {stats.avgMarks}%
            </div>

            <div className="stat-box bg-warning text-dark mb-3">
              Assignments: {stats.submittedAssignments}/{stats.totalAssignments}
            </div>

            <div className="text-muted small">
              <FaCalendarAlt className="me-2" />
              Last updated just now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== ✅ STYLING =====
const ProfileStyle = () => (
  <style>
    {`
      .profile-header {
        background: linear-gradient(135deg, #007bff, #6610f2);
        color: white;
        border-radius: 18px;
        padding: 30px 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
      }

      .profile-avatar {
        font-size: 70px;
        margin-right: 20px;
        color: #ffffffcc;
      }

      .profile-card {
        border-radius: 16px;
        background: #ffffffee;
        backdrop-filter: blur(6px);
        transition: all 0.3s ease;
      }

      .profile-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      }

      .stats-card {
        border-radius: 16px;
        background: #ffffffee;
        backdrop-filter: blur(8px);
      }

      .stat-box {
        border-radius: 10px;
        padding: 10px;
        font-weight: 600;
        font-size: 0.95rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
      }

      .stat-box:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 18px rgba(0,0,0,0.15);
      }

      input.form-control:disabled {
        background: #f8f9fa;
      }
    `}
  </style>
);
