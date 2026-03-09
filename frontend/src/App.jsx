import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './admin/context/ThemeContext'
import { AuthProvider, useAuth } from './admin/context/AuthContext'
import { NotificationProvider } from './admin/context/NotificationContext'
import LoginPage from './admin/pages/LoginPage'
import AdminLayout from './admin/pages/AdminLayout'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()
  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/admin" replace /> : <LoginPage />}
      />
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
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}