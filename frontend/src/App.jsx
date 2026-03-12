import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './admin/context/ThemeContext'
import { AuthProvider, useAuth } from './admin/context/AuthContext'
import { NotificationProvider } from './admin/context/NotificationContext'
import LoginPage from './admin/pages/LoginPage'
import AdminLayout from './admin/pages/AdminLayout'

// ── Student Frontend ─────────────────────────────────────────────────────────
import StudentRoutes from './student/StudentRoutes'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()
  return (
    <Routes>
      {/* ── Admin Auth ── */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/admin" replace /> : <LoginPage />}
      />

      {/* ── Admin Panel ── */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <NotificationProvider>
              <AdminLayout />
            </NotificationProvider>
          </ProtectedRoute>
        }
      />

      {/* ── Student Frontend ── */}
      <Route path="/student/*" element={<StudentRoutes />} />

      {/* ── Default: go to student landing ── */}
      <Route path="/" element={<Navigate to="/student" replace />} />
      <Route path="*" element={<Navigate to="/student" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}
