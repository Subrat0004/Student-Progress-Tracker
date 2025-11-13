import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";

// Student Layout + Pages
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Assignments from "./pages/Assignments";
import Results from "./pages/Results";
import Attendance from "./pages/Attendance";
import Profile from "./pages/Profile";

// Admin Layout + Pages
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminResults from "./pages/admin/AdminResults";
import AdminAssignments from "./pages/admin/AdminAssignments";

export default function App() {
  return (
    <ThemeProvider>
      <Routes>

        {/* ✅ STUDENT ROUTES (Wrapped inside Layout) */}
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/assignments"
          element={
            <Layout>
              <Assignments />
            </Layout>
          }
        />

        <Route
          path="/results"
          element={
            <Layout>
              <Results />
            </Layout>
          }
        />

        <Route
          path="/attendance"
          element={
            <Layout>
              <Attendance />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />


        {/* ✅ PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />


        {/* ✅ ADMIN ROUTES (Wrapped inside Admin Layout) */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/students"
          element={
            <AdminLayout>
              <AdminStudents />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/attendance"
          element={
            <AdminLayout>
              <AdminAttendance />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/results"
          element={
            <AdminLayout>
              <AdminResults />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/assignments"
          element={
            <AdminLayout>
              <AdminAssignments />
            </AdminLayout>
          }
        />

      </Routes>
    </ThemeProvider>
  );
}
