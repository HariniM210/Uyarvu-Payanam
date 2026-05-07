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
    return <Navigate to="/student/signin" state={{ from: location }} replace />
  }

  const { student } = useStudentAuth()
  const isClass5 = student?.classLevel === '5th' || student?.classLevel === 'Class 5' || student?.classLevel === '5';
  const isClass8 = student?.classLevel === '8th' || student?.classLevel === 'Class 8' || student?.classLevel === '8';
  const isClass10 = student?.classLevel === '10th' || student?.classLevel === 'Class 10' || student?.classLevel === '10';
  const isClass12 = student?.classLevel === '12th' || student?.classLevel === 'Class 12' || student?.classLevel === '12';
  
  if ((isClass5 || isClass8 || isClass10 || isClass12) && student?.onboardingCompleted === false && location.pathname !== '/student/onboarding') {
    return <Navigate to="/student/onboarding" replace />
  }

  return children
}
