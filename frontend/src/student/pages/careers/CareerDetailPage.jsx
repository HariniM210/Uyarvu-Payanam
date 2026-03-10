import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { courseService, examService } from '../../services'
import { SCard, SBadge, SBreadcrumb, SBtn, SLoader } from '../../components/ui'
import { FiArrowRight, FiBookOpen, FiClipboard, FiTrendingUp, FiBriefcase } from 'react-icons/fi'

const DATA = {
  engineering: {
    emoji: '⚙️', title: 'Engineering', color: '#1d5fba', bg: '#eaf0fb',
    desc: 'Engineering is one of the most sought-after career paths in India, offering diverse specialisations from CSE and ECE to Civil and Mechanical. Tamil Nadu is home to top institutes like IIT Madras, NIT Trichy, and hundreds of TNEA-affiliated colleges.',
    highlights: ['4-year B.Tech / BE programs', 'Lateral entry via Diploma', 'Government & private colleges', 'Strong placement rates'],
    exams: [
      { name: 'JEE Main',          desc: 'National — for NITs, IIITs, IITs',         level: 'National'    },
      { name: 'JEE Advanced',      desc: 'Top 2.5L from JEE Main qualify',           level: 'National'    },
      { name: 'TNEA',              desc: 'Tamil Nadu Engineering Admissions (merit)', level: 'State'       },
      { name: 'VITEEE / SRMJEEE', desc: 'Private university entrance exams',         level: 'University'  },
    ],
    courses: ['B.Tech CSE','B.Tech ECE','B.Tech Mechanical','B.Tech Civil','B.Tech IT','B.Tech Chemical','B.Tech Biotechnology'],
    careers: ['Software Engineer','Data Scientist','Mechanical Designer','Civil Engineer','Electronics Engineer','IoT Developer'],
    salary: '4L to 40L+ per year', category: 'Engineering',
  },
  medical: {
    emoji: '🏥', title: 'Medical & Health Sciences', color: '#16a34a', bg: '#f0fdf4',
    desc: 'A career in medicine is deeply rewarding. Tamil Nadu has premier government medical colleges accessible through NEET. Beyond MBBS, promising paths exist in BDS, Nursing, Physiotherapy, Pharmacy, and Ayurveda.',
    highlights: ['NEET is mandatory for MBBS/BDS', 'Government quota seats', 'High global demand', 'International opportunities'],
    exams: [
      { name: 'NEET UG',               desc: 'For MBBS, BDS, BAMS, BHMS — mandatory', level: 'National' },
      { name: 'NEET PG',               desc: 'Post-graduation MD/MS admissions',       level: 'National' },
      { name: 'AIIMS MBBS',            desc: 'Specific to AIIMS institutes',           level: 'National' },
      { name: 'TN Medical Counselling', desc: 'State quota NEET seats',               level: 'State'    },
    ],
    courses: ['MBBS','BDS','BAMS','BHMS','B.Sc Nursing','B.Pharm','BPT','BMLT'],
    careers: ['Doctor (MD/MS)','Dentist','Pharmacist','Nurse','Physiotherapist','Lab Technician','Radiologist'],
    salary: '5L to 50L+ per year', category: 'Medical',
  },
  arts: {
    emoji: '🎨', title: 'Arts & Science', color: '#7c3aed', bg: '#f3effe',
    desc: 'Arts and Science offers the broadest spectrum of career options — from economics and psychology to literature, mathematics, and computer science. Tamil Nadu universities offer quality programmes with excellent government job eligibility.',
    highlights: ['Wide subject combinations', 'Govt job eligible', 'Research & teaching paths', 'Low cost of education'],
    exams: [
      { name: 'TNAU CET',  desc: 'Tamil Nadu college admissions',        level: 'State'    },
      { name: 'UGC NET',   desc: 'Teaching & research fellowships',      level: 'National' },
      { name: 'CUET',      desc: 'Central University entrance',           level: 'National' },
      { name: 'CAT / MAT', desc: 'MBA admissions after graduation',      level: 'National' },
    ],
    courses: ['BA Economics','BA English','B.Sc Maths','B.Sc CS','BCom','BA Psychology','B.Sc Physics'],
    careers: ['Civil Servant','Teacher / Professor','Journalist','Economist','HR Manager','Data Analyst'],
    salary: '3L to 20L+ per year', category: 'Arts',
  },
  government: {
    emoji: '🏛️', title: 'Government & Civil Services', color: '#c48a1a', bg: '#fdf4e0',
    desc: 'Government jobs remain highly respected in Tamil Nadu for their job security, benefits and social impact. From UPSC IAS to TNPSC Group IV, banking exams, SSC, and defence — thousands of openings every year.',
    highlights: ['Job security & pension', 'Good work-life balance', 'Pan-India opportunities', 'Social respect'],
    exams: [
      { name: 'UPSC CSE',         desc: 'IAS, IPS, IFS — premier civil services', level: 'National' },
      { name: 'TNPSC Group I-IV', desc: 'Tamil Nadu state government posts',      level: 'State'    },
      { name: 'SSC CGL / CHSL',  desc: 'Central govt departments',              level: 'National' },
      { name: 'SBI / IBPS',      desc: 'Banking clerk and PO recruitment',       level: 'National' },
    ],
    courses: ['BA / BSc (any stream)', 'Post-graduation optional', 'Coaching-based prep', 'Distance learning eligible'],
    careers: ['IAS / IPS Officer','TNPSC Officer','Bank PO / Clerk','Income Tax Inspector','Railway Officer','Defence'],
    salary: '3.5L to 20L+ per year', category: 'Arts',
  },
  skill: {
    emoji: '💡', title: 'Skill Based & Vocational', color: '#e05e24', bg: '#fdeee6',
    desc: 'Skill-based careers are fast-growing and often offer excellent income without a 4-year degree. ITI trades, polytechnic diplomas, and modern skills like graphic design, coding, and digital marketing are in high demand.',
    highlights: ['Shorter course duration', 'High ROI education', 'Industry-ready from day 1', 'Growing market demand'],
    exams: [
      { name: 'ITI Admission',    desc: 'Trade selection after 10th',          level: 'State'    },
      { name: 'Polytechnic CET',  desc: 'Tamil Nadu polytechnic admission',    level: 'State'    },
      { name: 'NID / NIFT',       desc: 'Design institute entrance exams',     level: 'National' },
      { name: 'Skill India Cert', desc: 'Government certification programmes', level: 'National' },
    ],
    courses: ['ITI (Fitter, Welder)','Diploma ECE/Mech/Civil','Graphic Design','Web Development','Digital Marketing'],
    careers: ['Electrician','CNC Operator','Graphic Designer','Web Developer','Digital Marketer','Animator'],
    salary: '2L to 18L+ per year', category: 'ITI',
  },
}

export default function CareerDetailPage() {
  const { slug } = useParams()
  const d = DATA[slug]

  const [courses,  setCourses]  = useState([])
  const [exams,    setExams]    = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (!d) return
    setLoading(true)
    Promise.allSettled([
      courseService.getByCategory(d.category).then(r => setCourses((r.data || r || []).slice(0, 8))),
      examService.getAll({ category: d.category }).then(r => setExams((r.data || r || []).slice(0, 6))),
    ]).finally(() => setLoading(false))
  }, [slug])

  if (!d) {
    return (
      <div className="student-root" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 54, marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 22, color: 'var(--s-text)', marginBottom: 10 }}>
          Career stream not found
        </h2>
        <Link to="/student/careers"><SBtn variant="primary">Back to Careers</SBtn></Link>
      </div>
    )
  }

  const displayExams   = exams.length   > 0 ? exams.map(e   => ({ name: e.examName || e.name, desc: e.description || e.fullForm || '', level: e.level || 'National' })) : d.exams
  const displayCourses = courses.length > 0 ? courses.map(c => c.courseName) : d.courses

  return (
    <div className="student-root" style={{ padding: '32px 20px', maxWidth: 1060, margin: '0 auto' }}>

      <SBreadcrumb items={[
        { label: 'Home',    href: '/student'         },
        { label: 'Careers', href: '/student/careers' },
        { label: d.title                             },
      ]} />

      {/* Hero banner */}
      <div className="s-anim-up" style={{ background: d.bg, borderRadius: 20, padding: '38px', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: -20, fontSize: 130, opacity: 0.10, lineHeight: 1 }}>{d.emoji}</div>
        <div style={{ fontSize: 46, marginBottom: 14 }}>{d.emoji}</div>
        <h1 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 'clamp(24px,5vw,36px)', color: 'var(--s-text)', marginBottom: 12 }}>
          {d.title}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--s-text2)', lineHeight: 1.78, maxWidth: 680, marginBottom: 22 }}>{d.desc}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {d.highlights.map((h, i) => (
            <span key={i} style={{ fontSize: 13, background: 'rgba(255,255,255,0.72)', color: d.color, padding: '5px 12px', borderRadius: 8, fontWeight: 600, border: `1px solid ${d.color}20`, fontFamily: 'var(--s-font-display)' }}>
              {h}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 22 }}>

        {/* Exams */}
        <div className="s-anim-up s-d1">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <FiClipboard size={17} style={{ color: d.color }} />
            <h2 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 17, color: 'var(--s-text)' }}>Entrance Exams</h2>
          </div>
          {loading ? <SLoader /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {displayExams.map((ex, i) => (
                <SCard key={i} style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--s-font-display)', fontWeight: 700, fontSize: 14, color: 'var(--s-text)', marginBottom: 3 }}>{ex.name}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--s-text3)' }}>{ex.desc}</div>
                    </div>
                    <SBadge color={ex.level === 'National' ? 'blue' : ex.level === 'State' ? 'green' : 'gray'}>{ex.level}</SBadge>
                  </div>
                </SCard>
              ))}
            </div>
          )}
        </div>

        {/* Courses + Careers */}
        <div className="s-anim-up s-d2">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <FiBookOpen size={17} style={{ color: d.color }} />
            <h2 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 17, color: 'var(--s-text)' }}>Popular Courses</h2>
          </div>
          <SCard style={{ padding: '18px 20px', marginBottom: 22 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
              {displayCourses.map((c, i) => (
                <span key={i} style={{ fontSize: 13, background: d.bg, color: d.color, padding: '6px 12px', borderRadius: 8, fontWeight: 600, fontFamily: 'var(--s-font-display)' }}>{c}</span>
              ))}
            </div>
          </SCard>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <FiBriefcase size={17} style={{ color: d.color }} />
            <h2 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 17, color: 'var(--s-text)' }}>Career Opportunities</h2>
          </div>
          <SCard style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginBottom: 16 }}>
              {d.careers.map((c, i) => (
                <span key={i} style={{ fontSize: 13, background: 'var(--s-bg2)', color: 'var(--s-text2)', padding: '6px 12px', borderRadius: 8, fontWeight: 500 }}>{c}</span>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 14px', background: 'var(--s-primary-l)', borderRadius: 10 }}>
              <FiTrendingUp size={15} style={{ color: 'var(--s-primary)', flexShrink: 0 }} />
              <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--s-primary)', fontFamily: 'var(--s-font-display)' }}>
                Expected Salary: {d.salary}
              </span>
            </div>
          </SCard>
        </div>
      </div>

      <div className="s-anim-up s-d3" style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/student/colleges"><SBtn variant="primary">Find Colleges <FiArrowRight size={15} /></SBtn></Link>
        <Link to="/student/careers"><SBtn variant="ghost">Back to Careers</SBtn></Link>
      </div>
    </div>
  )
}
