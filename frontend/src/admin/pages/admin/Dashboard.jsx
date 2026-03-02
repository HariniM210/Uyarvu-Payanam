import React, { useState, useEffect } from 'react'
import { StatCard, Card, CardHeader, ProgressBar, ActivityDot } from '../../components/UI'

// ── API base (change to your backend URL) ──────────────────
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ── Skeleton loader ────────────────────────────────────────
function Skeleton({ width = '100%', height = 16, radius = 8, style }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: 'linear-gradient(90deg, var(--surface2) 25%, var(--border) 50%, var(--surface2) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      ...style,
    }} />
  )
}

// ── Live Clock ─────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 500 }}>
      🕐 {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      &nbsp;·&nbsp;
      {time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
    </span>
  )
}

// ── Main Component ─────────────────────────────────────────
export default function Dashboard() {
  const [stats, setStats]       = useState(null)
  const [chartData, setChart]   = useState([])
  const [levels, setLevels]     = useState([])
  const [activities, setActs]   = useState([])
  const [careers, setCareers]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [lastRefresh, setLast]  = useState(new Date())

  // ── Fetch all dashboard data ─────────────────────────────
  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsRes, chartRes, levelsRes, actsRes, careersRes] = await Promise.all([
        fetch(`${API}/admin/dashboard/stats`),
        fetch(`${API}/admin/dashboard/registrations`),
        fetch(`${API}/admin/dashboard/levels`),
        fetch(`${API}/admin/dashboard/activity`),
        fetch(`${API}/admin/dashboard/careers`),
      ])

      // Check for HTTP errors
      if (!statsRes.ok || !chartRes.ok || !levelsRes.ok || !actsRes.ok || !careersRes.ok) {
        throw new Error('One or more API requests failed')
      }

      const [statsData, chartRaw, levelsData, actsData, careersData] = await Promise.all([
        statsRes.json(),
        chartRes.json(),
        levelsRes.json(),
        actsRes.json(),
        careersRes.json(),
      ])

      setStats(statsData)
      setChart(chartRaw)
      setLevels(levelsData)
      setActs(actsData)
      setCareers(careersData)
      setLast(new Date())
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => { fetchDashboard() }, [])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const id = setInterval(fetchDashboard, 60000)
    return () => clearInterval(id)
  }, [])

  // ── Max value for bar chart ──────────────────────────────
  const maxChart = chartData.length > 0 ? Math.max(...chartData.map(d => d.count)) : 1

  // ── Error state ──────────────────────────────────────────
  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: 300, gap: 16 }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <div style={{ fontFamily: 'Nunito', fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
          Failed to load dashboard
        </div>
        <div style={{ fontSize: 13, color: 'var(--text3)' }}>{error}</div>
        <button
          onClick={fetchDashboard}
          style={{ padding: '10px 24px', background: 'var(--primary)', color: '#fff',
            border: 'none', borderRadius: 10, cursor: 'pointer',
            fontFamily: 'Nunito', fontWeight: 800, fontSize: 14 }}>
          🔄 Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>

      {/* ── Header row with clock + refresh ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Nunito', fontSize: 20, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>
            Dashboard Overview
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LiveClock />
            {!loading && (
              <span style={{ fontSize: 11, color: 'var(--text4)' }}>
                Last updated: {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={fetchDashboard}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 13, color: 'var(--text2)', fontFamily: 'Outfit',
            opacity: loading ? 0.6 : 1, transition: 'all 0.15s' }}
          onMouseEnter={e => !loading && (e.currentTarget.style.borderColor = 'var(--primary)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
          <span style={{ display: 'inline-block', animation: loading ? 'spin 1s linear infinite' : 'none' }}>🔄</span>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)',
              borderRadius: 16, padding: 20 }}>
              <Skeleton height={24} width={40} style={{ marginBottom: 12 }} />
              <Skeleton height={32} width={80} style={{ marginBottom: 8 }} />
              <Skeleton height={14} width={120} />
            </div>
          ))
        ) : stats ? (
          <>
            <StatCard icon="👨‍🎓" value={stats.totalStudents?.toLocaleString('en-IN')} label="Total Students"
              delta={stats.studentsDelta} deltaUp={stats.studentsDelta?.startsWith('+')} color="#2d9e5f" />
            <StatCard icon="📘" value={stats.activeCourses} label="Active Courses"
              delta={stats.coursesDelta} deltaUp={stats.coursesDelta?.startsWith('+')} color="#3b82f6" />
            <StatCard icon="📝" value={stats.totalExams} label="Exams Listed"
              delta={stats.examsDelta} deltaUp={stats.examsDelta?.startsWith('+')} color="#f59e0b" />
            <StatCard icon="🎓" value={stats.totalScholarships} label="Scholarships"
              delta={stats.scholarshipsDelta} deltaUp={stats.scholarshipsDelta?.startsWith('+')} color="#ef4444" />
          </>
        ) : null}
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>

        {/* Bar Chart */}
        <Card>
          <CardHeader title="📈 Registration Growth" />
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
              {Array(6).fill(0).map((_, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Skeleton height={`${30 + i * 15}%`} radius={6} style={{ marginTop: 'auto' }} />
                  <Skeleton height={10} radius={4} />
                </div>
              ))}
            </div>
          ) : chartData.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140, paddingBottom: 4 }}>
              {chartData.map((d, i) => {
                const isLast = i === chartData.length - 1
                return (
                  <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700,
                      color: isLast ? 'var(--primary)' : 'var(--text3)' }}>
                      {d.count}
                    </span>
                    <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                      <div style={{ width: '100%', borderRadius: '6px 6px 0 0',
                        height: `${(d.count / maxChart) * 100}%`,
                        background: isLast ? 'var(--primary)' : 'var(--surface2)',
                        border: isLast ? 'none' : '1.5px solid var(--border)',
                        transition: 'height 1s ease', minHeight: 4 }} />
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--text3)', fontWeight: isLast ? 700 : 400 }}>
                      {d.month}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState icon="📊" text="No registration data available" />
          )}
        </Card>

        {/* Level Distribution */}
        <Card>
          <CardHeader title="🎯 Level Distribution" />
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Skeleton height={12} width={80} />
                  <Skeleton height={12} width={30} />
                </div>
                <Skeleton height={7} radius={10} />
              </div>
            ))
          ) : levels.length > 0 ? (
            levels.map(l => (
              <ProgressBar key={l.label} label={l.label} pct={l.percentage} color={l.color} />
            ))
          ) : (
            <EmptyState icon="🎯" text="No level data" />
          )}
        </Card>
      </div>

      {/* ── Bottom Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Recent Activity */}
        <Card>
          <CardHeader title="⚡ Recent Activity" actionLabel="View All" action={() => {}} />
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0',
                borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                <Skeleton width={8} height={8} radius={50} style={{ marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <Skeleton height={13} style={{ marginBottom: 6 }} />
                  <Skeleton height={10} width={80} />
                </div>
              </div>
            ))
          ) : activities.length > 0 ? (
            activities.map((a, i) => (
              <div key={a._id || i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '10px 0', borderBottom: i < activities.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <ActivityDot color={a.color || '#2d9e5f'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{a.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                    {formatTime(a.createdAt)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState icon="⚡" text="No recent activity" />
          )}
        </Card>

        {/* Popular Careers */}
        <Card>
          <CardHeader title="🏆 Popular Careers" />
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Skeleton height={12} width={100} />
                  <Skeleton height={12} width={40} />
                </div>
                <Skeleton height={7} radius={10} />
              </div>
            ))
          ) : careers.length > 0 ? (
            careers.map(c => (
              <ProgressBar
                key={c.name}
                label={c.name}
                value={c.count}
                max={careers[0]?.count || 1}
                color={c.color}
              />
            ))
          ) : (
            <EmptyState icon="🏆" text="No career data available" />
          )}
        </Card>

      </div>
    </div>
  )
}

// ── Helper: relative time ──────────────────────────────────
function formatTime(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60)         return `${diff}s ago`
  if (diff < 3600)       return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400)      return `${Math.floor(diff / 3600)} hr ago`
  if (diff < 172800)     return 'Yesterday'
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// ── Empty State ────────────────────────────────────────────
function EmptyState({ icon, text }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text4)' }}>
      <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.4 }}>{icon}</div>
      <div style={{ fontSize: 13 }}>{text}</div>
    </div>
  )
}