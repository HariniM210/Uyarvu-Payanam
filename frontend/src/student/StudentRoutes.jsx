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
import ScholarshipsPage from './pages/scholarships/ScholarshipsPage'
import ClassLandingPage from './pages/careers/ClassLandingPage'
import ClassLevelPage from './pages/careers/ClassLevelPage'
import ContentDetailPage from './pages/careers/ContentDetailPage'
import CourseDetailPage from './pages/courses/CourseDetailPage'
import './student.css'

export default function StudentRoutes() {
  const { pathname } = useLocation()

  // Helper to determine what to show at the index path based on parent route
  const getIndexElement = () => {
    if (pathname.includes('/class5')) return <ClassLevelPage level="5" />
    if (pathname.includes('/class8')) return <ClassLevelPage level="8" />
    if (pathname.includes('/class10')) return <ClassLevelPage level="10" />
    if (pathname.includes('/class12')) return <ClassLevelPage level="12" />
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

          {/* Explicit class routes */}
          <Route path="class5" element={<ClassLevelPage level="5" />} />
          <Route path="class5/content/:slug" element={<ContentDetailPage />} />
          <Route path="class8" element={<ClassLevelPage level="8" />} />
          <Route path="class8/content/:slug" element={<ContentDetailPage />} />
          <Route path="class10" element={<ClassLevelPage level="10" />} />
          <Route path="class10/content/:slug" element={<ContentDetailPage />} />
          <Route path="class12" element={<ClassLevelPage level="12" />} />
          <Route path="class12/content/:slug" element={<ContentDetailPage />} />

          {/* Career routes */}
          <Route path="careers" element={<CareersPage />} />
          <Route path="careers/class/:classKey" element={<CareerClassPage />} />
          <Route path="careers/path/:id" element={<CareerDetailPage />} />

          <Route path="colleges" element={<CollegesPage />} />
          <Route path="scholarships" element={<ScholarshipsPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:categoryKey" element={<CourseCategoryPage />} />
          <Route path="course/:slug" element={<CourseDetailPage />} />
          
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