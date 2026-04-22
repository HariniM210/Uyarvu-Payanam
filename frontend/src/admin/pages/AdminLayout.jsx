import React, { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import styles from './AdminLayout.module.css'
import NotificationBell from '../components/NotificationBell'
import uyarvuLogo from '../../uyarvu-logo.png'

// Pages
import Dashboard from './admin/Dashboard'
import UsersPage from './admin/UsersPage'
import CareersPage from './admin/CareersPage'
import ClassDashboardPage from './admin/ClassDashboardPage'
import ClassFormPage from './admin/ClassFormPage'
import CoursesPage from './admin/CoursesPage'
import ExamsPage from './admin/ExamsPage'
import CollegesPage from './admin/CollegesPage'
import ScholarshipsPage from './admin/ScholarshipsPage'
import CutoffPage from './admin/CutoffPage'
import NotificationsPage from './admin/NotificationsPage'
import ReportsPage from './admin/ReportsPage'
import SettingsPage from './admin/SettingsPage'
import CareerDetailsPage from './admin/CareerDetailsPage'
import CourseDetailsEditPage from './admin/CourseDetailsEditPage'
import CollegeCourseMappingPage from './admin/CollegeCourseMappingPage'

const NAV = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard', path: '' },
  { id: 'users', icon: '👥', label: 'User Management', path: 'users' },
  { id: 'careers', icon: '🎯', label: 'Career Paths', path: 'careers' },
  { id: 'courses', icon: '📘', label: 'Course Management', path: 'courses' },
  { id: 'exams', icon: '📝', label: 'Exam Management', path: 'exams' },
  { id: 'colleges', icon: '🏫', label: 'College Management', path: 'colleges' },
  { id: 'scholarships', icon: '🎓', label: 'Scholarships', path: 'scholarships' },
  { id: 'cutoff', icon: '📈', label: 'Cutoff Management', path: 'cutoff' },
  { id: 'notifications', icon: '🔔', label: 'Notifications', path: 'notifications' },
  { id: 'reports', icon: '📉', label: 'Reports & Analytics', path: 'reports' },
  { id: 'mapping', icon: '🔗', label: 'Course offered colleges', path: 'mapping' },
  { id: 'settings', icon: '⚙️', label: 'Settings', path: 'settings' },
]

const PAGE_META = {
  '': { title: 'Dashboard', sub: 'Overview & Analytics' },
  'users': { title: 'User Management', sub: 'Manage student accounts' },
  'careers': { title: 'Career Paths', sub: 'Hub for academic roadmaps' },
  'courses': { title: 'Course Management', sub: 'Academic & skill courses' },
  'exams': { title: 'Exam Management', sub: 'Entrance exams & important dates' },
  'colleges': { title: 'College Management', sub: 'College database' },
  'scholarships': { title: 'Scholarships', sub: 'Scholarship listings & deadlines' },
  'cutoff': { title: 'Cutoff Management', sub: 'Year-wise cutoff data' },
  'notifications': { title: 'Notifications', sub: 'Send alerts to students' },
  'reports': { title: 'Reports & Analytics', sub: 'Data export & trends' },
  'mapping': { title: 'College-Course Mapping', sub: 'Connect courses to colleges' },
  'settings': { title: 'Settings', sub: 'System configuration' },
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { admin, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const currentPath = location.pathname.replace('/admin/', '').replace('/admin', '')
  const meta = PAGE_META[currentPath] || PAGE_META['']

  const go = (path) => navigate(path ? `/admin/${path}` : '/admin')

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className={`${styles.layout} ${sidebarOpen ? '' : styles.collapsed}`}>

      {/* ── SIDEBAR ── */}
      <aside className={styles.sidebar}>
        {/* Logo */}
        <div className={styles.sidebarLogo}>
          <img src={uyarvuLogo} alt="Logo" className={styles.sidebarLogoImg} />
          {sidebarOpen && (
            <div className={styles.logoText}>
              <span className={styles.logoName}>UYARVU PAYANAM</span>
              <span className={styles.logoSub}>Admin Panel</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          <div className={styles.navLabel}>{sidebarOpen && 'MAIN MENU'}</div>
          {NAV.map(n => {
            const isActive = currentPath === n.path || (n.id === 'careers' && currentPath.includes('career-paths'))
            return (
              <button key={n.id}
                className={`${styles.navItem} ${isActive ? styles.navActive : ''}`}
                onClick={() => go(n.path)}
                title={!sidebarOpen ? n.label : ''}>
                <span className={styles.navIcon}>{n.icon}</span>
                {sidebarOpen && <span className={styles.navLabel2}>{n.label}</span>}
                {sidebarOpen && n.badge && <span className={styles.navBadge}>{n.badge}</span>}
              </button>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className={styles.sidebarBottom}>
          {sidebarOpen && (
            <div className={styles.adminCard}>
              <div className={styles.adminAvatar}>SA</div>
              <div className={styles.adminInfo}>
                <span className={styles.adminName}>{admin?.name || 'Super Admin'}</span>
                <span className={styles.adminRole}>System Administrator</span>
              </div>
            </div>
          )}
          <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
            🚪 {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className={styles.main}>

        {/* Topbar */}
        <header className={styles.topbar}>
          <button className={styles.hamburger} onClick={() => setSidebarOpen(s => !s)}>
            ☰
          </button>
          <div>
            <h2 className={styles.topTitle}>{meta.title || 'Career Guidance'}</h2>
            <p className={styles.topSub}>UYARVU PAYANAM / {meta.sub || 'Level Management'}</p>
          </div>
          <div className={styles.topRight}>
            <button className={styles.topBtn} onClick={toggle}>
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
            <NotificationBell />
            <button className={styles.topBtnPrimary}>📤 Export</button>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UsersPage />} />
            
            {/* Career Path Module */}
            <Route path="careers" element={<CareersPage />} />
            <Route path="career-paths/:level" element={<ClassDashboardPage />} />
            <Route path="career-paths/:level/new" element={<ClassFormPage />} />
            <Route path="career-paths/:level/edit/:id" element={<ClassFormPage />} />
            
            <Route path="career/:level" element={<CareerDetailsPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/edit/:id" element={<CourseDetailsEditPage />} />
            <Route path="exams" element={<ExamsPage />} />
            <Route path="colleges" element={<CollegesPage />} />
            <Route path="scholarships" element={<ScholarshipsPage />} />
            <Route path="cutoff" element={<CutoffPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="mapping" element={<CollegeCourseMappingPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
        </main>

      </div>
    </div>
  )
}
