import React, { useEffect, useState } from "react";
import API from "../api";
import { FaCalendarCheck, FaUserCheck, FaUserTimes } from "react-icons/fa";

export default function Attendance() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/attendance/student/${user.id}`)
      .then((res) => setAttendance(res.data))
      .catch(() => setAttendance([]))
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading attendance data...</p>
      </div>
    );
  }

  // ✅ Calculate totals
  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === "PRESENT").length;
  const absentDays = totalDays - presentDays;
  const presentPercent = totalDays ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-primary d-flex align-items-center">
        <FaCalendarCheck className="me-2" /> Attendance Overview
      </h2>

      {/* ✅ Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 attendance-card text-center">
            <div className="card-body">
              <FaCalendarCheck size={30} className="text-primary mb-2" />
              <h6 className="fw-bold">Total Classes</h6>
              <h3 className="fw-semibold">{totalDays}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 attendance-card text-center">
            <div className="card-body">
              <FaUserCheck size={30} className="text-success mb-2" />
              <h6 className="fw-bold">Present</h6>
              <h3 className="fw-semibold">{presentDays}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 attendance-card text-center">
            <div className="card-body">
              <FaUserTimes size={30} className="text-danger mb-2" />
              <h6 className="fw-bold">Absent</h6>
              <h3 className="fw-semibold">{absentDays}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Progress bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h6 className="fw-bold mb-2">Attendance Percentage</h6>
          <div className="progress" style={{ height: "25px" }}>
            <div
              className={`progress-bar ${
                presentPercent >= 75 ? "bg-success" : "bg-danger"
              }`}
              role="progressbar"
              style={{ width: `${presentPercent}%` }}
            >
              {presentPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Attendance List */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h6 className="fw-bold mb-3">Attendance Record</h6>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((a, index) => (
                  <tr key={index}>
                    <td>{new Date(a.date).toLocaleDateString()}</td>
                    <td>
                      {a.status === "PRESENT" ? (
                        <span className="badge bg-success px-3 py-2">Present</span>
                      ) : (
                        <span className="badge bg-danger px-3 py-2">Absent</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
