import React, { useEffect, useState } from "react";
import API from "../../api";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

// ================= 🎨 STYLE =================
const DashboardStyle = () => (
  <style>
    {`
      body {
        background: #f7f8fc;
      }

      .admin-header {
        background: linear-gradient(135deg, #4c6ef5, #7950f2);
        color: #fff;
        border-radius: 16px;
        padding: 30px 40px;
        margin-bottom: 35px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      }

      .admin-header h3 {
        font-weight: 700;
      }

      .card {
        border-radius: 16px;
        background: #ffffff;
        border: none;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        transition: all 0.3s ease;
      }

      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 25px rgba(0,0,0,0.12);
      }

      .info-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 25px;
      }

      .info-card h6 {
        margin-bottom: 0;
        font-size: 0.95rem;
        color: #6c757d;
      }

      .info-card .fs-4 {
        font-weight: 700;
        color: #212529;
      }

      select.form-select {
        border-radius: 12px;
        font-weight: 500;
        padding: 10px 14px;
      }

      .chart-title {
        font-weight: 600;
        color: #333;
        margin-bottom: 10px;
        text-align: center;
      }

      .data-summary {
        font-size: 0.9rem;
        color: #555;
      }
    `}
  </style>
);

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    API.get("/admin/students").then((res) => setStudents(res.data));
  }, []);

  const handleStudentChange = async (id) => {
    const student = students.find((s) => s.id === parseInt(id));
    setSelectedStudent(student);

    if (!id) return;

    const [att, assign, resu] = await Promise.all([
      API.get(`/attendance/student/${id}`).catch(() => ({ data: [] })),
      API.get(`/assignments/student/${id}`).catch(() => ({ data: [] })),
      API.get(`/results/student/${id}`).catch(() => ({ data: [] })),
    ]);

    setAttendance(att.data || []);
    setAssignments(assign.data || []);
    setResults(resu.data || []);
  };

  const COLORS = ["#28a745", "#dc3545", "#ffc107"];

  // ===== Process Data =====
  const present = attendance.filter((a) => a.status === "PRESENT").length;
  const absent = attendance.filter((a) => a.status === "ABSENT").length;
  const late = attendance.filter((a) => a.status === "LATE").length;
  const totalAttendance = present + absent + late;
  const attendanceRate =
    totalAttendance > 0 ? Math.round((present / totalAttendance) * 100) : 0;

  const attendanceData = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
    { name: "Late", value: late },
  ];

  const marksData = results.map((r) => ({
    subject: r.subject,
    marks: r.marks,
  }));

  const averageMarks =
    results.length > 0
      ? Math.round(
          results.reduce((acc, r) => acc + (r.marks / r.maxMarks) * 100, 0) /
            results.length
        )
      : 0;

  const assignmentStatusData = [
    {
      name: "Pending",
      count: assignments.filter((a) => a.status === "PENDING").length,
    },
    {
      name: "Submitted",
      count: assignments.filter((a) => a.status === "SUBMITTED").length,
    },
    {
      name: "Late",
      count: assignments.filter((a) => a.status === "LATE").length,
    },
  ];

  const totalAssignments = assignments.length;
  const submitted = assignments.filter((a) => a.status === "SUBMITTED").length;
  const submissionRate =
    totalAssignments > 0 ? Math.round((submitted / totalAssignments) * 100) : 0;

  return (
    <div className="container py-3">
      <DashboardStyle />

      {/* Header */}
      <div className="admin-header d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <h3>Admin Dashboard</h3>
          <p className="mb-0 opacity-75">
            Get a complete overview of each student’s performance.
          </p>
        </div>
        <select
          className="form-select w-auto mt-3 mt-md-0"
          onChange={(e) => handleStudentChange(e.target.value)}
        >
          <option value="">-- Select Student --</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.rollNo})
            </option>
          ))}
        </select>
      </div>

      {/* No student selected */}
      {!selectedStudent ? (
        <div className="text-center mt-5 text-muted fs-5">
          👈 Select a student to view their progress details
        </div>
      ) : (
        <>
          {/* Student Info */}
          <div className="card p-4 mb-4">
            <h5 className="mb-2">{selectedStudent.name}</h5>
            <div className="text-muted">
              Roll No: {selectedStudent.rollNo} | Email: {selectedStudent.email}
            </div>
          </div>

          {/* Info Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card info-card">
                <div>
                  <h6>Attendance Rate</h6>
                  <div className="fs-4">{attendanceRate}%</div>
                  <div className="data-summary">
                    Present: {present} | Absent: {absent} | Late: {late}
                  </div>
                </div>
                <div className="text-success fs-3">📅</div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card info-card">
                <div>
                  <h6>Average Grade</h6>
                  <div className="fs-4">{averageMarks}%</div>
                  <div className="data-summary">
                    Subjects: {results.length || 0}
                  </div>
                </div>
                <div className="text-primary fs-3">📊</div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card info-card">
                <div>
                  <h6>Assignments</h6>
                  <div className="fs-4">{submissionRate}%</div>
                  <div className="data-summary">
                    Total: {totalAssignments} | Submitted: {submitted}
                  </div>
                </div>
                <div className="text-warning fs-3">📝</div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card p-3 h-100">
                <h6 className="chart-title">Attendance Breakdown</h6>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card p-3 h-100">
                <h6 className="chart-title">Marks Performance</h6>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={marksData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="marks"
                      stroke="#007bff"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card p-3 h-100">
                <h6 className="chart-title">Assignment Status</h6>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={assignmentStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#6610f2" barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
