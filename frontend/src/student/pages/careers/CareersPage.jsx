import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiArrowRight, FiCompass, FiFlag, FiTarget, FiTrendingUp } from 'react-icons/fi'
import { useStudentAuth } from '../../context/StudentAuthContext'
import { SBadge, SBtn, SCard } from '../../components/ui'
import { CAREER_CLASS_CONFIGS } from './careerCatalog'

const ICONS = [FiCompass, FiFlag, FiTarget, FiTrendingUp]

function ClassCard({ item, index }) {
  const Icon = ICONS[index] || FiCompass

  return (
    <Link to={`/student/${item.key.replace('-', '')}`} style={{ textDecoration: 'none' }}>
      <SCard
        hover
        className={`s-anim-up s-d${index + 1}`}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          padding: '24px 22px',
          cursor: 'pointer',
          borderTop: `4px solid ${item.accent}`,
          background: `linear-gradient(180deg, ${item.accent}08 0%, rgba(255,255,255,0.98) 42%, var(--s-surface) 100%)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{
            width: 54,
            height: 54,
            borderRadius: 14,
            display: 'grid',
            placeItems: 'center',
            background: `${item.accent}12`,
            color: item.accent,
          }}>
            <Icon size={24} />
          </div>
          <SBadge color={item.badgeColor}>{item.title}</SBadge>
        </div>

        <div>
          <h2 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 22, color: 'var(--s-text)', margin: '0 0 8px' }}>
            {item.heading}
          </h2>
          <p style={{ margin: 0, fontSize: 14.5, color: 'var(--s-text3)', lineHeight: 1.75 }}>
            {item.summary}
          </p>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--s-text2)', fontWeight: 600 }}>Open guidance</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: item.accent, fontWeight: 700, fontFamily: 'var(--s-font-display)' }}>
            Explore <FiArrowRight size={15} />
          </span>
        </div>
      </SCard>
    </Link>
  )
}

export default function CareersPage() {
  const { isAuthenticated } = useStudentAuth()
  const location = useLocation()

  return (
    <div className="student-root" style={{ padding: '32px 20px 52px', maxWidth: 1200, margin: '0 auto' }}>
      <div className="s-anim-up" style={{
        marginBottom: 30,
        padding: '30px clamp(20px, 4vw, 34px)',
        borderRadius: 20,
        background: 'linear-gradient(135deg, rgba(109, 40, 217, 0.06) 0%, rgba(30, 64, 175, 0.06) 50%, rgba(4, 120, 87, 0.06) 100%)',
        border: '1px solid var(--s-border)',
        boxShadow: 'var(--s-shadow-md)',
      }}>
        <SBadge color="purple" style={{ marginBottom: 12 }}>Career Guidance</SBadge>
        <h1 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 900, fontSize: 'clamp(30px, 4vw, 42px)', color: 'var(--s-text)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
          Explore Career Paths by Class Level
        </h1>
        <p style={{ maxWidth: 760, margin: 0, color: 'var(--s-text3)', fontSize: 15.5, lineHeight: 1.8 }}>
          Choose the student&apos;s current class to see the most relevant career guidance, roadmaps, suggested courses, and future opportunities curated by your admin team.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
        {CAREER_CLASS_CONFIGS.map((item, index) => (
          <ClassCard key={item.key} item={item} index={index} />
        ))}
      </div>

      {!isAuthenticated && (
        <div className="s-anim-up" style={{
          background: 'var(--s-surface2)',
          border: '1px solid var(--s-border)',
          borderRadius: 20,
          padding: '30px 24px',
          textAlign: 'center',
          marginTop: 42,
        }}>
          <h3 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 22, color: 'var(--s-text)', margin: '0 0 8px' }}>
            Want personalized career recommendations?
          </h3>
          <p style={{ fontSize: 14.5, color: 'var(--s-text3)', margin: '0 auto 18px', maxWidth: 540, lineHeight: 1.7 }}>
            Sign in to discover career paths based on your interests, class level, and future goals.
          </p>
          <Link to="/student/login" state={{ from: location.pathname }} style={{ textDecoration: 'none' }}>
            <SBtn variant="primary">Login / Sign Up To Continue</SBtn>
          </Link>
        </div>
      )}
    </div>
  )
}
