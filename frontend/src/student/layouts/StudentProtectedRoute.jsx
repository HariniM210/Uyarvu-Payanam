import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useStudentAuth } from '../context/StudentAuthContext'

export default function StudentProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useStudentAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="student-root" style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid var(--s-border)',
          borderTop: '3px solid var(--s-primary)',
          animation: 's-spin 0.7s linear infinite',
        }} />
        <p style={{ fontFamily: 'var(--s-font-display)', fontSize: 14, color: 'var(--s-text3)' }}>
          Loading…
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/student/login" state={{ from: location }} replace />
  }

  return children
}
