import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiSearch, FiChevronLeft } from 'react-icons/fi'
import { SBadge, SCard, SInput, SLoader } from '../../components/ui'
import { courseService } from '../../../services/courseService'

export default function CoursesPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Trajectory, 2: Category, 3: Listing
  const [selectedTrajectory, setSelectedTrajectory] = useState('') // "After 10th" or "After 12th"
  const [selectedCategory, setSelectedCategory] = useState('')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const categories10th = ["Polytechnic", "Diploma", "Vocational", "Certification"]
  const categories12th = ["Engineering", "Medical", "Law", "B.Sc", "B.A", "B.Com", "BBA", "BCA", "Agriculture", "Design", "Management", "Architecture"]

  const fetchCourses = async (trajectory, category) => {
    try {
      setLoading(true)
      const res = await courseService.getAllCourses({ targetLevel: trajectory, level: category })
      if (res.success) {
        setCourses(res.data)
      }
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTrajectorySelect = (traj) => {
    setSelectedTrajectory(traj)
    setStep(2)
  }

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat)
    fetchCourses(selectedTrajectory, cat)
    setStep(3)
  }

  const filteredCourses = courses.filter(c => 
    c.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="student-root" style={{ minHeight: '80vh', paddingBottom: 80 }}>
      
      {/* Header */}
      <section style={{ padding: '60px 24px', textAlign: 'center', background: 'linear-gradient(180deg, #fff 0%, var(--s-bg) 100%)', borderBottom: '1px solid var(--s-border)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <SBadge color="blue" style={{ marginBottom: 16 }}>Expert Guidance</SBadge>
          <h1 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 42px)', color: 'var(--s-text)', marginBottom: 16 }}>
            {step === 1 && "Choose Your Starting Point"}
            {step === 2 && `Explore ${selectedTrajectory} Categories`}
            {step === 3 && `${selectedCategory} Programs`}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--s-text3)', maxWidth: 600, margin: '0 auto' }}>
            Structured career pathways and high-fidelity course data to help you build your academic trajectory with confidence.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        
        {/* Navigation Breadcrumb / Back */}
        {step > 1 && (
          <button 
            onClick={() => {
                if (step === 2) setStep(1)
                if (step === 3) setStep(2)
            }}
            style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', color:'var(--s-primary)', fontWeight:800, cursor:'pointer', marginBottom:32, fontSize:15 }}
          >
            <FiChevronLeft /> Back to {step === 2 ? "Aspirations" : "Categories"}
          </button>
        )}

        {/* STEP 1: TRAJECTORY CHOICE */}
        {step === 1 && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:24 }}>
            {[
              { id: 'After 10th', title: 'I have completed Class 10', desc: 'Explore polytechnic diplomas, vocational training, and early professional certifications.', icon: '🎓' },
              { id: 'After 12th', title: 'I have completed Class 12', desc: 'Highly specialized degrees in Engineering, Medicine, Arts, Science, and Professional fields.', icon: '🏛️' }
            ].map(item => (
              <SCard key={item.id} hover onClick={() => handleTrajectorySelect(item.id)} style={{ padding:40, textAlign:'center', cursor:'pointer', border:'2px solid transparent', transition:'all 0.3s' }}>
                <div style={{ fontSize:56, marginBottom:20 }}>{item.icon}</div>
                <h3 style={{ fontSize:22, fontWeight:900, marginBottom:12, color:'var(--s-text)' }}>{item.title}</h3>
                <p style={{ color:'var(--s-text3)', lineHeight:1.6, marginBottom:24 }}>{item.desc}</p>
                <div style={{ color:'var(--s-primary)', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                   Start Discovering <FiArrowRight />
                </div>
              </SCard>
            ))}
          </div>
        )}

        {/* STEP 2: CATEGORY CHOICE */}
        {step === 2 && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:20 }}>
            {(selectedTrajectory === 'After 10th' ? categories10th : categories12th).map(cat => (
              <SCard key={cat} hover onClick={() => handleCategorySelect(cat)} style={{ padding:32, textAlign:'center', cursor:'pointer' }}>
                 <div style={{ width:50, height:50, borderRadius:12, background:'var(--s-bg)', color:'var(--s-primary)', display:'grid', placeItems:'center', margin:'0 auto 16px' }}>
                    <FiArrowRight size={20} />
                 </div>
                 <h4 style={{ fontSize:17, fontWeight:800, margin:0, color:'var(--s-text)' }}>{cat}</h4>
              </SCard>
            ))}
          </div>
        )}

        {/* STEP 3: LISTING */}
        {step === 3 && (
          <div>
            <div style={{ marginBottom:40, display:'flex', gap:20, flexWrap:'wrap', alignItems:'center' }}>
               <div style={{ flex:1, minWidth:300 }}>
                  <SInput 
                    placeholder={`Search ${selectedCategory} courses...`} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<FiSearch />}
                  />
               </div>
               <span style={{ fontSize:15, color:'var(--s-text3)', fontWeight:700 }}>{filteredCourses.length} Programs Found</span>
            </div>

            {loading ? <SLoader /> : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(360px, 1fr))', gap:24 }}>
                {filteredCourses.map(course => (
                  <SCard key={course._id} style={{ display:'flex', flexDirection:'column', gap:10, padding:24, background:'#fff', border:'1px solid var(--s-border)' }}>
                     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                        <h3 style={{ fontSize:19, fontWeight:900, color:'var(--s-text)', margin:0, flex:1 }}>{course.courseName}</h3>
                        <SBadge color="purple" style={{ textTransform:'uppercase' }}>{course.duration}</SBadge>
                     </div>
                     <p style={{ color:'var(--s-text3)', fontSize:14.5, lineHeight:1.6, margin:'8px 0 16px' }}>
                        {course.shortDescription || "Explore professional depth and career outcomes for this program."}
                     </p>
                     <div style={{ background:'var(--s-bg)', padding:'12px 16px', borderRadius:12, fontSize:13.5 }}>
                        <strong style={{ color:'var(--s-text)' }}>Eligibility:</strong> {course.eligibility}
                     </div>
                     <Link to={`/student/course/${course.slug}`} style={{ textDecoration:'none', marginTop:16 }}>
                        <SBtn fullWidth style={{ borderRadius:12, fontWeight:850 }}>View Program Details</SBtn>
                     </Link>
                  </SCard>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
