import React from 'react'
import { Link } from 'react-router-dom'
import { SCard, SBadge } from '../../components/ui'
import { FiArrowRight } from 'react-icons/fi'

const STREAMS = [
  {
    slug: 'engineering', emoji: '⚙️', title: 'Engineering',
    desc: 'B.Tech, BE, Diploma — from CSE to Civil, with JEE Main, JEE Advanced, and TNEA.',
    color: '#1d5fba', bg: '#eaf0fb', badgeColor: 'blue', badge: 'Most Popular',
    tags: ['JEE Main', 'JEE Advanced', 'TNEA', '500+ Colleges'],
  },
  {
    slug: 'medical', emoji: '🏥', title: 'Medical & Health Sciences',
    desc: 'MBBS, BDS, BAMS, nursing and allied health — all accessible through NEET.',
    color: '#16a34a', bg: '#f0fdf4', badgeColor: 'green', badge: 'High Demand',
    tags: ['NEET UG', 'NEET PG', 'MBBS / BDS', 'Govt Colleges'],
  },
  {
    slug: 'arts', emoji: '🎨', title: 'Arts & Science',
    desc: 'BA, BSc, BCom and humanities — broad career options including civil services.',
    color: '#7c3aed', bg: '#f3effe', badgeColor: 'purple', badge: 'Diverse',
    tags: ['BA / BSc / BCom', 'UGC NET', 'CUET', 'Govt Job Eligible'],
  },
  {
    slug: 'government', emoji: '🏛️', title: 'Government & Civil Services',
    desc: 'UPSC, TNPSC, SSC, banking and defence — secure, respected careers in public service.',
    color: '#c48a1a', bg: '#fdf4e0', badgeColor: 'gold', badge: 'Stable Career',
    tags: ['UPSC CSE', 'TNPSC Group I-IV', 'SSC / Railway', 'Banking'],
  },
  {
    slug: 'skill', emoji: '💡', title: 'Skill Based & Vocational',
    desc: 'ITI, polytechnic, design, coding — fast-track practical paths with strong demand.',
    color: '#e05e24', bg: '#fdeee6', badgeColor: 'orange', badge: 'Fast Track',
    tags: ['ITI Trades', 'Polytechnic', 'Design / NID / NIFT', 'Coding Bootcamps'],
  },
]

export default function CareersPage() {
  return (
    <div className="student-root" style={{ padding: '40px 20px', maxWidth: 1100, margin: '0 auto' }}>

      <div className="s-anim-up" style={{ marginBottom: 40, textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 'clamp(26px,5vw,38px)', color: 'var(--s-text)', marginBottom: 10 }}>
          Explore Career Streams
        </h1>
        <p style={{ fontSize: 15.5, color: 'var(--s-text3)', maxWidth: 500, margin: '0 auto' }}>
          Discover what each major career stream offers — from courses and exams to future opportunities
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {STREAMS.map((s, i) => (
          <Link key={s.slug} to={`/student/careers/${s.slug}`} style={{ textDecoration: 'none' }}>
            <SCard hover style={{ padding: '26px', cursor: 'pointer' }} className={`s-anim-up s-d${i + 1}`}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ width: 62, height: 62, borderRadius: 16, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                  {s.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7, flexWrap: 'wrap' }}>
                    <h2 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 19, color: 'var(--s-text)' }}>{s.title}</h2>
                    <SBadge color={s.badgeColor}>{s.badge}</SBadge>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--s-text3)', lineHeight: 1.7, marginBottom: 14 }}>{s.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {s.tags.map((t, j) => (
                      <span key={j} style={{ fontSize: 12.5, background: s.bg, color: s.color, padding: '4px 10px', borderRadius: 8, fontWeight: 600, fontFamily: 'var(--s-font-display)' }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: s.color, fontFamily: 'var(--s-font-display)', fontWeight: 700, fontSize: 14, gap: 5, alignSelf: 'center', flexShrink: 0 }}>
                  Explore <FiArrowRight size={16} />
                </div>
              </div>
            </SCard>
          </Link>
        ))}
      </div>
    </div>
  )
}
