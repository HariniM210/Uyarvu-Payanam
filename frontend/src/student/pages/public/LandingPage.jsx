import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStudentAuth } from '../../context/StudentAuthContext'
import { SBtn, SCard, SBadge } from '../../components/ui'
import { FiArrowRight, FiZap, FiBell, FiMapPin, FiBookOpen, FiAward, FiTrendingUp, FiUsers, FiStar, FiVolume2, FiVolumeX, FiPlus, FiMinus, FiType } from 'react-icons/fi'

const CAREER_CATS = [
  { slug: 'engineering', icon: '🔧', title: 'Engineering',       desc: 'JEE, TNEA & top technical institutes across TN.',      color: '#1d5fba', bg: '#deeafb', badge: 'Most Popular', badgeColor: 'blue'   },
  { slug: 'medical',     icon: '🩺', title: 'Medical',            desc: 'NEET, MBBS, BDS & all paramedical paths.',             color: '#1a7a50', bg: '#d4eddf', badge: 'High Demand',  badgeColor: 'green'  },
  { slug: 'arts',        icon: '📚', title: 'Arts & Science',     desc: 'BA, BSc, BCom & diverse liberal education.',          color: '#6d28d9', bg: '#ede9fe', badge: 'Diverse',       badgeColor: 'purple' },
  { slug: 'government',  icon: '🏛️', title: 'Government Exams',  desc: 'UPSC, TNPSC, SSC, banking & defence services.',       color: '#c48a1a', bg: '#fdf4e0', badge: 'Stable Career', badgeColor: 'gold'   },
  { slug: 'skill',       icon: '💻', title: 'Skill Based',        desc: 'ITI, polytechnic, design, coding & vocational paths.',color: '#e07b1a', bg: '#fde9cc', badge: 'Fast Track',    badgeColor: 'orange' },
]

const STATS = [
  { value: '50,000+', label: 'Students Guided',  icon: '👥' },
  { value: '500+',    label: 'Colleges Listed',   icon: '🏫' },
  { value: '200+',    label: 'Career Paths',      icon: '🗺️' },
  { value: '98%',     label: 'Satisfaction Rate', icon: '⭐' },
]

const LEVELS = [
  {
    icon: '🌱',
    label: 'After 5th',
    desc: 'Early aptitude discovery',
    color: '#6d28d9',
    bg: '#ede9fe',
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=80&h=80&fit=crop',
    alt: 'Young student learning'
  },
  {
    icon: '📐',
    label: 'After 8th',
    desc: 'Subject & stream choices',
    color: '#c48a1a',
    bg: '#fdf4e0',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=80&h=80&fit=crop',
    alt: 'Student with books'
  },
  {
    icon: '🎯',
    label: 'After 10th',
    desc: 'College & course planning',
    color: '#1a7a50',
    bg: '#d4eddf',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=80&h=80&fit=crop',
    alt: 'College planning'
  },
  {
    icon: '🚀',
    label: 'After 12th',
    desc: 'Entrance exam prep',
    color: '#1d5fba',
    bg: '#deeafb',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=80&h=80&fit=crop',
    alt: 'Entrance exam preparation'
  },
]

const FEATURES = [
  { icon: '🏫', title: 'College Finder',  desc: 'Filter TN colleges by stream, district, fees and placement rates.',     color: '#1d5fba', bg: '#deeafb' },
  { icon: '🔔', title: 'Exam Alerts',     desc: 'Never miss deadlines — real-time notifications for exams and cutoffs.',  color: '#e07b1a', bg: '#fde9cc' },
  { icon: '📈', title: 'Career Insights', desc: 'Real-world data on salary ranges, growth trends and job market outlook.', color: '#1a7a50', bg: '#d4eddf' },
  { icon: '🏆', title: 'Scholarships',    desc: 'Discover government & private scholarships you are eligible for.',       color: '#c48a1a', bg: '#fdf4e0' },
]

// Accessibility Toolbar Component
function AccessibilityBar() {
  const [speaking, setSpeaking]   = useState(false)
  const [fontScale, setFontScale] = useState(1)
  const [showPanel, setShowPanel] = useState(false)
  const synthRef = useRef(window.speechSynthesis)

  const stopSpeech = () => {
    synthRef.current.cancel()
    setSpeaking(false)
  }

  const readPage = () => {
    if (speaking) { stopSpeech(); return }
    synthRef.current.cancel()
    const text = document.querySelector('.student-landing-content')?.innerText || document.body.innerText
    const chunks = text.match(/.{1,200}(\s|$)/g) || [text]
    let i = 0
    const speakNext = () => {
      if (i >= chunks.length) { setSpeaking(false); return }
      const utt = new SpeechSynthesisUtterance(chunks[i++])
      utt.lang = 'en-IN'
      utt.rate = 0.92
      utt.pitch = 1
      utt.onend = speakNext
      utt.onerror = () => setSpeaking(false)
      synthRef.current.speak(utt)
    }
    setSpeaking(true)
    speakNext()
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
          <button className="s-a11y-btn" onClick={() => changeFontSize(0.1)} style={{ justifyContent: 'center' }}>
            <FiPlus size={14} /> Increase
          </button>
          <button className="s-a11y-btn" onClick={() => changeFontSize(-0.1)} style={{ justifyContent: 'center' }}>
            <FiMinus size={14} /> Decrease
          </button>
          <button className="s-a11y-btn" onClick={() => changeFontSize(1 - fontScale)} style={{ justifyContent: 'center', fontSize: 12 }}>
            Reset
          </button>
        </div>
      )}
    </div>
  )
}

export default function LandingPage() {
  const { isAuthenticated } = useStudentAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/student/dashboard', { replace: true })
  }, [isAuthenticated])

  return (
    <div className="student-root">
      <div className="student-landing-content">

        {/* Hero with background image */}
        <section style={{
          position: 'relative', overflow: 'hidden',
          padding: '100px 24px 90px',
          minHeight: 520,
          display: 'flex', alignItems: 'center',
        }}>
          {/* Background image */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }} />
          {/* Gradient overlay for readability */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(10,60,32,0.88) 0%, rgba(26,122,80,0.75) 50%, rgba(8,40,22,0.85) 100%)',
          }} />

          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <div className="s-anim-up" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 99, padding: '6px 16px',
              fontSize: 12.5, fontWeight: 700, color: '#fff',
              fontFamily: 'var(--s-font-display)', marginBottom: 28,
              backdropFilter: 'blur(8px)',
            }}>
              <FiZap size={13} />
              Tamil Nadu's #1 Career Guidance Platform
            </div>

            <h1 className="s-anim-up s-d1" style={{
              fontFamily: 'var(--s-font-display)', fontWeight: 800,
              fontSize: 'clamp(32px, 6vw, 58px)', lineHeight: 1.08,
              color: '#ffffff', marginBottom: 22, letterSpacing: '-0.02em',
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}>
              Find Your Path.<br />
              <span style={{ color: '#7ee8b0' }}>Shape Your Future.</span>
            </h1>

            <p className="s-anim-up s-d2" style={{
              fontSize: 'clamp(15px,2vw,18px)', color: 'rgba(255,255,255,0.88)',
              lineHeight: 1.8, maxWidth: 540, margin: '0 auto 38px',
            }}>
              From Class 5 to Class 12 and beyond — personalised career guidance,
              college discovery, and exam alerts in one place.
            </p>

            <div className="s-anim-up s-d3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/student/signup">
                <SBtn size="lg" variant="primary" style={{ background: '#fff', color: 'var(--s-primary)', border: 'none' }}>
                  Get Started Free <FiArrowRight size={16} />
                </SBtn>
              </Link>
              <Link to="/student/careers">
                <SBtn size="lg" variant="ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)' }}>
                  <FiBookOpen size={16} /> Explore Careers
                </SBtn>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section style={{ background: 'var(--s-primary)', padding: '30px 24px' }}>
          <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 8 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '10px 8px' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 26, color: '#fff', marginBottom: 2 }}>{s.value}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--s-font-body)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Career Categories */}
        <section style={{ padding: '72px 24px', background: 'var(--s-bg)' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <h2 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 'clamp(24px,4vw,36px)', color: 'var(--s-text)', marginBottom: 10 }}>
                Choose Your Career Stream
              </h2>
              <p style={{ fontSize: 15.5, color: 'var(--s-text3)', maxWidth: 460, margin: '0 auto' }}>
                In-depth guidance for every major career track
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
              {CAREER_CATS.map((cat) => (
                <Link key={cat.slug} to={`/student/careers/${cat.slug}`} style={{ textDecoration: 'none' }}>
                  <SCard hover style={{ padding: '24px 18px', cursor: 'pointer', position: 'relative', height: '100%', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                    <div style={{ position: 'absolute', top: 14, right: 14 }}>
                      <SBadge color={cat.badgeColor}>{cat.badge}</SBadge>
                    </div>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 16 }}>
                      {cat.icon}
                    </div>
                    <h3 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 15.5, color: 'var(--s-text)', marginBottom: 7 }}>{cat.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--s-text3)', lineHeight: 1.65, marginBottom: 14 }}>{cat.desc}</p>
                    <span style={{ fontSize: 13, fontWeight: 700, color: cat.color, fontFamily: 'var(--s-font-display)' }}>Explore →</span>
                  </SCard>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Guidance Levels - with education images */}
        <section style={{ padding: '72px 24px', background: 'var(--s-surface)' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <h2 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 'clamp(24px,4vw,34px)', color: 'var(--s-text)', marginBottom: 10 }}>
                Guidance at Every Stage
              </h2>
              <p style={{ fontSize: 15, color: 'var(--s-text3)', maxWidth: 400, margin: '0 auto' }}>
                We meet you where you are, and guide you forward
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
              {LEVELS.map((lvl, i) => (
                <Link key={i} to="/student/careers" style={{ textDecoration: 'none' }}>
                  <SCard hover style={{
                    textAlign: 'center', padding: '28px 16px',
                    borderTop: `3px solid ${lvl.color}`,
                    cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                  }}>
                    {/* Education icon with colored background */}
                    <div style={{
                      width: 72, height: 72, borderRadius: 20,
                      background: lvl.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 36, margin: '0 auto 14px',
                      border: `2px solid ${lvl.color}22`,
                    }}>
                      {lvl.icon}
                    </div>
                    <div style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 16, color: 'var(--s-text)', marginBottom: 6 }}>{lvl.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--s-text3)' }}>{lvl.desc}</div>
                    <div style={{ marginTop: 14, display: 'inline-block', padding: '4px 12px', borderRadius: 99, background: lvl.bg, color: lvl.color, fontSize: 12, fontWeight: 700 }}>
                      Start Here →
                    </div>
                  </SCard>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: '72px 24px', background: 'var(--s-bg)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <h2 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 'clamp(24px,4vw,34px)', color: 'var(--s-text)', marginBottom: 10 }}>
                Everything You Need in One Place
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
              {FEATURES.map((f, i) => (
                <SCard key={i} hover style={{ display: 'flex', gap: 16, padding: '22px 18px', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, flexShrink: 0, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 15, color: 'var(--s-text)', marginBottom: 5 }}>{f.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--s-text3)', lineHeight: 1.65 }}>{f.desc}</p>
                  </div>
                </SCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{
          padding: '80px 24px', textAlign: 'center',
          background: 'linear-gradient(135deg, #0f5236 0%, #1a7a50 50%, #0f5236 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 'clamp(26px,4.5vw,40px)', color: '#fff', marginBottom: 14 }}>
              Start Your Career Journey Today
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', marginBottom: 34 }}>
              Join 50,000+ students already using Uyarvu Payanam
            </p>
            <Link to="/student/signup">
              <SBtn variant="white" size="lg">Create Free Account <FiArrowRight size={16} /></SBtn>
            </Link>
          </div>
        </section>

      </div>

      {/* Accessibility Toolbar */}
      <AccessibilityBar />
    </div>
  )
}
