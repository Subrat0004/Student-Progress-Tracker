import React, { useEffect, useState } from "react";
import API from "../api";
import { FaCalendarAlt, FaClipboardList, FaCheckCircle } from "react-icons/fa";

export default function Assignments() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/assignments/student/${user.id}`)
      .then((res) => setAssignments(res.data))
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, [user.id]);

  const handleSubmit = async (assignment) => {
    const now = new Date();
    const due = new Date(assignment.dueDate);
    let newStatus = now > due ? "LATE" : "SUBMITTED";

    try {
      await API.put(`/assignments/${assignment.id}/status`, { status: newStatus });
      alert(`Assignment marked as ${newStatus}`);

      setAssignments((prev) =>
        prev.map((a) =>
          a.id === assignment.id ? { ...a, status: newStatus } : a
        )
      );
    } catch {
      alert("Failed to submit assignment");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading assignments...</p>
      </div>
    );
  }

  const getBadge = (status) => {
    switch (status) {
      case "SUBMITTED":
        return <span className="badge bg-success px-3 py-2">Submitted</span>;
      case "LATE":
        return <span className="badge bg-danger px-3 py-2">Late</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2">Pending</span>;
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-primary d-flex align-items-center">
        <FaClipboardList className="me-2" /> Assignments
      </h2>

      {assignments.length === 0 ? (
        <div className="alert alert-info text-center shadow-sm">
          No assignments available yet.
        </div>
      ) : (
        <div className="row g-4">
          {assignments.map((a) => {
            const isSubmitted = a.status === "SUBMITTED" || a.status === "LATE";

            return (
              <div key={a.id} className="col-md-4 col-lg-3">
                <div
                  className="card h-100 border-0 shadow-sm assignment-card"
                  style={{
                    borderRadius: "14px",
                    transition: "all 0.25s ease",
                  }}
                >
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="fw-semibold mb-2">{a.title}</h5>
                      <p className="text-muted small">{a.description}</p>

                      <div className="d-flex align-items-center text-muted small mb-2">
                        <FaCalendarAlt className="me-2 text-secondary" />
                        <span>
                          Due:{" "}
                          {new Date(a.dueDate).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="mb-3">{getBadge(a.status)}</div>
                    </div>

                    <div>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          disabled={isSubmitted}
                          checked={isSubmitted}
                          readOnly
                        />
                        <label className="form-check-label small">
                          Mark as completed
                        </label>
                      </div>

                      <button
                        className="btn btn-primary w-100 btn-sm d-flex align-items-center justify-content-center"
                        disabled={isSubmitted}
                        onClick={() => handleSubmit(a)}
                      >
                        <FaCheckCircle className="me-2" />
                        {isSubmitted ? "Submitted" : "Submit Assignment"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}