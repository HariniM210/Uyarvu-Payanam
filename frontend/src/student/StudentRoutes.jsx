import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { StudentAuthProvider } from './context/StudentAuthContext'
import StudentLayout from './layouts/StudentLayout'
import StudentProtectedRoute from './layouts/StudentProtectedRoute'
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import CareersPage from './pages/careers/CareersPage'
import CareerDetailPage from './pages/careers/CareerDetailPage'
import CollegesPage from './pages/colleges/CollegesPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import ProfilePage from './pages/profile/ProfilePage'
import './student.css'

export default function StudentRoutes() {
  return (
    <StudentAuthProvider>
      <Routes>
        <Route element={<StudentLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="careers/:slug" element={<CareerDetailPage />} />
          <Route path="colleges" element={<CollegesPage />} />
          <Route
            path="dashboard"
            element={
              <StudentProtectedRoute>
                <DashboardPage />
              </StudentProtectedRoute>
            }
          />
          <Route
            path="notifications"
            element={
              <StudentProtectedRoute>
                <NotificationsPage />
              </StudentProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <StudentProtectedRoute>
                <ProfilePage />
              </StudentProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="" replace />} />
        </Route>
      </Routes>
    </StudentAuthProvider>
  )
}
