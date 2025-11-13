import React, { useEffect, useState } from "react";
import API from "../api";
import { FaMedal, FaChartBar, FaTrophy } from "react-icons/fa";

export default function Results() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/results/student/${user.id}`)
      .then((res) => setResults(res.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading results...</p>
      </div>
    );
  }

  // ✅ Calculate summary
  const totalSubjects = results.length;
  const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
  const maxMarks = totalSubjects * 100; // assuming out of 100
  const percentage = totalSubjects ? ((totalMarks / maxMarks) * 100).toFixed(1) : 0;
  const grade =
    percentage >= 90
      ? "A+"
      : percentage >= 75
      ? "A"
      : percentage >= 60
      ? "B"
      : percentage >= 40
      ? "C"
      : "F";

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-primary mb-0">Results Overview</h2>
          <p className="text-muted mb-0">Academic performance summary</p>
        </div>
        <FaMedal size={36} className="text-warning" />
      </div>

      {/* ✅ Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 result-card text-center">
            <div className="card-body">
              <FaChartBar size={28} className="text-primary mb-2" />
              <h6 className="fw-bold">Total Subjects</h6>
              <h3>{totalSubjects}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 result-card text-center">
            <div className="card-body">
              <FaTrophy size={28} className="text-success mb-2" />
              <h6 className="fw-bold">Overall Percentage</h6>
              <h3>{percentage}%</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 result-card text-center">
            <div className="card-body">
              <FaMedal size={28} className="text-warning mb-2" />
              <h6 className="fw-bold">Grade</h6>
              <h3>{grade}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Progress Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h6 className="fw-bold mb-2">Performance</h6>
          <div className="progress" style={{ height: "25px" }}>
            <div
              className={`progress-bar ${
                percentage >= 75 ? "bg-success" : percentage >= 50 ? "bg-warning" : "bg-danger"
              }`}
              role="progressbar"
              style={{ width: `${percentage}%` }}
            >
              {percentage}%
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Detailed Results Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h6 className="fw-bold mb-3">Subject-wise Results</h6>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? (
                  results.map((r, index) => (
                    <tr key={index}>
                      <td>{r.subject}</td>
                      <td>{r.marks}</td>
                      <td>
                        {r.marks >= 40 ? (
                          <span className="badge bg-success px-3 py-2">Pass</span>
                        ) : (
                          <span className="badge bg-danger px-3 py-2">Fail</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No results available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
