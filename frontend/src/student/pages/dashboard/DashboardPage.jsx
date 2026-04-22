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
import { userActionService } from '../../../services/userActionService'
import { SBtn, SLoader, SSectionHeader, SEmpty, SBadge } from '../../components/ui'
import {
  FiGrid, FiBookOpen, FiMapPin, FiFileText, FiAward,
  FiBell, FiUser, FiSettings, FiLogOut, FiArrowRight,
  FiClock, FiMenu, FiX,
} from 'react-icons/fi'
import s from './DashboardPage.module.css'

/* â”€â”€ Sidebar navigation config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const SIDEBAR_NAV = [
  { id: 'dashboard',     icon: FiGrid,     label: 'Dashboard',      to: '/dashboard' },
  { id: 'courses',       icon: FiBookOpen, label: 'Courses',        to: '/careers' },
  { id: 'colleges',      icon: FiMapPin,   label: 'Colleges',       to: '/colleges' },
  { id: 'exams',         icon: FiFileText, label: 'Entrance Exams', to: '/careers' },
  { id: 'scholarships',  icon: FiAward,    label: 'Scholarships',   to: '/careers' },
  { id: 'notifications', icon: FiBell,     label: 'Notifications',  to: '/notifications' },
  { id: 'profile',       icon: FiUser,     label: 'Profile',        to: '/profile' },
  { id: 'settings',      icon: FiSettings, label: 'Settings',       to: '/profile' },
]

/* â”€â”€ Stat card gradient presets â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const STAT_GRADIENTS = [
  'linear-gradient(135deg, #1d5fba 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #e17055 0%, #f97316 100%)',
  'linear-gradient(135deg, #c48a1a 0%, #eab308 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
]

/* â”€â”€ Recommended careers (static) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const CAREER_CARDS = [
  { icon: 'âš™ï¸', title: 'Engineering',  sub: 'Build the future',      bg: '#eaf0fb', color: '#1d5fba' },
  { icon: 'ðŸ©º', title: 'Medicine',     sub: 'Heal & innovate',       bg: '#fce4ec', color: '#c62828' },
  { icon: 'ðŸ“Š', title: 'Commerce',     sub: 'Business & finance',    bg: '#fdf4e0', color: '#c48a1a' },
  { icon: 'ðŸŽ¨', title: 'Arts',         sub: 'Create & express',      bg: '#f3effe', color: '#7c3aed' },
]

/* â”€â”€ TimeAgo helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
  if (!d) return 'â€”'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   DASHBOARD PAGE
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function DashboardPage() {
  const { student, logout } = useStudentAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  /* â”€â”€ Data state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const [notifications, setNotifications] = useState([])
  const [careers, setCareers] = useState([])
  const [exams, setExams] = useState([])
  const [scholarships, setScholarships] = useState([])
  const [stats, setStats] = useState({ courses: 0, exams: 0, scholarships: 0, colleges: 0 })
  const [savedGuidance, setSavedGuidance] = useState([])
  const [loading, setLoading] = useState(true)

  /* â”€â”€ Fetch all data on mount â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
      userActionService.getSavedList('ClassContent')
    ]).then(([notifR, careerR, examR, scholR, courseR, collegeR, savedR]) => {
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

      if (savedR.status === 'fulfilled' && savedR.value?.success) {
        setSavedGuidance(savedR.value.data)
      }

      setLoading(false)
    })
  }, [])

  /* â”€â”€ Derived â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const unreadCount = notifications.filter((n) => !n.isRead).length
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = student?.name?.split(' ')[0] || 'Student'

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  const handleUnsave = async (contentId) => {
    try {
      await userActionService.unsaveItem(contentId)
      setSavedGuidance(prev => prev.filter(item => {
        const id = item.contentId?._id || item.contentId
        return id !== contentId
      }))
    } catch (err) {
      console.error('Failed to remove saved item', err)
    }
  }

  /* â”€â”€ Stat card data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const STAT_CARDS = [
    { icon: 'ðŸ“˜', label: 'Courses Available', value: stats.courses },
    { icon: 'ðŸ“', label: 'Entrance Exams', value: stats.exams },
    { icon: 'ðŸŽ“', label: 'Scholarships', value: stats.scholarships },
    { icon: 'ðŸ«', label: 'Colleges', value: stats.colleges },
  ]

  return (
    <div className={s.layout}>

      {/* â”€â”€ SIDEBAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {sidebarOpen && <div className={s.overlay} onClick={() => setSidebarOpen(false)} />}

      <aside className={`${s.sidebar} ${sidebarOpen ? s.sidebarOpen : ''}`}>
        <div className={s.sidebarLabel}>Menu</div>

        {SIDEBAR_NAV.map(({ id, icon: Icon, label, to }) => {
          const isActive = id === 'dashboard'
            ? location.pathname === '/dashboard'
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

      {/* â”€â”€ MAIN CONTENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className={s.main}>

        {/* Welcome Banner */}
        <div className={`${s.welcomeBanner} s-anim-up`}>
          <div className={s.welcomeGreet}>{greet} ðŸ‘‹</div>
          <div className={s.welcomeName}>Welcome back, {firstName}!</div>
          <div className={s.welcomeDesc}>
            Explore your future career paths, find the right colleges, and never miss an exam deadline.
          </div>
          <div className={s.welcomeBadges}>
            {student?.classLevel && <span className={s.welcomeTag}>ðŸŽ“ Class {student.classLevel}</span>}
            {student?.district && <span className={s.welcomeTag}>ðŸ“ {student.district}</span>}
            {unreadCount > 0 && <span className={s.welcomeTag}>ðŸ”” {unreadCount} new alert{unreadCount > 1 ? 's' : ''}</span>}
          </div>
        </div>

        {loading ? (
          <SLoader />
        ) : (
          <>
            {/* â”€â”€ Statistics Cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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

            {/* â”€â”€ Recommended Careers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="s-anim-up s-d2" style={{ marginBottom: 28 }}>
              <SSectionHeader
                title="ðŸ§­ Recommended Careers"
                subtitle="Popular career paths for students"
                action={() => navigate('/careers')}
                actionLabel="View All"
              />
              <div className={s.careerGrid}>
                {CAREER_CARDS.map((c) => (
                  <Link key={c.title} to="/careers" className={s.careerCard}>
                    <div className={s.careerIcon} style={{ background: c.bg }}>
                      {c.icon}
                    </div>
                    <div className={s.careerTitle}>{c.title}</div>
                    <div className={s.careerSub}>{c.sub}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Saved Guidance Content ─────────────────────────────── */}
            <div className="s-anim-up s-d2" style={{ marginBottom: 28 }}>
              <SSectionHeader
                title="🔖 Saved Guidance Content"
                subtitle="Your bookmarked career paths and guides"
              />
              {savedGuidance.length === 0 ? (
                <SEmpty icon="🔖" title="No saved content yet" desc="Bookmark items from class guidance pages to see them here." />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {savedGuidance.map((item, i) => {
                    const c = item.contentId
                    if (!c) return null
                    return (
                      <div key={item._id || i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '140px', width: '100%', background: '#f1f5f9', position: 'relative' }}>
                          <img src={c.coverImage || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400'} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                            <SBadge color="blue">Class {c.targetClass}</SBadge>
                            <SBadge color="gray">{c.sectionType}</SBadge>
                          </div>
                          <h4 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>{c.title}</h4>
                          <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                            <SBtn variant="primary" size="sm" style={{ flex: 1, borderRadius: '8px' }} onClick={() => navigate(`/class${c.targetClass}/content/${c.slug}`)}>
                              View 
                            </SBtn>
                            <SBtn variant="outline" size="sm" style={{ flex: 1, borderRadius: '8px', color: '#ef4444', borderColor: '#fca5a5' }} onClick={() => handleUnsave(c._id)}>
                              Remove
                            </SBtn>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* â”€â”€ 2-Column: Upcoming Exams + Latest Scholarships â”€â”€ */}
            <div className={`${s.sectionGrid} s-anim-up s-d3`}>

              {/* Upcoming Exams */}
              <div>
                <SSectionHeader
                  title="ðŸ“ Upcoming Exams"
                  subtitle="Important entrance exams"
                />
                {exams.length === 0 ? (
                  <SEmpty icon="ðŸ“" title="No exams listed yet" />
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
                            ðŸ“
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
                  title="ðŸŽ“ Latest Scholarships"
                  subtitle="Don't miss these deadlines"
                />
                {scholarships.length === 0 ? (
                  <SEmpty icon="ðŸŽ“" title="No scholarships yet" />
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

            {/* â”€â”€ Notifications Preview â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="s-anim-up s-d4" style={{ marginBottom: 28 }}>
              <SSectionHeader
                title="ðŸ”” Notifications"
                subtitle="Latest 3 updates from admin"
                action={() => navigate('/notifications')}
                actionLabel="View All"
              />
              {notifications.length === 0 ? (
                <SEmpty icon="ðŸ””" title="No notifications yet" desc="Admin updates will appear here" />
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
                        {n.message?.substring(0, 120)}{n.message?.length > 120 ? 'â€¦' : ''}
                      </div>
                      <div className={s.notifTime}>{timeAgo(n.createdAt)}</div>
                    </div>
                  ))}
                  <Link to="/notifications" style={{ textDecoration: 'none' }}>
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
