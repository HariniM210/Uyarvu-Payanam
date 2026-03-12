import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useStudentAuth } from '../../context/StudentAuthContext'
import {
  notificationService,
  careerService,
  courseService,
  examService,
  scholarshipService,
  collegeService,
} from '../../services'
import { SBtn, SLoader, SSectionHeader, SEmpty } from '../../components/ui'
import {
  FiGrid, FiBookOpen, FiMapPin, FiFileText, FiAward,
  FiBell, FiUser, FiSettings, FiLogOut, FiArrowRight,
  FiClock, FiMenu, FiX,
} from 'react-icons/fi'
import s from './DashboardPage.module.css'

/* ── Sidebar navigation config ─────────────────────────────── */
const SIDEBAR_NAV = [
  { id: 'dashboard',     icon: FiGrid,     label: 'Dashboard',      to: '/student/dashboard' },
  { id: 'courses',       icon: FiBookOpen, label: 'Courses',        to: '/student/careers' },
  { id: 'colleges',      icon: FiMapPin,   label: 'Colleges',       to: '/student/colleges' },
  { id: 'exams',         icon: FiFileText, label: 'Entrance Exams', to: '/student/careers' },
  { id: 'scholarships',  icon: FiAward,    label: 'Scholarships',   to: '/student/careers' },
  { id: 'notifications', icon: FiBell,     label: 'Notifications',  to: '/student/notifications' },
  { id: 'profile',       icon: FiUser,     label: 'Profile',        to: '/student/profile' },
  { id: 'settings',      icon: FiSettings, label: 'Settings',       to: '/student/profile' },
]

/* ── Stat card gradient presets ─────────────────────────────── */
const STAT_GRADIENTS = [
  'linear-gradient(135deg, #1d5fba 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #e17055 0%, #f97316 100%)',
  'linear-gradient(135deg, #c48a1a 0%, #eab308 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
]

/* ── Recommended careers (static) ──────────────────────────── */
const CAREER_CARDS = [
  { icon: '⚙️', title: 'Engineering',  sub: 'Build the future',      bg: '#eaf0fb', color: '#1d5fba' },
  { icon: '🩺', title: 'Medicine',     sub: 'Heal & innovate',       bg: '#fce4ec', color: '#c62828' },
  { icon: '📊', title: 'Commerce',     sub: 'Business & finance',    bg: '#fdf4e0', color: '#c48a1a' },
  { icon: '🎨', title: 'Arts',         sub: 'Create & express',      bg: '#f3effe', color: '#7c3aed' },
]

/* ── TimeAgo helper ────────────────────────────────────────── */
function timeAgo(date) {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

/* ══════════════════════════════════════════════════════════════
   DASHBOARD PAGE
   ══════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { student, logout } = useStudentAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  /* ── Data state ─────────────────────────────────────────── */
  const [notifications, setNotifications] = useState([])
  const [careers, setCareers] = useState([])
  const [exams, setExams] = useState([])
  const [scholarships, setScholarships] = useState([])
  const [stats, setStats] = useState({ courses: 0, exams: 0, scholarships: 0, colleges: 0 })
  const [loading, setLoading] = useState(true)

  /* ── Fetch all data on mount ────────────────────────────── */
  useEffect(() => {
    const normalize = (res) => {
      if (Array.isArray(res)) return res
      if (Array.isArray(res?.data)) return res.data
      if (Array.isArray(res?.careers)) return res.careers
      if (Array.isArray(res?.courses)) return res.courses
      if (Array.isArray(res?.exams)) return res.exams
      if (Array.isArray(res?.scholarships)) return res.scholarships
      if (Array.isArray(res?.colleges)) return res.colleges
      return []
    }

    Promise.allSettled([
      notificationService.getAll(),
      careerService.getAll(),
      examService.getAll(),
      scholarshipService.getAll(),
      courseService.getAll(),
      collegeService.getAll(),
    ]).then(([notifR, careerR, examR, scholR, courseR, collegeR]) => {
      const notifs = normalize(notifR.value)
      setNotifications(notifs.slice(0, 3))
      setCareers(normalize(careerR.value).slice(0, 6))

      const examArr = normalize(examR.value)
      setExams(examArr.slice(0, 4))

      const scholArr = normalize(scholR.value)
      setScholarships(scholArr.slice(0, 3))

      setStats({
        courses: normalize(courseR.value).length,
        exams: examArr.length,
        scholarships: scholArr.length,
        colleges: normalize(collegeR.value).length,
      })
      setLoading(false)
    })
  }, [])

  /* ── Derived ────────────────────────────────────────────── */
  const unreadCount = notifications.filter((n) => !n.isRead).length
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = student?.name?.split(' ')[0] || 'Student'

  const handleLogout = () => {
    logout()
    navigate('/student/login')
  }

  /* ── Stat card data ─────────────────────────────────────── */
  const STAT_CARDS = [
    { icon: '📘', label: 'Courses Available', value: stats.courses },
    { icon: '📝', label: 'Entrance Exams', value: stats.exams },
    { icon: '🎓', label: 'Scholarships', value: stats.scholarships },
    { icon: '🏫', label: 'Colleges', value: stats.colleges },
  ]

  return (
    <div className={s.layout}>

      {/* ── SIDEBAR ──────────────────────────────────────── */}
      {sidebarOpen && <div className={s.overlay} onClick={() => setSidebarOpen(false)} />}

      <aside className={`${s.sidebar} ${sidebarOpen ? s.sidebarOpen : ''}`}>
        <div className={s.sidebarLabel}>Menu</div>

        {SIDEBAR_NAV.map(({ id, icon: Icon, label, to }) => {
          const isActive = id === 'dashboard'
            ? location.pathname === '/student/dashboard'
            : location.pathname.startsWith(to) && id !== 'dashboard'
          return (
            <Link
              key={id}
              to={to}
              className={`${s.navItem} ${isActive ? s.navItemActive : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={16} />
              {label}
              {id === 'notifications' && unreadCount > 0 && (
                <span className={s.navBadge}>{unreadCount}</span>
              )}
            </Link>
          )
        })}

        <div className={s.sidebarDivider} />

        <button
          className={`${s.navItem} ${s.navItemDanger}`}
          onClick={handleLogout}
        >
          <FiLogOut size={16} />
          Logout
        </button>

        {/* Profile card at bottom */}
        <div className={s.sidebarBottom}>
          <div className={s.profileCard}>
            <div className={s.profileAvatar}>
              {student?.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <div>
              <div className={s.profileName}>{firstName}</div>
              <div className={s.profileSub}>
                {student?.classLevel ? `Class ${student.classLevel}` : 'Student'}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        className={s.mobileToggle}
        onClick={() => setSidebarOpen((o) => !o)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <div className={s.main}>

        {/* Welcome Banner */}
        <div className={`${s.welcomeBanner} s-anim-up`}>
          <div className={s.welcomeGreet}>{greet} 👋</div>
          <div className={s.welcomeName}>Welcome back, {firstName}!</div>
          <div className={s.welcomeDesc}>
            Explore your future career paths, find the right colleges, and never miss an exam deadline.
          </div>
          <div className={s.welcomeBadges}>
            {student?.classLevel && <span className={s.welcomeTag}>🎓 Class {student.classLevel}</span>}
            {student?.district && <span className={s.welcomeTag}>📍 {student.district}</span>}
            {unreadCount > 0 && <span className={s.welcomeTag}>🔔 {unreadCount} new alert{unreadCount > 1 ? 's' : ''}</span>}
          </div>
        </div>

        {loading ? (
          <SLoader />
        ) : (
          <>
            {/* ── Statistics Cards ─────────────────────────── */}
            <div className={`${s.statsGrid} s-anim-up s-d1`}>
              {STAT_CARDS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={s.statCard}
                  style={{ background: STAT_GRADIENTS[i] }}
                >
                  <div className={s.statIcon}>{stat.icon}</div>
                  <div className={s.statValue}>{stat.value}</div>
                  <div className={s.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* ── Recommended Careers ──────────────────────── */}
            <div className="s-anim-up s-d2" style={{ marginBottom: 28 }}>
              <SSectionHeader
                title="🧭 Recommended Careers"
                subtitle="Popular career paths for students"
                action={() => navigate('/student/careers')}
                actionLabel="View All"
              />
              <div className={s.careerGrid}>
                {CAREER_CARDS.map((c) => (
                  <Link key={c.title} to="/student/careers" className={s.careerCard}>
                    <div className={s.careerIcon} style={{ background: c.bg }}>
                      {c.icon}
                    </div>
                    <div className={s.careerTitle}>{c.title}</div>
                    <div className={s.careerSub}>{c.sub}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── 2-Column: Upcoming Exams + Latest Scholarships ── */}
            <div className={`${s.sectionGrid} s-anim-up s-d3`}>

              {/* Upcoming Exams */}
              <div>
                <SSectionHeader
                  title="📝 Upcoming Exams"
                  subtitle="Important entrance exams"
                />
                {exams.length === 0 ? (
                  <SEmpty icon="📝" title="No exams listed yet" />
                ) : (
                  <div className={s.examList}>
                    {exams.map((exam, i) => {
                      const colors = ['#eaf0fb', '#fce4ec', '#fdf4e0', '#f3effe']
                      const textColors = ['#1d5fba', '#c62828', '#c48a1a', '#7c3aed']
                      return (
                        <div key={exam._id || i} className={s.examCard}>
                          <div
                            className={s.examIcon}
                            style={{ background: colors[i % 4], color: textColors[i % 4] }}
                          >
                            📝
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className={s.examTitle}>{exam.name || exam.title || 'Exam'}</div>
                            <div className={s.examMeta}>
                              <FiClock size={11} />
                              {exam.date ? formatDate(exam.date) : exam.lastDate ? formatDate(exam.lastDate) : 'Date TBA'}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Latest Scholarships */}
              <div>
                <SSectionHeader
                  title="🎓 Latest Scholarships"
                  subtitle="Don't miss these deadlines"
                />
                {scholarships.length === 0 ? (
                  <SEmpty icon="🎓" title="No scholarships yet" />
                ) : (
                  <div className={s.scholarshipList}>
                    {scholarships.map((sch, i) => (
                      <div key={sch._id || i} className={s.scholarshipCard}>
                        <div className={s.scholarshipTitle}>
                          {sch.name || sch.title || 'Scholarship'}
                        </div>
                        <div className={s.scholarshipProvider}>
                          {sch.provider || sch.organization || sch.fundedBy || 'Provider N/A'}
                        </div>
                        {(sch.deadline || sch.lastDate) && (
                          <span className={s.scholarshipDeadline}>
                            <FiClock size={11} />
                            {formatDate(sch.deadline || sch.lastDate)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Notifications Preview ────────────────────── */}
            <div className="s-anim-up s-d4" style={{ marginBottom: 28 }}>
              <SSectionHeader
                title="🔔 Notifications"
                subtitle="Latest 3 updates from admin"
                action={() => navigate('/student/notifications')}
                actionLabel="View All"
              />
              {notifications.length === 0 ? (
                <SEmpty icon="🔔" title="No notifications yet" desc="Admin updates will appear here" />
              ) : (
                <div className={s.notifList}>
                  {notifications.map((n, i) => (
                    <div
                      key={n._id || i}
                      className={`${s.notifCard} ${!n.isRead ? s.notifUnread : ''}`}
                    >
                      <div className={s.notifTitle}>
                        {n.title}
                        {!n.isRead && <span className={s.notifDot} />}
                      </div>
                      <div className={s.notifMsg}>
                        {n.message?.substring(0, 120)}{n.message?.length > 120 ? '…' : ''}
                      </div>
                      <div className={s.notifTime}>{timeAgo(n.createdAt)}</div>
                    </div>
                  ))}
                  <Link to="/student/notifications" style={{ textDecoration: 'none' }}>
                    <SBtn variant="ghost" size="sm" style={{ width: '100%', justifyContent: 'center' }}>
                      View All Notifications <FiArrowRight size={13} />
                    </SBtn>
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
