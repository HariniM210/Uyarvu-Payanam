import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStudentAuth } from '../../context/StudentAuthContext'
import { courseService } from '../../../services/courseService'
import {
  FiArrowRight, FiBookOpen, FiSearch, FiBell,
  FiAward, FiVolume2, FiVolumeX, FiPlus, FiMinus, FiType,
  FiCompass, FiTarget, FiTrendingUp, FiFlag,
  FiMapPin, FiLayers, FiClock, FiStar
} from 'react-icons/fi'
import { SLoader, SBadge } from '../../components/ui'

// ── Class-level cards data ─────────────────────────────────────────────────────
const CLASS_LEVELS = [
  {
    key: 'class5',
    classLabel: 'Class 5',
    title: 'After 5th Standard',
    desc: 'Build curiosity and discover early interests with age-appropriate career exploration activities.',
    icon: FiCompass,
    accentColor: '#6d28d9',
    accentBg: '#ede9fe',
  },
  {
    key: 'class8',
    classLabel: 'Class 8',
    title: 'After 8th Standard',
    desc: 'Connect school subjects with real career possibilities before making critical stream selections.',
    icon: FiFlag,
    accentColor: '#b45309',
    accentBg: '#fef3c7',
  },
  {
    key: 'class10',
    classLabel: 'Class 10',
    title: 'After 10th Standard',
    desc: 'Choose the right stream, college and course for your future with expert career guidance.',
    icon: FiTarget,
    accentColor: '#047857',
    accentBg: '#d1fae5',
  },
  {
    key: 'class12',
    classLabel: 'Class 12',
    title: 'After 12th Standard',
    desc: 'Prepare for entrance exams, degree courses and launch your professional career journey.',
    icon: FiTrendingUp,
    accentColor: '#1e40af',
    accentBg: '#dbeafe',
  },
]

const STATS = [
  { value: '50,000+', label: 'Students Guided' },
  { value: '500+', label: 'Colleges Listed' },
  { value: '200+', label: 'Career Paths' },
  { value: '98%', label: 'Satisfaction Rate' },
]

const FEATURES = [
  {
    icon: FiSearch,
    title: 'College Finder',
    desc: 'Filter Tamil Nadu colleges by stream, district, fees and placement rates.',
    color: '#1e40af',
    bg: '#dbeafe',
  },
  {
    icon: FiBell,
    title: 'Exam Alerts',
    desc: 'Never miss deadlines — real-time notifications for exams, cutoffs and applications.',
    color: '#b45309',
    bg: '#fef3c7',
  },
  {
    icon: FiTrendingUp,
    title: 'Career Insights',
    desc: 'Real-world data on salary ranges, growth trends and job market outlook.',
    color: '#047857',
    bg: '#d1fae5',
  },
  {
    icon: FiAward,
    title: 'Scholarships',
    desc: 'Discover government and private scholarships that match your eligibility.',
    color: '#6d28d9',
    bg: '#ede9fe',
  },
]

// ── Course Mini Card ──────────────────────────────────────────────────────────
function CourseMiniCard({ course }) {
  return (
    <div style={{
      padding: '20px',
      background: '#fff',
      border: '1px solid var(--s-border)',
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SBadge color="blue" style={{ fontSize: 10 }}>{course.category}</SBadge>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>
          <FiStar size={12} fill="#f59e0b" /> Top Choice
        </div>
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--s-text)' }}>{course.courseName}</h3>
      <div style={{ fontSize: 13, color: 'var(--s-text3)', lineHeight: 1.5, flex: 1 }}>
        {course.eligibility?.split(',')[0]} • {course.duration}
      </div>
      <Link to="/courses" style={{ textDecoration: 'none', fontSize: 13, fontWeight: 700, color: 'var(--s-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
        Explore This Course <FiArrowRight size={14} />
      </Link>
    </div>
  )
}

// ── Top Courses Section (Step 271 Requirement) ──────────────────────────────────
function TopCoursesSection() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    courseService.getAll()
      .then(res => {
        const list = Array.isArray(res) ? res : (res.data || [])
        setCourses(list.slice(0, 4))
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && courses.length === 0) return null

  return (
    <section className="s-section" style={{ background: '#fcfcfd' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 20px' }}>
        <div className="s-section-header" style={{ textAlign: 'left', margin: '0 0 40px', maxWidth: '100%' }}>
           <div className="s-section-tag"><FiStar size={14} /> New Opportunities</div>
           <h2 className="s-section-title" style={{ margin: '8px 0' }}>Featured Career Programs</h2>
           <p className="s-section-desc" style={{ margin: 0 }}>Discover high-impact courses recently added to our platform by expert counselors.</p>
        </div>

        {loading ? <SLoader /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
             {courses.map(c => <CourseMiniCard key={c._id} course={c} />)}
          </div>
        )}

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Link to="/courses" style={{ textDecoration: 'none' }}>
             <button className="s-btn s-btn-md s-btn-ghost">Browse All 500+ Courses <FiArrowRight size={15} /></button>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Accessibility Toolbar ─────────────────────────────────────────────────────
function AccessibilityBar() {
  const [speaking, setSpeaking] = useState(false)
  const [fontScale, setFontScale] = useState(1)
  const [showPanel, setShowPanel] = useState(false)
  const synthRef = useRef(window.speechSynthesis)

  const stopSpeech = () => { synthRef.current.cancel(); setSpeaking(false) }

  const readPage = () => {
    if (speaking) { stopSpeech(); return }
    synthRef.current.cancel()
    const text = document.querySelector('.student-landing-content')?.innerText || document.body.innerText
    const chunks = text.match(/.{1,200}(\s|$)/g) || [text]
    let i = 0
    const speakNext = () => {
      if (i >= chunks.length) { setSpeaking(false); return }
      const utt = new SpeechSynthesisUtterance(chunks[i++])
      utt.lang = 'en-IN'; utt.rate = 0.92; utt.pitch = 1
      utt.onend = speakNext; utt.onerror = () => setSpeaking(false)
      synthRef.current.speak(utt)
    }
    setSpeaking(true); speakNext()
  }

  const changeFontSize = (delta) => {
    setFontScale(prev => {
      const next = Math.min(1.5, Math.max(0.8, prev + delta))
      document.querySelector('.student-root')?.style.setProperty('--s-font-scale', next)
      return next
    })
  }

  useEffect(() => () => synthRef.current.cancel(), [])

  return (
    <div className="s-a11y-bar" role="toolbar" aria-label="Accessibility tools">
      <button className={`s-a11y-btn ${speaking ? 'active' : ''}`} onClick={readPage} title={speaking ? 'Stop reading' : 'Read page aloud'}>
        {speaking ? <FiVolumeX size={15} /> : <FiVolume2 size={15} />}
        {speaking ? 'Stop' : 'Read Page'}
      </button>
      <button className="s-a11y-btn" onClick={() => setShowPanel(p => !p)} title="Font size controls">
        <FiType size={15} /> Font Size
      </button>
      {showPanel && (
        <div className="s-a11y-panel s-anim-down">
          <div className="s-a11y-label">Text Size ({Math.round(fontScale * 100)}%)</div>
          <button className="s-a11y-btn" onClick={() => changeFontSize(0.1)} style={{ justifyContent: 'center' }}><FiPlus size={14} /> Increase</button>
          <button className="s-a11y-btn" onClick={() => changeFontSize(-0.1)} style={{ justifyContent: 'center' }}><FiMinus size={14} /> Decrease</button>
          <button className="s-a11y-btn" onClick={() => changeFontSize(1 - fontScale)} style={{ justifyContent: 'center', fontSize: 12 }}>Reset</button>
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { isAuthenticated } = useStudentAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated])

  return (
    <div className="student-root">
      <div className="student-landing-content">

        {/* ── Hero ── */}
        <section className="s-hero">
          <div className="s-hero-bg" style={{ backgroundImage: 'url(/hero-bg.jpg)' }} />
          <div className="s-hero-overlay" />
          <div className="s-hero-content">
            <div className="s-hero-badge s-anim-up">
              <FiLayers size={14} />
              Professional Career Guidance Platform
            </div>
            <h1 className="s-anim-up s-d1">
              Find Your Path.<br />
              <span>Shape Your Future.</span>
            </h1>
            <p className="s-anim-up s-d2">
              Expert mentorship and dynamic course finder for Class 5 to Class 12 students across Tamil Nadu.
            </p>
            <div className="s-hero-actions s-anim-up s-d3">
              <Link to="/careers" className="s-btn s-btn-lg s-btn-white">
                <FiBookOpen size={17} /> Explore Career Paths
              </Link>
              <Link to="/signup" className="s-btn s-btn-lg s-btn-outline">
                Get Started Free <FiArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="s-stats-bar">
          <div className="s-stats-grid">
            {STATS.map((s, i) => (
              <div key={i} className="s-stat-item">
                <div className="s-stat-value">{s.value}</div>
                <div className="s-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CLASS LEVEL SECTION ── */}
        <section className="s-section" style={{ background: 'var(--s-bg)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div className="s-section-header s-anim-up">
              <div className="s-section-tag"><FiMapPin size={14} /> Milestone Guidance</div>
              <h2 className="s-section-title">Support for Every Transition</h2>
              <p className="s-section-desc">
                Select your current level to discover roadmaps and course recommendations curated for your specific academic stage.
              </p>
            </div>
            <div className="s-class-cards-grid">
              {CLASS_LEVELS.map((item, index) => (
                <Link key={item.key} to={`/${item.key}`} className={`s-class-card s-anim-up s-d${index + 1}`} style={{ '--card-accent': item.accentColor, '--card-accent-light': item.accentBg }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="s-class-card-icon"><item.icon size={22} /></div>
                    <span className="s-class-card-label">{item.classLabel}</span>
                  </div>
                  <div><h3>{item.title}</h3><p>{item.desc}</p></div>
                  <div className="s-class-card-cta">Explore Pathways <FiArrowRight size={15} /></div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── TOP COURSES DYNAMIC SECTION ── */}
        <TopCoursesSection />

        {/* ── Features ── */}
        <section className="s-section" style={{ background: 'var(--s-surface)' }}>
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <div className="s-section-header">
              <h2 className="s-section-title">Comprehensive Tools & Data</h2>
              <p className="s-section-desc">Built for students who want to make data-driven decisions about their higher education.</p>
            </div>
            <div className="s-features-grid">
              {FEATURES.map((f, i) => {
                const Icon = f.icon
                return (
                  <div key={i} className={`s-feature-card s-anim-up s-d${i + 1}`}>
                    <div className="s-feature-icon" style={{ background: f.bg, color: f.color }}><Icon size={22} /></div>
                    <div><h3>{f.title}</h3><p>{f.desc}</p></div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="s-cta-banner">
          <h2>Empower Your Future Today</h2>
          <p>Join thousands of students who have found their passion with Uyarvu Payanam.</p>
          <Link to="/signup" className="s-btn s-btn-lg s-btn-white" style={{ position: 'relative', zIndex: 1 }}>
            Sign Up For Free <FiArrowRight size={16} />
          </Link>
        </section>
      </div>
      <AccessibilityBar />
    </div>
  )
}
