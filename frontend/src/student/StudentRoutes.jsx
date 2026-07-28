import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { StudentAuthProvider } from './context/StudentAuthContext'
import StudentLayout from './layouts/StudentLayout'
import StudentProtectedRoute from './layouts/StudentProtectedRoute'
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
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
import BookmarksPage from './pages/bookmarks/BookmarksPage'
import CollegeCourseExplorer from './pages/colleges/CollegeCourseExplorer'
import TneaCutoffPage from './pages/colleges/TneaCutoffPage'
import CollegeDetailPage from './pages/colleges/CollegeDetailPage'
import CollegeCategoryPage from './pages/colleges/CollegeCategoryPage'
import ScholarshipDetailPage from './pages/scholarships/ScholarshipDetailPage'
import OnboardingPage from './pages/onboarding/OnboardingPage'
import RecommendationResultPage from './pages/onboarding/RecommendationResultPage'
import MaintenanceGuard from './components/common/MaintenanceGuard'
import Class5CommunicationPage from './pages/careers/Class5CommunicationPage'
import Class5PassportPage from './pages/careers/Class5PassportPage'
import './student.css'

export default function StudentRoutes() {
  return (
    <StudentAuthProvider>
      <MaintenanceGuard>
        <Routes>
        <Route element={<StudentLayout />}>
          {/* Redirect root → /home */}
          <Route index element={<Navigate to="/student/home" replace />} />

          {/* Home page at /home */}
          <Route path="home" element={<LandingPage />} />

          {/* Auth routes */}
          <Route path="signin" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />

          {/* Explicit class routes */}
          <Route path="class5" element={<ClassLevelPage level="5" />} />
          <Route path="class5/content/:slug" element={<ContentDetailPage />} />
          <Route path="class5/skills" element={<Navigate to="/student/class5?section=Skills" replace />} />
          <Route 
            path="class5/skills/communicationskills" 
            element={
              <StudentProtectedRoute>
                <Class5CommunicationPage />
              </StudentProtectedRoute>
            } 
          />
          <Route path="class5/skills/communicationskills/passport/:studentId" element={<Class5PassportPage />} />
          <Route path="class8" element={<ClassLevelPage level="8" />} />
          <Route path="class8/content/:slug" element={<ContentDetailPage />} />
          <Route path="class10" element={<ClassLevelPage level="10" />} />
          <Route path="class10/content/:slug" element={<ContentDetailPage />} />
          <Route path="class12" element={<ClassLevelPage level="12" />} />
          <Route path="class12/content/:slug" element={<ContentDetailPage />} />

          {/* New Descriptive Career Path Routes */}
          <Route path="career-path/class-5/:slug" element={<ContentDetailPage />} />
          <Route path="career-path/class-8/:slug" element={<ContentDetailPage />} />
          <Route path="career-path/class-10/:slug" element={<ContentDetailPage />} />
          <Route path="career-path/class-12/:slug" element={<ContentDetailPage />} />

          {/* Career routes */}
          <Route path="careers" element={<CareersPage />} />
          <Route path="careers/class/:classKey" element={<CareerClassPage />} />
          <Route path="careers/path/:id" element={<CareerDetailPage />} />


          {/* Exploration Routes */}
          <Route path="colleges" element={<CollegesPage />} />
          <Route path="colleges/:id" element={<CollegeDetailPage />} />
          <Route path="colleges/category/:categoryName" element={<CollegeCategoryPage />} />
          <Route path="colleges/explorer" element={<CollegeCourseExplorer />} />

          <Route path="scholarships" element={<ScholarshipsPage />} />

          <Route path="colleges/cutoff" element={<TneaCutoffPage />} />
          <Route path="scholarships" element={<ScholarshipsPage />} />
          <Route path="scholarships/:id" element={<ScholarshipDetailPage />} />
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
            path="bookmarks"
            element={
              <StudentProtectedRoute>
                <BookmarksPage />
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

          <Route
            path="onboarding"
            element={
              <StudentProtectedRoute>
                <OnboardingPage />
              </StudentProtectedRoute>
            }
          />
          <Route
            path="onboarding/result"
            element={
              <StudentProtectedRoute>
                <RecommendationResultPage />
              </StudentProtectedRoute>
            }
          />

          {/* Legacy redirects — old /student/* paths to new paths */}
          <Route path="student" element={<Navigate to="/student/home" replace />} />
          <Route path="login" element={<Navigate to="/student/signin" replace />} />
          <Route path="signup" element={<Navigate to="/student/signup" replace />} />

          {/* Catch-all → home */}
          <Route path="*" element={<Navigate to="/student/home" replace />} />
        </Route>
      </Routes>
      </MaintenanceGuard>
    </StudentAuthProvider>
  )
}