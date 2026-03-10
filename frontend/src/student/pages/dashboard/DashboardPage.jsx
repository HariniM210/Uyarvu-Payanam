import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStudentAuth } from '../../context/StudentAuthContext'
import { notificationService, careerService } from '../../services'
import { SCard, SBtn, SBadge, SLoader, SSectionHeader, SEmpty } from '../../components/ui'
import { FiArrowRight, FiChevronRight } from 'react-icons/fi'

const LEVELS = [
  { emoji: '🌱', title: 'After 5th Standard',  desc: 'Discover your interests early.',       color: '#7c3aed', bg: '#f3effe' },
  { emoji: '📐', title: 'After 8th Standard',  desc: 'Choose the right stream.',             color: '#c48a1a', bg: '#fdf4e0' },
  { emoji: '🎯', title: 'After 10th Standard', desc: 'Plan higher secondary education.',     color: '#1a6845', bg: '#e6f3ed' },
  { emoji: '🚀', title: 'After 12th Standard', desc: 'Courses, colleges & entrance exams.', color: '#1d5fba', bg: '#eaf0fb' },
]

const QUICK = [
  { to: '/student/colleges',      icon: '🏫', label: 'Find Colleges', color: '#1d5fba', bg: '#eaf0fb' },
  { to: '/student/notifications', icon: '🔔', label: 'Alerts',        color: '#e05e24', bg: '#fdeee6' },
  { to: '/student/careers',       icon: '🧭', label: 'Careers',       color: '#1a6845', bg: '#e6f3ed' },
  { to: '/student/profile',       icon: '👤', label: 'My Profile',    color: '#7c3aed', bg: '#f3effe' },
]

function TimeAgo({ date }) {
  if (!date) return null
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return <>Just now</>
  if (mins < 60) return <>{mins}m ago</>
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return <>{hrs}h ago</>
  return <>{Math.floor(hrs / 24)}d ago</>
}

export default function DashboardPage() {
  const { student } = useStudentAuth()
  const [notifications, setNotifications] = useState([])
  const [careers,       setCareers]       = useState([])
  const [loadingN, setLoadingN] = useState(true)
  const [loadingC, setLoadingC] = useState(true)

  useEffect(() => {
    notificationService.getAll()
      .then(res => setNotifications((Array.isArray(res) ? res : (res.data || [])).slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoadingN(false))

    careerService.getAll()
      .then(res => setCareers((res.data || res || []).slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoadingC(false))
  }, [])

  const unread = notifications.filter(n => !n.isRead).length
  const hour   = new Date().getHours()
  const greet  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const BADGE_COLORS = ['green','blue','gold','orange','purple','gray']

  return (
    <div className="student-root" style={{ padding: '32px 20px', maxWidth: 1100, margin: '0 auto' }}>

      {/* Welcome */}
      <div className="s-anim-up" style={{ marginBottom: 30, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ fontSize: 13.5, color: 'var(--s-text3)', marginBottom: 3, fontWeight: 500 }}>{greet} 👋</p>
          <h1 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 'clamp(22px,4vw,30px)', color: 'var(--s-text)', marginBottom: 10 }}>
            Welcome, {student?.name?.split(' ')[0] || 'Student'}!
          </h1>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {student?.classLevel && <SBadge color="green" dot>Class {student.classLevel}</SBadge>}
            {student?.district   && <SBadge color="gray">{student.district}</SBadge>}
            {unread > 0          && <SBadge color="orange" dot>{unread} new alert{unread > 1 ? 's' : ''}</SBadge>}
          </div>
        </div>
        <Link to="/student/careers">
          <SBtn variant="primary">Explore Careers <FiArrowRight size={15} /></SBtn>
        </Link>
      </div>

      {/* Quick Links */}
      <div className="s-anim-up s-d1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 12, marginBottom: 30 }}>
        {QUICK.map((q, i) => (
          <Link key={i} to={q.to} style={{ textDecoration: 'none' }}>
            <SCard hover style={{ textAlign: 'center', padding: '20px 10px', cursor: 'pointer' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: q.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 10px' }}>{q.icon}</div>
              <div style={{ fontFamily: 'var(--s-font-display)', fontWeight: 700, fontSize: 13, color: q.color }}>{q.label}</div>
            </SCard>
          </Link>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 22, marginBottom: 28 }}>

        {/* Career levels */}
        <div className="s-anim-up s-d2">
          <SSectionHeader title="📚 Career Guidance" subtitle="Tailored for your class level" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LEVELS.map((lvl, i) => (
              <Link key={i} to="/student/careers" style={{ textDecoration: 'none' }}>
                <SCard hover style={{ padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 13, borderLeft: `3px solid ${lvl.color}` }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: lvl.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{lvl.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--s-font-display)', fontWeight: 700, fontSize: 14, color: 'var(--s-text)', marginBottom: 2 }}>{lvl.title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--s-text3)' }}>{lvl.desc}</div>
                  </div>
                  <FiChevronRight size={15} style={{ color: 'var(--s-text3)', flexShrink: 0 }} />
                </SCard>
              </Link>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="s-anim-up s-d3">
          <SSectionHeader title="🔔 Recent Alerts" subtitle="Updates from your admin" />
          {loadingN ? <SLoader /> : notifications.length === 0 ? (
            <SEmpty icon="🔔" title="No notifications yet" desc="Admin updates will appear here" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notifications.map((n, i) => (
                <SCard key={n._id || i} style={{ padding: '13px 15px', borderLeft: `3px solid ${n.isRead ? 'var(--s-border)' : 'var(--s-accent)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--s-font-display)', fontWeight: 700, fontSize: 13.5, color: 'var(--s-text)' }}>{n.title}</span>
                    {!n.isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--s-accent)', flexShrink: 0, marginTop: 3 }} />}
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--s-text3)', lineHeight: 1.55, marginBottom: 6 }}>
                    {n.message?.substring(0, 90)}{n.message?.length > 90 ? '…' : ''}
                  </p>
                  <span style={{ fontSize: 11, color: 'var(--s-text3)' }}><TimeAgo date={n.createdAt} /></span>
                </SCard>
              ))}
              <Link to="/student/notifications" style={{ textDecoration: 'none' }}>
                <SBtn variant="ghost" size="sm" style={{ width: '100%', justifyContent: 'center' }}>
                  View All Notifications <FiArrowRight size={13} />
                </SBtn>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Career Paths */}
      <div className="s-anim-up s-d4">
        <SSectionHeader title="🧭 Recommended Career Paths" subtitle="Popular choices among students" />
        {loadingC ? <SLoader /> : careers.length === 0 ? (
          <SEmpty icon="🧭" title="No career paths yet" />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
            {careers.map((c, i) => (
              <SCard key={c._id || i} hover style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <SBadge color={BADGE_COLORS[i % BADGE_COLORS.length]}>{c.level}</SBadge>
                  <span style={{ fontSize: 12, color: 'var(--s-text3)' }}>{c.ageGroup}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 700, fontSize: 15, color: 'var(--s-text)', marginBottom: 6 }}>{c.title}</h3>
                <p style={{ fontSize: 12.5, color: 'var(--s-text3)', lineHeight: 1.6, marginBottom: 10 }}>
                  {c.description?.substring(0, 80)}{c.description?.length > 80 ? '…' : ''}
                </p>
                {c.careerDirections?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {c.careerDirections.slice(0, 3).map((d, j) => (
                      <span key={j} style={{ fontSize: 11.5, background: 'var(--s-bg2)', color: 'var(--s-text2)', padding: '2px 8px', borderRadius: 6, fontWeight: 500 }}>{d}</span>
                    ))}
                  </div>
                )}
              </SCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
