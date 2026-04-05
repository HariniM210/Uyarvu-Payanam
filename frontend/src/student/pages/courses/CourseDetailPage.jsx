import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  FiChevronLeft, FiMapPin, FiGlobe, FiChevronRight, 
  FiDownload, FiBriefcase, FiTrendingUp, FiCheckCircle, FiInfo 
} from 'react-icons/fi'
import { SBadge, SCard, SBtn, SLoader } from '../../components/ui'
import { courseService } from '../../../services/courseService'
import { adminService } from '../../../services/adminService'
import { cutoffService } from '../../../services/cutoffService'

export default function CourseDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [colleges, setColleges] = useState([])
  const [cutoffs, setCutoffs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Overview')

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true)
      const cRes = await courseService.getCourseById(slug)
      if (cRes.success) {
        const courseData = cRes.data
        setCourse(courseData)

        // Fetch colleges offering this course
        const clRes = await adminService.getColleges({ courseId: courseData._id })
        setColleges(clRes.data || [])

        // Fetch cutoffs for this course
        const ctRes = await cutoffService.getCutoffs({ courseId: courseData._id })
        setCutoffs(ctRes.data || [])
      }
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchDetails()
  }, [fetchDetails])

  if (loading) return <SLoader fullScreen />
  if (!course) return <div style={{ padding: 100, textAlign: 'center' }}>Course not found.</div>

  return (
    <div className="student-root" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* ── BANNER / HEADER ── */}
      <section style={{ background: 'var(--s-primary)', color: '#fff', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', opacity: 0.8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontWeight: 700 }}>
            <FiChevronLeft /> Back to Discovery
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <SBadge color="blue">{course.targetLevel}</SBadge>
                <SBadge color="white" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>{course.category}</SBadge>
              </div>
              <h1 style={{ fontFamily: 'var(--s-font-display)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
                {course.courseName}
              </h1>
              <p style={{ fontSize: 18, opacity: 0.9, marginTop: 16, maxWidth: 700, lineHeight: 1.6 }}>
                {course.shortDescription}
              </p>
            </div>
            <SBtn variant="white" style={{ borderRadius: 14, padding: '16px 32px' }} onClick={() => window.print()}>
               <FiDownload style={{ marginRight: 8 }} /> Download Career Guide
            </SBtn>
          </div>
        </div>
      </section>

      {/* ── TABS ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--s-border)', sticky: 'top', top: 64, zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 32 }}>
          {['Overview', 'Admission & Path', 'Offering Colleges', 'Cutoff Trends'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '20px 0', background: 'none', border: 'none', borderBottom: activeTab === tab ? '3px solid var(--s-primary)' : '3px solid transparent',
                color: activeTab === tab ? 'var(--s-primary)' : 'var(--s-text3)', fontWeight: 800, cursor: 'pointer', fontSize: 15, transition: '0.2s'
              }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: 1200, margin: '40px auto', padding: '0 24px' }}>
        
        {/* ── SECTION: OVERVIEW ── */}
        {activeTab === 'Overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
             <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
                <SCard style={{ padding: 32 }}>
                   <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 20 }}>Program Overview</h2>
                   <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--s-text2)' }}>{course.overview}</p>
                </SCard>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                   <SCard style={{ padding: 24 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FiCheckCircle color="var(--s-primary)" /> Key Skills Required
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                         {(course.skillsRequired || []).map(s => <SBadge key={s} color="gray">{s}</SBadge>)}
                      </div>
                   </SCard>
                   <SCard style={{ padding: 24 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FiBookOpen color="var(--s-primary)" /> Core Subjects
                      </h3>
                      <ul style={{ padding: 0, margin: 0, listStyle: 'none', display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                         {(course.subjectsCovered || []).map(s => <li key={s} style={{ fontSize:14, color:'var(--s-text2)' }}>• {s}</li>)}
                      </ul>
                   </SCard>
                </div>

                <SCard style={{ padding: 32 }}>
                   <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 24 }}>Career Scope & Opportunities</h2>
                   <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--s-text2)', marginBottom: 24 }}>{course.careerScope}</p>
                   
                   <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20 }}>
                      <div style={{ background:'var(--s-bg)', padding:20, borderRadius:16 }}>
                         <FiTrendingUp size={24} color="var(--s-primary)" style={{ marginBottom:12 }} />
                         <div style={{ fontSize:13, fontWeight:700, color:'var(--s-text3)', textTransform:'uppercase' }}>Starting Salary</div>
                         <div style={{ fontSize:18, fontWeight:900, color:'var(--s-text)' }}>{course.salaryRange?.starting || 'Varies'}</div>
                      </div>
                      <div style={{ background:'var(--s-bg)', padding:20, borderRadius:16 }}>
                         <FiTrendingUp size={24} color="#10b981" style={{ marginBottom:12, transform:'rotate(45deg)' }} />
                         <div style={{ fontSize:13, fontWeight:700, color:'var(--s-text3)', textTransform:'uppercase' }}>Growth Path</div>
                         <div style={{ fontSize:18, fontWeight:900, color:'var(--s-text)' }}>{course.salaryRange?.growth || 'High'}</div>
                      </div>
                      <div style={{ background:'var(--s-bg)', padding:20, borderRadius:16 }}>
                         <FiBriefcase size={24} color="var(--s-primary)" style={{ marginBottom:12 }} />
                         <div style={{ fontSize:13, fontWeight:700, color:'var(--s-text3)', textTransform:'uppercase' }}>Job Roles</div>
                         <div style={{ fontSize:15, fontWeight:800, color:'var(--s-text)' }}>{(course.jobRoles || []).length} Categories</div>
                      </div>
                   </div>
                </SCard>
             </div>

             <aside>
                <SCard style={{ padding: 24, sticky: 'top', top: 150 }}>
                   <h3 style={{ fontSize: 18, fontWeight: 950, marginBottom: 20 }}>Quick Facts</h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <div style={{ fontSize:12, fontWeight:800, color:'var(--s-text3)', textTransform:'uppercase' }}>Duration</div>
                        <div style={{ fontSize:15, fontWeight:700 }}>{course.duration}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:12, fontWeight:800, color:'var(--s-text3)', textTransform:'uppercase' }}>Eligibility</div>
                        <div style={{ fontSize:15, fontWeight:700 }}>{course.eligibility}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:12, fontWeight:800, color:'var(--s-text3)', textTransform:'uppercase' }}>Course Type</div>
                        <div style={{ fontSize:15, fontWeight:700 }}>{course.level}</div>
                      </div>
                   </div>
                   <hr style={{ margin: '20px 0', border: 0, borderTop: '1px solid var(--s-border)' }} />
                   <SBtn fullWidth>Check My Eligibility</SBtn>
                </SCard>
             </aside>
          </div>
        )}

        {/* ── SECTION: ADMISSION ── */}
        {activeTab === 'Admission & Path' && (
           <div style={{ maxWidth: 800 }}>
             <SCard style={{ padding: 40 }}>
                <h2 style={{ fontSize: 26, fontWeight: 950, marginBottom: 24 }}>Admission & Roadmap</h2>
                <div style={{ borderLeft: '3px solid var(--s-primary)', paddingLeft: 24, marginBottom: 40 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Standard Admission Process</h3>
                  <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--s-text2)' }}>{course.admissionProcess}</p>
                </div>
                
                <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 20 }}>Higher Studies Opportunities</h3>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--s-text2)' }}>{course.higherStudies}</p>
             </SCard>
           </div>
        )}

        {/* ── SECTION: COLLEGES ── */}
        {activeTab === 'Offering Colleges' && (
           <div>
             <div style={{ marginBottom: 24, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h2 style={{ fontSize: 26, fontWeight: 950, margin: 0 }}>Top {colleges.length} Colleges for {course.courseName}</h2>
                <span style={{ fontSize: 14, color:'var(--s-text3)', fontWeight:700 }}>Filtered by Course Mapping</span>
             </div>
             
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
                {colleges.map(clg => (
                   <SCard key={clg._id} style={{ padding: 24, position:'relative' }}>
                      <div style={{ display: 'flex', gap: 16 }}>
                         <div style={{ width: 60, height: 60, borderRadius: 12, background: 'var(--s-bg)', fontSize: 24, display: 'grid', placeItems: 'center' }}>🏫</div>
                         <div>
                            <h3 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 4px', color:'var(--s-text)' }}>{clg.collegeName}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--s-text3)', fontSize: 13, fontWeight: 700 }}>
                               <FiMapPin size={12} /> {clg.district}, {clg.state}
                            </div>
                         </div>
                      </div>
                      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div style={{ fontSize: 14, color: 'var(--s-text2)', fontWeight: 800 }}>Rank: #{clg.rank || 'N/A'}</div>
                         {clg.website && (
                            <a href={clg.website} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                               <SBtn variant="white" size="sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  Website <FiGlobe size={14} />
                               </SBtn>
                            </a>
                         )}
                      </div>
                   </SCard>
                ))}
             </div>
           </div>
        )}

        {/* ── SECTION: CUTOFF ── */}
        {activeTab === 'Cutoff Trends' && (
           <div style={{ maxWidth: 900 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24, background:'#fff7ed', padding:'16px 24px', borderRadius:16, border:'1px solid #ffedd5' }}>
                 <FiInfo size={24} color="#f59e0b" />
                 <p style={{ margin:0, fontSize:14.5, color:'#9a3412', fontWeight:600 }}>
                   Cutoff data displayed is based on professional year-wise reports. Engineering and Technical courses show category-specific scores.
                 </p>
              </div>

              <SCard style={{ padding: 0, overflow: 'hidden' }}>
                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                       <tr style={{ background: 'var(--s-bg)', textAlign: 'left' }}>
                          <th style={{ padding: 20, fontSize: 13, fontWeight: 900, color: 'var(--s-text)', textTransform: 'uppercase' }}>College</th>
                          <th style={{ padding: 20, fontSize: 13, fontWeight: 900, color: 'var(--s-text)', textTransform: 'uppercase' }}>Year</th>
                          <th style={{ padding: 20, fontSize: 13, fontWeight: 900, color: 'var(--s-text)', textTransform: 'uppercase' }}>General</th>
                          <th style={{ padding: 20, fontSize: 13, fontWeight: 900, color: 'var(--s-text)', textTransform: 'uppercase' }}>OBC / BC</th>
                          <th style={{ padding: 20, fontSize: 13, fontWeight: 900, color: 'var(--s-text)', textTransform: 'uppercase' }}>SC / ST</th>
                       </tr>
                    </thead>
                    <tbody>
                       {cutoffs.map(ct => (
                          <tr key={ct._id} style={{ borderBottom: '1px solid var(--s-border)' }}>
                             <td style={{ padding: 20, fontWeight: 700 }}>{ct.collegeId?.collegeName || ct.college || 'Institution'}</td>
                             <td style={{ padding: 20, color: 'var(--s-text3)', fontWeight: 700 }}>{ct.year}</td>
                             <td style={{ padding: 20, fontWeight: 900, color: 'var(--s-primary)' }}>
                               {ct.cutoffData?.find(d => ['OC','General'].includes(d.category))?.score || ct.oc || '\u2014'}
                             </td>
                             <td style={{ padding: 20, fontWeight: 900, color: '#f59e0b' }}>
                               {ct.cutoffData?.find(d => ['BC','OBC'].includes(d.category))?.score || ct.bc || '\u2014'}
                             </td>
                             <td style={{ padding: 20, fontWeight: 900, color: '#ef4444' }}>
                               {ct.cutoffData?.find(d => ['SC','ST'].includes(d.category))?.score || ct.sc || '\u2014'}
                             </td>
                          </tr>
                       ))}
                       {cutoffs.length === 0 && (
                          <tr><td colSpan="5" style={{ padding:40, textAlign:'center', color:'var(--s-text3)' }}>No historical cutoff data available for this selection.</td></tr>
                       )}
                    </tbody>
                 </table>
              </SCard>
           </div>
        )}

      </main>

    </div>
  )
}
