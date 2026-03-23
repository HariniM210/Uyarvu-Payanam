import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { StudentAuthProvider } from './context/StudentAuthContext'
import StudentLayout from './layouts/StudentLayout'
import StudentProtectedRoute from './layouts/StudentProtectedRoute'
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import CareersPage from './pages/careers/CareersPage'
import CareerClassPage from './pages/careers/CareerClassPage'
import CareerDetailPage from './pages/careers/CareerDetailPage'
import CollegesPage from './pages/colleges/CollegesPage'
import CoursesPage from './pages/courses/CoursesPage'
import CourseCategoryPage from './pages/courses/CourseCategoryPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import ProfilePage from './pages/profile/ProfilePage'
import ClassLandingPage from './pages/careers/ClassLandingPage'
import './student.css'

export default function StudentRoutes() {
  const { pathname } = useLocation()

  // Helper to determine what to show at the index path based on parent route
  const getIndexElement = () => {
    if (pathname.includes('/class5')) return <ClassLandingPage classKey="class-5" />
    if (pathname.includes('/class8')) return <ClassLandingPage classKey="class-8" />
    if (pathname.includes('/class10')) return <ClassLandingPage classKey="class-10" />
    if (pathname.includes('/class12')) return <ClassLandingPage classKey="class-12" />
    return <LandingPage />
  }

  return (
    <StudentAuthProvider>
      <Routes>
        <Route element={<StudentLayout />}>
          {/* Main index - shows landing OR specific class based on URL prefix */}
          <Route index element={getIndexElement()} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />

          {/* Legacy/Explicit paths (/student/class5 etc) still work */}
          <Route path="class5" element={<ClassLandingPage classKey="class-5" />} />
          <Route path="class8" element={<ClassLandingPage classKey="class-8" />} />
          <Route path="class10" element={<ClassLandingPage classKey="class-10" />} />
          <Route path="class12" element={<ClassLandingPage classKey="class-12" />} />

          {/* Career routes */}
          <Route path="careers" element={<CareersPage />} />
          <Route path="careers/class/:classKey" element={<CareerClassPage />} />
          <Route path="careers/path/:id" element={<CareerDetailPage />} />

          <Route path="colleges" element={<CollegesPage />} />
          <Route path="courses" element={<CoursesPage />} />
          {/* Handles both level-based (after-10th) and general search */}
          <Route path="courses/:categoryKey" element={<CourseCategoryPage />} />
          
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