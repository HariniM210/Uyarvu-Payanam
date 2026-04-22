import React, { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStudentAuth } from '../../context/StudentAuthContext'
import { collegeService } from '../../services'
import { SCard, SBadge, SLoader, SEmpty, SInput, SSelect, SBtn } from '../../components/ui'
import { FiMapPin, FiSearch, FiStar } from 'react-icons/fi'

const STREAMS = ['All', 'Engineering', 'Medical', 'Arts & Science', 'Law', 'Polytechnic', 'Agriculture', 'Others']
const DISTRICTS = ['All', 'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Erode', 'Tirunelveli', 'Vellore', 'Thanjavur', 'Dindigul', 'Kanchipuram', 'Namakkal', 'Dharmapuri', 'Krishnagiri', 'Karur', 'Thoothukudi', 'Tiruppur', 'Tiruvannamalai', 'Cuddalore', 'Nagapattinam', 'Others']

const STREAM_STYLE = {
  Engineering: { color: '#1d5fba', bg: '#eaf0fb' },
  Medical: { color: '#16a34a', bg: '#f0fdf4' },
  'Arts & Science': { color: '#7c3aed', bg: '#f3effe' },
  Law: { color: '#c48a1a', bg: '#fdf4e0' },
  Polytechnic: { color: '#e05e24', bg: '#fdeee6' },
  Agriculture: { color: '#15803d', bg: '#dcfce7' },
  Others: { color: '#64748b', bg: '#f1f5f9' },
}

function formatFees(n) {
  if (!n) return 'â€”'
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L/yr`
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K/yr`
  return `${n}/yr`
}

function CollegeCard({ college }) {
  const sc = STREAM_STYLE[college.stream] || { color: 'var(--s-primary)', bg: 'var(--s-primary-l)' }
  const badgeColor = college.stream === 'Engineering' ? 'blue' : college.stream === 'Medical' ? 'green' : college.stream === 'Arts & Science' ? 'purple' : college.stream === 'Law' ? 'gold' : 'gray'
  return (
    <SCard hover style={{ borderTop: `3px solid ${sc.color}` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: sc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>ðŸ«</div>
          <div>
            <h3 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 14.5, color: 'var(--s-text)', marginBottom: 2 }}>{college.collegeName}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--s-text3)' }}>
              <FiMapPin size={11} /> {college.district || college.location || 'Tamil Nadu'}
            </div>
          </div>
        </div>
        <SBadge color={badgeColor}>{college.stream}</SBadge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7, marginBottom: 12 }}>
        {[
          { l: 'Fees', v: formatFees(college.feesPerYear), c: '#16a34a' },
          { l: 'Placement', v: college.placementPercentage ? `${college.placementPercentage}%` : 'â€”', c: '#1d5fba' },
          { l: 'Rank', v: college.rank || 'â€”', c: 'var(--s-primary)' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--s-bg2)', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 14, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 10.5, color: 'var(--s-text3)', marginTop: 1 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {college.accreditation && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: 'var(--s-gold)', fontWeight: 600, marginBottom: 10 }}>
          <FiStar size={12} fill="currentColor" /> {college.accreditation}
        </div>
      )}

      {college.coursesOffered?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {college.coursesOffered.slice(0, 3).map((c, i) => (
            <span key={i} style={{ fontSize: 11.5, background: sc.bg, color: sc.color, padding: '3px 9px', borderRadius: 6, fontWeight: 600 }}>{c}</span>
          ))}
          {college.coursesOffered.length > 3 && (
            <span style={{ fontSize: 11.5, color: 'var(--s-text3)', padding: '3px' }}>+{college.coursesOffered.length - 3}</span>
          )}
        </div>
      )}
    </SCard>
  )
}

export default function CollegesPage() {
  const { isAuthenticated } = useStudentAuth()
  const location = useLocation()

  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [stream, setStream] = useState('All')
  const [district, setDistrict] = useState('All')
  const [search, setSearch] = useState('')

  const fetchColleges = useCallback(async () => {
    try {
      setLoading(true)
      const params = {}
      if (stream !== 'All') params.stream = stream
      if (district !== 'All') params.district = district
      if (search.trim()) params.search = search.trim()
      const res = await collegeService.getAll(params)
      setColleges(res.data || res || [])
    } catch {
      setColleges([])
    } finally {
      setLoading(false)
    }
  }, [stream, district, search])

  useEffect(() => {
    const t = setTimeout(fetchColleges, 350)
    return () => clearTimeout(t)
  }, [fetchColleges])

  return (
    <div className="student-root" style={{ padding: '32px 20px', maxWidth: 1100, margin: '0 auto' }}>

      <div className="s-anim-up" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 'clamp(24px,4vw,32px)', color: 'var(--s-text)', marginBottom: 6 }}>
              College Finder
            </h1>
            <p style={{ fontSize: 14.5, color: 'var(--s-text3)' }}>
              Discover colleges across Tamil Nadu â€” filter by stream, district and search by name
            </p>
          </div>
          <Link to="/colleges/explorer" style={{ textDecoration: 'none' }}>
            <SBtn variant="outline" style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 12, padding: '10px 18px', border: '2px solid var(--s-primary)' }}>
              ðŸ“š Course Wise Fetch
            </SBtn>
          </Link>
        </div>
      </div>

      {/* Stream tabs */}
      <div className="s-anim-up s-d1" style={{ display: 'flex', gap: 7, marginBottom: 18, flexWrap: 'wrap' }}>
        {STREAMS.map(s => (
          <button key={s} onClick={() => setStream(s)} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700,
            fontFamily: 'var(--s-font-display)', cursor: 'pointer', transition: 'all 0.15s',
            border: stream === s ? '1.5px solid var(--s-primary)' : '1.5px solid var(--s-border)',
            background: stream === s ? 'var(--s-primary)' : 'var(--s-surface)',
            color: stream === s ? '#fff' : 'var(--s-text2)',
          }}>
            {s}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="s-anim-up s-d2" style={{ display: 'flex', gap: 12, marginBottom: 26, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 220px' }}>
          <SInput placeholder="Search by college name..." value={search} onChange={e => setSearch(e.target.value)} icon={<FiSearch />} />
        </div>
        <div style={{ flex: '1 1 180px' }}>
          <SSelect value={district} onChange={e => setDistrict(e.target.value)}>
            {DISTRICTS.map(d => <option key={d} value={d}>{d === 'All' ? 'All Districts' : d}</option>)}
          </SSelect>
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--s-text3)', fontWeight: 600, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: 'var(--s-font-display)', fontSize: 17, fontWeight: 800, color: 'var(--s-primary)' }}>{colleges.length}</span> results
        </div>
      </div>

      {loading ? <SLoader /> : colleges.length === 0 ? (
        <SEmpty icon="ðŸ«" title="No colleges found" desc="Try changing your stream or district filter" />
      ) : (
        <div className="s-anim-up s-d3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
          {colleges.map(c => <CollegeCard key={c._id} college={c} />)}
        </div>
      )}

      {!isAuthenticated && (
        <div className="s-anim-up" style={{
          background: 'var(--s-surface2)',
          border: '1.5px solid var(--s-border)',
          borderRadius: 20,
          padding: '32px 24px',
          textAlign: 'center',
          marginTop: 48
        }}>
          <h3 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 20, color: 'var(--s-text)', marginBottom: 8 }}>
            Get Personalized Guidance
          </h3>
          <p style={{ fontSize: 14.5, color: 'var(--s-text3)', marginBottom: 20, maxWidth: 500, margin: '0 auto 20px' }}>
            Login to unlock personalized career recommendations tailored to your exact skills, streams, and aspirations.
          </p>
          <Link to="/signin" state={{ from: location.pathname }} style={{ textDecoration: 'none' }}>
            <SBtn variant="primary">Login / Sign Up To Continue</SBtn>
          </Link>
        </div>
      )}

    </div>
  )
}
