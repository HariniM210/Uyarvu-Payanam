import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FiArrowRight, FiBookOpen, FiCompass, FiLayers, FiSettings,
  FiPlusCircle, FiFeather, FiDroplet, FiBriefcase, FiSearch
} from 'react-icons/fi'
import { useStudentAuth } from '../../context/StudentAuthContext'
import { SBadge, SBtn, SCard, SInput } from '../../components/ui'
import { COURSE_LEVEL_CONFIGS, COURSE_CATEGORIES } from './courseCatalog'

function QualifierCard({ item, index }) {
  const icons = [FiCompass, FiBookOpen, FiLayers]
  const Icon = icons[index] || FiBookOpen

  return (
    <Link to={`/student/courses/${item.key}`} style={{ textDecoration: 'none' }}>
      <SCard
        hover
        className={`s-anim-up s-d${index + 1}`}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          cursor: 'pointer',
          padding: '22px',
          border: '1px solid var(--s-border)',
          background: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            display: 'grid',
            placeItems: 'center',
            background: 'var(--s-bg)',
            color: 'var(--s-primary)',
          }}>
            <Icon size={22} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--s-font-display)', fontSize: 18, fontWeight: 700, color: 'var(--s-text)', margin: 0 }}>
              {item.title}
            </h3>
            <SBadge color={item.badgeColor} style={{ marginTop: 4 }}>{item.level}</SBadge>
          </div>
        </div>

        <p style={{ margin: 0, color: 'var(--s-text3)', fontSize: 14, lineHeight: 1.6 }}>
          {item.summary}
        </p>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--s-primary)', fontWeight: 700, fontSize: 13.5 }}>
          View Programs <FiArrowRight size={14} />
        </div>
      </SCard>
    </Link>
  )
}

function StreamCard({ item }) {
  const icons = {
    FiSettings: FiSettings,
    FiPlusCircle: FiPlusCircle,
    FiFeather: FiFeather,
    FiDroplet: FiDroplet,
    FiBriefcase: FiBriefcase
  }
  const Icon = icons[item.icon] || FiBookOpen

  return (
    <Link to={`/student/courses/search?category=${item.title}`} style={{ textDecoration: 'none' }}>
      <SCard
        hover
        style={{
          padding: '20px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          background: '#fff',
          border: '1px solid var(--s-border)',
        }}
      >
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 99,
          display: 'grid',
          placeItems: 'center',
          background: `${item.accent}08`,
          color: item.accent,
          border: `1.5px solid ${item.accent}20`
        }}>
          <Icon size={24} />
        </div>
        <h3 style={{
          fontFamily: 'var(--s-font-display)',
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--s-text)',
          margin: 0
        }}>
          {item.title}
        </h3>
      </SCard>
    </Link>
  )
}

export default function CoursesPage() {
  const { isAuthenticated } = useStudentAuth()
  const [search, setSearch] = useState('')

  return (
    <div className="student-root" style={{ paddingBottom: 60 }}>

      {/* Hero / Header */}
      <section style={{
        padding: '50px 24px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #fff 0%, var(--s-bg) 100%)',
        borderBottom: '1px solid var(--s-border)'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <SBadge color="blue" style={{ marginBottom: 16 }}>Course Finder</SBadge>
          <h1 style={{
            fontFamily: 'var(--s-font-display)',
            fontWeight: 800,
            fontSize: 'clamp(32px, 5vw, 48px)',
            color: 'var(--s-text)',
            marginBottom: 16,
            letterSpacing: '-0.02em'
          }}>
            Find the Right Course<br />
            <span>for Your Future</span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--s-text3)', lineHeight: 1.7, marginBottom: 32 }}>
            Search through hundreds of programs across Tamil Nadu. Filter by stream,
            qualification, and eligibility to find your perfect match.
          </p>

          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <SInput
              placeholder="Search by course name, category, or field..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<FiSearch />}
              style={{ padding: '14px 14px 14px 44px', borderRadius: 14, boxShadow: 'var(--s-shadow-md)' }}
            />
          </div>
        </div>
      </section>

      {/* Browse by Stream */}
      <section style={{ padding: '60px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 28, color: 'var(--s-text)', margin: '0 0 10px' }}>
            Browse by Stream
          </h2>
          <p style={{ color: 'var(--s-text3)', fontSize: 15 }}>Select a category to explore specialized degree and diploma programs</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16
        }}>
          {COURSE_CATEGORIES.map((item) => (
            <StreamCard key={item.key} item={item} />
          ))}
        </div>
      </section>

      {/* Browse by Level */}
      <section style={{ padding: '20px 24px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 28, color: 'var(--s-text)', margin: '0 0 10px' }}>
            Browse by Qualification
          </h2>
          <p style={{ color: 'var(--s-text3)', fontSize: 15 }}>Structured pathways based on your current educational milestone</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20
        }}>
          {COURSE_LEVEL_CONFIGS.map((item, index) => (
            <QualifierCard key={item.key} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* Stats / CTA */}
      {!isAuthenticated && (
        <section style={{ padding: '0 24px' }}>
           <div style={{
            maxWidth: 1000,
            margin: '0 auto',
            padding: '40px',
            borderRadius: 24,
            background: 'var(--s-primary)',
            color: '#fff',
            textAlign: 'center',
            boxShadow: '0 20px 48px rgba(15, 76, 117, 0.2)'
          }}>
            <h3 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 26, marginBottom: 12 }}>
              Need Personalized Suggestions?
            </h3>
            <p style={{ fontSize: 16, opacity: 0.8, maxWidth: 600, margin: '0 auto 24px', lineHeight: 1.7 }}>
              Create an account to save your favorite courses and get recommendations based on your profile and interests.
            </p>
            <Link to="/student/signup" style={{ textDecoration: 'none' }}>
              <SBtn variant="white" size="lg">Create Free Account</SBtn>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
