import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowLeft, FiArrowRight, FiSearch, FiBookOpen, FiCompass, FiTarget,
  FiTrendingUp, FiFlag, FiChevronRight, FiCheckCircle, FiPlay, FiImage, FiStar
} from 'react-icons/fi'
import { careerService, courseService } from '../../services'
import { SBtn, SLoader, SEmpty, SInput, SBadge, SSelect } from '../../components/ui'
import {
  extractCareerResponse,
  getCareerShortDescription,
} from './careerCatalog'

const CLASS_CONFIG = {
  'class-5': {
    level: '5',
    title: 'Class 5',
    heading: 'Explore, Learn & Grow – Your Journey After 5th',
    description: 'A magical time to explore your interests, learn new skills, and discover the world through fun activities.',
    accentColor: '#6d28d9',
    accentBg: '#f5f3ff',
    icon: FiCompass,
    isKidFriendly: true
  },
  'class-8': {
    level: '8',
    title: 'Class 8',
    heading: 'Strategic Guidance for Class 8',
    description: 'Building a bridge between academic subjects and real-world careers to help students identify their natural interests.',
    accentColor: '#b45309',
    accentBg: '#fffbeb',
    icon: FiFlag,
  },
  'class-10': {
    level: '10',
    title: 'Class 10',
    heading: 'Academic Specialization After Class 10',
    description: 'Expert roadmaps for stream selection and vocational paths to ensure a solid start to higher secondary education.',
    accentColor: '#047857',
    accentBg: '#f0fdf4',
    icon: FiTarget,
  },
  'class-12': {
    level: '12',
    title: 'Class 12',
    heading: 'Professional Career Launcher for Class 12',
    description: 'Comprehensive guidance on degree programs, entrance exams, and professional pathways for a successful career.',
    accentColor: '#1e40af',
    accentBg: '#eff6ff',
    icon: FiTrendingUp,
  },
}

// ── Rich Content Section (Step 322 Requirement) ────────────────────────────────
function RichMediaSection({ section, index, accent }) {
  const [activeImg, setActiveImg] = useState(0)
  const images = section.images || []
  const hasVideo = section.videoUrl && (section.videoUrl.includes('youtube.com') || section.videoUrl.includes('youtu.be'))

  // Get Video ID
  const getVidId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const vId = hasVideo ? getVidId(section.videoUrl) : null

  return (
    <div style={{
      padding: '32px', background: '#fff', border: '1px solid var(--s-border)',
      borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 20,
      marginBottom: 30, boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
      animation: 'fadeUp 0.5s ease both', animationDelay: `${index * 0.1}s`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
         <div style={{ width: 8, height: 32, borderRadius: 4, background: accent }}></div>
         <h3 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 900, fontSize: 24, color: 'var(--s-text)', margin: 0 }}>
           {index + 1}. {section.heading}
         </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: images.length > 0 || vId ? 'minmax(0, 1.2fr) minmax(0, 0.8fr)' : '1fr', gap: 32, alignItems: 'start' }}>
        
        <div style={{ fontSize: 16.5, color: 'var(--s-text3)', lineHeight: 1.8 }}>
           {section.content}
        </div>

        {/* Media Side */}
        {(images.length > 0 || vId) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {vId && (
              <div style={{ borderRadius: 16, overflow: 'hidden', background: '#000', aspectRatio: '16/9', position: 'relative', border: '1px solid var(--s-border)' }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${vId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            {images.length > 0 && (
              <div style={{ position: 'relative' }}>
                <img 
                  src={images[activeImg]} 
                  alt={section.heading} 
                  style={{ width: '100%', borderRadius: 16, maxHeight: 240, objectFit: 'cover', border: '1px solid var(--s-border)' }} 
                />
                {images.length > 1 && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 10, justifyContent: 'center' }}>
                    {images.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveImg(i)}
                        style={{ width: 8, height: 8, borderRadius: 4, padding: 0, border: 'none', background: i === activeImg ? accent : '#cbd5e1', cursor: 'pointer', transition: 'all 0.2s' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function CareerListSection({ career, accent, isKidFriendly }) {
  const shortDesc = getCareerShortDescription(career)
  const hasSections = (career.sections || []).length > 0

  return (
    <div style={{ marginBottom: 40 }}>
       {/* If it's a rich career path with sections, show them first */}
       {hasSections ? (
         <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {career.sections.map((sec, idx) => (
              <RichMediaSection key={idx} section={sec} index={idx} accent={accent} />
            ))}
         </div>
       ) : (
         <div
           style={{
             padding: '28px', background: '#fff', border: '1px solid var(--s-border)',
             borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 16,
             transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden'
           }}
         >
           <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: accent }}></div>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
             <div style={{ flex: 1 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                 <SBadge color="gray">{career.interestArea || 'General'}</SBadge>
                 {career.isRecommended && <SBadge color="green"><FiCheckCircle size={12} /> Recommended</SBadge>}
               </div>
               <h3 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 22, color: 'var(--s-text)', margin: 0 }}>
                 {career.title}
               </h3>
             </div>
             <Link to={`/student/careers/path/${career._id}`} style={{ textDecoration: 'none' }}>
                <SBtn variant="ghost" size="sm">Explore Roadmap <FiChevronRight size={14} /></SBtn>
             </Link>
           </div>
           <p style={{ margin: 0, fontSize: 14.5, color: 'var(--s-text3)', lineHeight: 1.7, maxWidth: 900 }}>{shortDesc}</p>
         </div>
       )}
    </div>
  )
}

export default function ClassLandingPage({ classKey }) {
  const config = CLASS_CONFIG[classKey]
  const [careers, setCareers] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!config) return
    setLoading(true)
    Promise.all([
      careerService.getByLevel(config.level),
      courseService.getAll({ level: config.level })
    ]).then(([cRes, coRes]) => {
      setCareers(extractCareerResponse(cRes))
      setCourses(Array.isArray(coRes) ? coRes : (coRes.data || []))
    }).catch(err => {
      console.error('Error fetching class data:', err)
      setCareers([])
      setCourses([])
    }).finally(() => setLoading(false))
  }, [config])

  const filteredCareers = useMemo(() => {
    const q = search.trim().toLowerCase()
    return careers.filter(c => !q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
  }, [careers, search])

  if (!config) return <div className="student-root" style={{ padding: 60 }}><SEmpty title="Page not found" /></div>
  const accent = config.accentColor

  return (
    <div className="student-root" style={{ background: config.isKidFriendly ? '#fdf8ff' : '#fcfcfd', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Hero */}
      <section style={{ padding: '60px 24px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
         <div style={{ maxWidth: 840, margin: '0 auto' }}>
            <Link to="/student" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24, textDecoration: 'none', color: 'var(--s-text3)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
               <FiArrowLeft size={14} /> Back to Dashboard
            </Link>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: config.accentBg, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 10px 24px rgba(0,0,0,0.05)' }}>
               <config.icon size={28} />
            </div>
            <h1 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 48px)', color: 'var(--s-text)', margin: '0 0 16px', letterSpacing: '-0.03em' }}>
               {config.heading}
            </h1>
            <p style={{ fontSize: 18, color: 'var(--s-text3)', lineHeight: 1.75, margin: 0 }}>{config.description}</p>
         </div>
      </section>

      {/* Explorer */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
         <div style={{ display: 'flex', gap: 12, marginBottom: 40, justifyContent: 'center' }}>
            <SInput 
               placeholder="Search topics or interests..." 
               value={search} onChange={e => setSearch(e.target.value)} 
               icon={<FiSearch />}
               style={{ maxWidth: 500, borderRadius: 16, background: '#fff' }}
            />
         </div>

         {loading ? <SLoader /> : filteredCareers.length === 0 ? (
            <SEmpty 
              icon={<FiBookOpen size={48} />}
              title="Content is Arriving Soon" 
              desc="Our mentors are crafting the perfect rich-media experience for this level. Stay tuned!" 
            />
         ) : (
            <div>
               {filteredCareers.map(career => (
                  <CareerListSection key={career._id} career={career} accent={accent} isKidFriendly={config.isKidFriendly} />
               ))}
               
               {config.isKidFriendly && (
                 <div style={{ marginTop: 60, padding: '60px 40px', background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)', borderRadius: 32, color: '#fff', textAlign: 'center', boxShadow: '0 20px 40px rgba(109, 40, 217, 0.2)', animation: 'fadeUp 0.6s ease both' }}>
                    <div style={{ display: 'grid', placeItems: 'center', marginBottom: 24 }}>
                       <div style={{ width: 60, height: 60, borderRadius: 99, background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center' }}>
                          <FiStar size={32} fill="#fff" />
                       </div>
                    </div>
                    <h2 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 900, fontSize: 32, marginBottom: 16 }}>✨ Your Journey is Special!</h2>
                    <p style={{ fontSize: 20, fontWeight: 500, opacity: 0.95, marginBottom: 32, maxWidth: 640, margin: '0 auto 32px', lineHeight: 1.6 }}>
                      "You don’t need to choose your career now. Just explore, learn new things, and enjoy your journey!"
                    </p>
                    <Link to="/student/signup" style={{ textDecoration: 'none' }}>
                       <SBtn variant="white" size="lg">Join The Adventure Free</SBtn>
                    </Link>
                 </div>
               )}
            </div>
         )}
      </section>
    </div>
  )
}
