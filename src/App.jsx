import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Auth/Login";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import UserManagement from "./components/Dashboard/UserManagement";
import MonthlyManagement from "./components/Dashboard/MonthlyManagement";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="user-management" element={<UserManagement />} />
                    <Route path="monthly-management" element={<MonthlyManagement />} />
                    <Route index element={<Navigate to="user-management" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
