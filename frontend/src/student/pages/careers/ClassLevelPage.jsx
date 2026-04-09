import React, { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  FiArrowLeft, FiHeart, FiFlag, FiTarget, FiStar,
  FiAward, FiActivity, FiVideo, FiBriefcase, FiInfo,
  FiBookmark, FiCompass, FiSearch, FiLayers, FiDollarSign,
  FiFileText, FiLink, FiHelpCircle, FiBookOpen
} from 'react-icons/fi'
import { classContentService } from '../../../services/classContentService'
import { userActionService } from '../../../services/userActionService'
import { useStudentAuth } from '../../context/StudentAuthContext'
import { SBtn, SLoader, SEmpty, SBadge, SAlert } from '../../components/ui'
import AuthModal from '../../components/ui/AuthModal'
import { courseService } from '../../../services/courseService'
import { collegeService } from '../../services/index'
import { FiChevronDown, FiChevronUp, FiMapPin } from 'react-icons/fi'
const CLASS_SECTIONS = {
  default: [
    { id: 'Basics', label: 'Basics', icon: FiFlag, color: '#6366f1' },
    { id: 'Exams', label: 'Exams', icon: FiAward, color: '#f59e0b' },
    { id: 'Scholarships', label: 'Scholarships', icon: FiDollarSign, color: '#10b981' },
    { id: 'Fun', label: 'Fun', icon: FiActivity, color: '#ec4899' },
    { id: 'Skills', label: 'Skills', icon: FiTarget, color: '#10b981' },
    { id: 'Games', label: 'Games', icon: FiStar, color: '#8b5cf6' },
    { id: 'Careers', label: 'Careers', icon: FiBriefcase, color: '#3b82f6' },
    { id: 'Colleges', label: 'Colleges', icon: FiMapPin, color: '#f59e0b' },
    { id: 'Videos', label: 'Videos', icon: FiVideo, color: '#ef4444' },
    { id: 'Habits', label: 'Habits', icon: FiHeart, color: '#f43f5e' },
  ],
  "8": [
    { id: 'Basics', label: 'Basics', icon: FiFlag, color: '#6366f1' },
    { id: 'Entrance Exams', label: 'Exams', icon: FiFileText, color: '#8b5cf6' },
    { id: 'Scholarships', label: 'Scholarships', icon: FiDollarSign, color: '#10b981' },
    { id: 'Fun', label: 'Fun', icon: FiActivity, color: '#ec4899' },
    { id: 'Skills', label: 'Skills', icon: FiTarget, color: '#ec4899' },
    { id: 'Careers', label: 'Careers', icon: FiBriefcase, color: '#3b82f6' },
    { id: 'Habits', label: 'Habits', icon: FiHeart, color: '#f43f5e' },
  ],
  "10": [
    { id: 'Basics', label: 'Basics', icon: FiFlag, color: '#6366f1' },
    { id: 'Streams', label: 'Streams', icon: FiLayers, color: '#f59e0b' },
    { id: 'Careers', label: 'Careers', icon: FiBriefcase, color: '#3b82f6' },
    { id: 'Colleges', label: 'Colleges', icon: FiMapPin, color: '#f59e0b' },
    { id: 'Scholarships', label: 'Scholarships', icon: FiDollarSign, color: '#10b981' },
    { id: 'Entrance Exams', label: 'Entrance Exams', icon: FiFileText, color: '#8b5cf6' },
    { id: 'Skills', label: 'Skills', icon: FiTarget, color: '#ec4899' },
    { id: 'Habits', label: 'Habits', icon: FiHeart, color: '#f43f5e' },
    { id: 'Resources', label: 'Resources', icon: FiLink, color: '#64748b' },
    { id: 'FAQs', label: 'FAQs', icon: FiHelpCircle, color: '#334155' },
  ],
  "12": [
    { id: 'Basics', label: 'Basics', icon: FiFlag, color: '#6366f1' },
    { id: 'Careers', label: 'Careers', icon: FiBriefcase, color: '#3b82f6' },
    { id: 'Colleges', label: 'Colleges', icon: FiMapPin, color: '#f59e0b' },
    { id: 'Scholarships', label: 'Scholarships', icon: FiDollarSign, color: '#10b981' },
    { id: 'Entrance Exams', label: 'Entrance Exams', icon: FiFileText, color: '#8b5cf6' },
    { id: 'Skills', label: 'Skills', icon: FiTarget, color: '#ec4899' },
    { id: 'Habits', label: 'Habits', icon: FiHeart, color: '#f43f5e' },
    { id: 'FAQs', label: 'FAQs', icon: FiHelpCircle, color: '#334155' },
  ]
}

const STREAM_TABS = ["Science", "Commerce", "Arts", "Diploma"];
const SCHOLARSHIP_TABS = ["Government", "State Schemes", "Merit", "NSP", "Process", "Tips"];
const COLLEGE_TABS = ['Engineering', 'Medical', 'Arts & Science', 'Law', 'Polytechnic', 'Agriculture', 'Others'];
const EXAM_TABS = {
  "8": ["Scholarship Exam", "Olympiad", "Innovation"],
  "10": ["Science", "Diploma", "Scholarship", "Skill Exams", "Job Path"],
  "12": ["Engineering", "Medical", "Law", "Design", "Management", "Science", "Defence", "Commerce", "Architecture", "Arts & Commerce"],
  "default": ["Scholarship Exam", "Skill Exams", "Government Job", "Defence Career", "Future Goals"]
};

export default function ClassLevelPage(props) {
  const params = useParams()
  const navigate = useNavigate()
  const level = props.level || params.level || ""
  const cleanLevel = level.toString().replace('class', '')
  const sections = CLASS_SECTIONS[cleanLevel] || CLASS_SECTIONS.default;

  const [contents, setContents] = useState([])
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSec, setActiveSec] = useState('Basics')
  const [activeSubTab, setActiveSubTab] = useState('All') // For sub-filtering like Streams in Class 10
  const [authData, setAuthData] = useState({ isOpen: false, message: '', pendingAction: null })
  const { isAuthenticated } = useStudentAuth()
  const [savedIds, setSavedIds] = useState(new Set())
  const [alert, setAlert] = useState({ type: '', text: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState([])
  const [expandedCourseCat, setExpandedCourseCat] = useState(null)
  
  // Colleges state
  const [colleges, setColleges] = useState([])
  const [collegesLoading, setCollegesLoading] = useState(false)

  useEffect(() => {
    fetchContent()
    if (isAuthenticated) fetchSavedItems()
  }, [cleanLevel, isAuthenticated])

  // Reset navigation when level changes
  useEffect(() => {
    setActiveSec('Basics');
    setActiveSubTab('All');
  }, [cleanLevel]);

  // Specific effect for fetching colleges dynamically based on search/sub-filters
  useEffect(() => {
    if (activeSec !== 'Colleges') return;
    const fetchColleges = async () => {
      setCollegesLoading(true)
      try {
        const params = {}
        if (activeSubTab !== 'All') params.stream = activeSubTab
        if (searchQuery.trim() !== '') params.search = searchQuery.trim()
        const res = await collegeService.getAll(params)
        setColleges(res.data || [])
      } catch (err) {
        console.error('Error fetching colleges', err)
      } finally {
        setCollegesLoading(false)
      }
    }
    
    // Add small delay to debounce search typing
    const t = setTimeout(fetchColleges, 350)
    return () => clearTimeout(t)
  }, [activeSec, activeSubTab, searchQuery])

  const fetchContent = async () => {
    try {
      setLoading(true)

      // Map class level number to DB targetLevel field value
      const targetLevelMap = { '10': 'After 10th', '12': 'After 12th' }
      const targetLevel = targetLevelMap[cleanLevel]

      const [contentRes, scholarshipRes, coursesRes] = await Promise.all([
        classContentService.getPublicList({ targetClass: cleanLevel }),
        fetch("http://localhost:5000/api/scholarships").then(r => r.json()),
        targetLevel
          ? courseService.getAllCourses({ targetLevel })
          : Promise.resolve({ success: true, data: [] })
      ])

      if (contentRes.success) setContents(contentRes.data)
      if (coursesRes.success) {
         setCourses(coursesRes.data)
      } else if (Array.isArray(coursesRes)) {
         setCourses(coursesRes)
      } else if (coursesRes.data && Array.isArray(coursesRes.data)) {
         setCourses(coursesRes.data)
      }
      
      // Filter direct scholarships by targetClass
      const rawScholarships = Array.isArray(scholarshipRes) ? scholarshipRes : (scholarshipRes.data || [])
      const filteredScholarships = rawScholarships.filter(s => 
        (s.targetClass || []).includes(cleanLevel) || (s.targetClass || []).includes(level)
      ).map(s => ({
        ...s,
        title: s.scholarshipName,
        shortDescription: s.eligibility || s.description || "Active scholarship for students.",
        sectionType: 'Scholarships',
        category: s.category || 'Direct',
        subCategoryLabel: s.provider,
        slug: `direct-${s._id}`, // Special slug for direct items
        isDirect: true // Flag to distinguish
      }))
      setScholarships(filteredScholarships)

    } catch (err) {
      setAlert({ type: 'error', text: 'Failed to load content.' })
    } finally {
      setLoading(false)
    }
  }


  const fetchSavedItems = async () => {
    try {
      const res = await userActionService.getSavedList('ClassContent')
      if (res.success) {
        setSavedIds(new Set(res.data.map(item => item.contentId._id || item.contentId)))
      }
    } catch (err) { console.error('Saved list error', err) }
  }

  const handleSaveAction = async (item) => {
    if (!isAuthenticated) {
      setAuthData({ 
        isOpen: true, 
        message: 'Please sign in to save this to your profile.',
        pendingAction: () => handleSaveAction(item) 
      })
      return
    }

    try {
      if (savedIds.has(item._id)) {
        await userActionService.unsaveItem(item._id)
        const newSet = new Set(savedIds)
        newSet.delete(item._id)
        setSavedIds(newSet)
        setAlert({ type: 'info', text: 'Removed from your library' })
      } else {
        await userActionService.saveItem(item._id, 'ClassContent')
        setSavedIds(new Set([...savedIds, item._id]))
        setAlert({ type: 'success', text: 'Saved to success path! ✨' })
      }
      setTimeout(() => setAlert({ type: '', text: '' }), 3000)
    } catch (err) {
      setAlert({ type: 'error', text: 'Action failed.' })
    }
  }

  const filteredContent = useMemo(() => {
    // Combine curated contents with normalized direct scholarships
    const allItems = [...contents, ...scholarships]

    return allItems.filter(c => {
      const matchesSection = c.sectionType === activeSec
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Sub-tab filtering (multi-section support)
      let matchesSubTab = true;
      if (activeSubTab !== 'All') {
        if (activeSec === 'Streams') {
           matchesSubTab = c.category === activeSubTab || c.subCategoryLabel === activeSubTab;
        } else if (activeSec === 'Scholarships') {
           matchesSubTab = c.category === activeSubTab || c.subCategoryLabel === activeSubTab || c.isDirect;
        } else if (activeSec === 'Entrance Exams') {
           matchesSubTab = c.category === activeSubTab || c.subCategoryLabel === activeSubTab;
        }
      }

      return matchesSection && matchesSearch && matchesSubTab
    })
  }, [contents, scholarships, activeSec, searchQuery, activeSubTab])

  const groupedCourses = useMemo(() => {
     if (activeSec !== 'Careers') return {}
     // Filter courses visually by search query
     const filtered = courses.filter(c => c.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) || c.category?.toLowerCase().includes(searchQuery.toLowerCase()))
     
     // Group by category (e.g. BA, BSc, Engineering, Medicine)
     const groups = {}
     filtered.forEach(c => {
        const cat = c.category || 'General Careers'
        if (!groups[cat]) groups[cat] = []
        groups[cat].push(c)
     })
     return groups
  }, [courses, activeSec, searchQuery])

  const handleCardClick = (item) => {
    if (item.isDirect) {
      if (item.applicationLink) window.open(item.applicationLink, '_blank');
      else alert("No direct application link provided for this item.");
    } else {
      navigate(`/class${cleanLevel}/content/${item.slug}`);
    }
  }

  return (
    <div className="student-root" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: 100 }}>
      {/* Hero */}
      <section style={{ 
        padding: '100px 24px', textAlign: 'center', 
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
        color: '#fff', borderRadius: '0 0 80px 80px', marginBottom: 60,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 900, fontSize: 'clamp(36px, 6vw, 56px)', margin: '0 0 24px', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            Class {cleanLevel}th <span style={{ color: '#38bdf8' }}>Guidance Path</span>
          </h1>
          <p style={{ fontSize: 20, maxWidth: 650, margin: '0 auto 40px', opacity: 0.9, lineHeight: 1.6 }}>
            Comprehensive resources, exams, and habits tailored specifically for your academic stage.
          </p>
          
          <div style={{ maxWidth: 600, margin: '0 auto', position:'relative' }}>
             <FiSearch style={{ position:'absolute', left:20, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }} size={20} />
             <input 
                type="text" 
                placeholder="Search for guides, exams, or skills..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ 
                   width:'100%', padding:'18px 24px 18px 56px', borderRadius:20, 
                   background:'rgba(255,255,255,0.1)', backdropFilter:'blur(10px)', color:'#fff',
                   fontSize:16, border:'1px solid rgba(255,255,255,0.1)'
                }}
             />
          </div>
        </div>
      </section>

      {/* Main Container */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        
        {/* Section Tabs */}
        <div style={{ 
          display: 'flex', gap: 10, overflowX: 'auto', padding: '10px', 
          backgroundColor:'#fff', borderRadius:24, boxShadow:'0 10px 15px -3px rgba(0,0,0,0.05)',
          marginBottom: activeSec === 'Streams' ? 20 : 50, border:'1px solid #f1f5f9', position:'sticky', top:20, zIndex:10
        }}>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => { setActiveSec(s.id); setActiveSubTab('All'); }}
              style={{
                flexShrink: 0, padding: '12px 28px', borderRadius: 16, border: 'none',
                background: activeSec === s.id ? s.color : 'transparent',
                color: activeSec === s.id ? '#fff' : '#64748b',
                display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize:14,
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: activeSec === s.id ? `0 10px 15px -3px ${s.color}66` : 'none'
              }}
            >
              <s.icon size={18} /> {s.label}
            </button>
          ))}
        </div>

        {/* Sub-Tabs for Targeted Sections */}
        {['Streams', 'Scholarships', 'Entrance Exams', 'Colleges'].includes(activeSec) && (
          <div style={{ 
            display: 'flex', gap: 10, overflowX: 'auto', padding: '10px 10px 30px', 
            marginBottom: 30, justifyContent:'center', flexWrap:'wrap'
          }}>
            {['All', ...(
               activeSec === 'Streams' ? STREAM_TABS : 
               activeSec === 'Scholarships' ? SCHOLARSHIP_TABS : 
               activeSec === 'Colleges' ? COLLEGE_TABS :
               (EXAM_TABS[cleanLevel] || EXAM_TABS.default)
            )].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                style={{
                  padding: '8px 24px', borderRadius: 99, border: activeSubTab === tab ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  background: activeSubTab === tab ? '#eff6ff' : '#fff',
                  color: activeSubTab === tab ? '#3b82f6' : '#64748b',
                  fontWeight: 700, fontSize:13, cursor: 'pointer', transition: 'all 0.2s', whiteSpace:'nowrap'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ padding: '100px 0' }}><SLoader /></div>
        ) : (
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:30 }}>
               <h2 style={{ fontSize:28, fontWeight:900 }}>{activeSec} {activeSec !== 'Colleges' ? 'Content' : 'Directory'}</h2>
               <span style={{ color:'#94a3b8', fontSize:14, fontWeight:600 }}>
                 {activeSec === 'Colleges' ? colleges.length : activeSec === 'Careers' ? courses.length : filteredContent.length} items found
               </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: activeSec === 'Careers' ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))', gap: 32 }}>
              {activeSec === 'Careers' ? (
                 Object.keys(groupedCourses).length === 0 ? (
                   <div style={{ gridColumn: '1/-1', textAlign:'center', padding:'100px 0', background:'#fff', borderRadius:32, border:'1px dashed #cbd5e1' }}>
                     <SEmpty title="No careers found" desc="We couldn't find matching courses." />
                   </div>
                 ) : (
                   Object.keys(groupedCourses).sort().map(cat => (
                      <div key={cat} style={{ background:'#fff', borderRadius:24, border:'1px solid #f1f5f9', overflow:'hidden', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.02)' }}>
                         <div 
                           onClick={() => setExpandedCourseCat(expandedCourseCat === cat ? null : cat)}
                           style={{ padding:24, display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', background: expandedCourseCat === cat ? '#f8fafc' : '#fff' }}
                         >
                            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                               <div style={{ width:50, height:50, borderRadius:12, background:'var(--s-primary-l)', color:'var(--s-primary)', display:'grid', placeItems:'center', fontWeight:900, fontSize:18 }}>
                                  {cat.substring(0, 2).toUpperCase()}
                               </div>
                               <div>
                                  <h3 style={{ margin:0, fontSize:22, fontWeight:900 }}>{cat}</h3>
                                  <span style={{ fontSize:14, color:'#64748b', fontWeight:600 }}>{groupedCourses[cat].length} specialized courses</span>
                               </div>
                            </div>
                            <div style={{ background:'#e2e8f0', width:36, height:36, borderRadius:'50%', display:'grid', placeItems:'center' }}>
                               {expandedCourseCat === cat ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                            </div>
                         </div>
                         
                         {expandedCourseCat === cat && (
                            <div style={{ padding: '0 24px 24px', borderTop:'1px solid #f1f5f9', display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20, marginTop: 24 }}>
                               {groupedCourses[cat].map(c => (
                                 <div key={c._id} style={{ border:'1px solid #e2e8f0', borderRadius:16, padding:20, display:'flex', flexDirection:'column', background:'#fafafa' }}>
                                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                                       <SBadge color="gray">{c.duration || 'Duration varies'}</SBadge>
                                       {c.featured && <SBadge color="gold">TOP RATED</SBadge>}
                                    </div>
                                    <h4 style={{ margin:'0 0 8px', fontSize:18, fontWeight:800 }}>{c.courseName}</h4>
                                    <p style={{ margin:'0 0 20px', fontSize:14, color:'#64748b', lineHeight:1.5 }}>{c.shortDescription}</p>
                                    <SBtn variant="primary" style={{ marginTop:'auto', alignSelf:'flex-start', borderRadius:8 }} onClick={() => navigate(`/student/course/${c._id}`)}>
                                       View Course & Cutoffs
                                    </SBtn>
                                 </div>
                               ))}
                            </div>
                         )}
                      </div>
                   ))
                 )
              ) : activeSec === 'Colleges' ? (
                 collegesLoading ? (
                   <div style={{ gridColumn: '1/-1', padding: '100px 0' }}><SLoader /></div>
                 ) : colleges.length === 0 ? (
                   <div style={{ gridColumn: '1/-1', textAlign:'center', padding:'100px 0', background:'#fff', borderRadius:32, border:'1px dashed #cbd5e1' }}>
                     <SEmpty title="No colleges found" desc="Try adjusting your filters or search terms." />
                   </div>
                 ) : (
                   colleges.map(clg => {
                      const STREAM_STYLE = {
                        Engineering: { color: '#1d5fba', bg: '#eaf0fb' },
                        Medical: { color: '#16a34a', bg: '#f0fdf4' },
                        'Arts & Science': { color: '#7c3aed', bg: '#f3effe' },
                        Law: { color: '#c48a1a', bg: '#fdf4e0' },
                        Polytechnic: { color: '#e05e24', bg: '#fdeee6' },
                        Agriculture: { color: '#15803d', bg: '#dcfce7' },
                        Others: { color: '#64748b', bg: '#f1f5f9' },
                      }
                      const sc = STREAM_STYLE[clg.stream] || { color: 'var(--s-primary)', bg: 'var(--s-primary-l)' }
                      const badgeColor = clg.stream === 'Engineering' ? 'blue' : clg.stream === 'Medical' ? 'green' : clg.stream === 'Arts & Science' ? 'purple' : clg.stream === 'Law' ? 'gold' : 'gray'
                      
                      return (
                         <div key={clg._id} className="hover-lift" style={{ background:'#fff', borderRadius:24, border:`1px solid #f1f5f9`, borderTop:`4px solid ${sc.color}`, padding:24, boxShadow:'0 10px 15px -3px rgba(0,0,0,0.02)', display:'flex', flexDirection:'column' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: sc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🏫</div>
                                <div>
                                  <h3 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 16, color: 'var(--s-text)', margin: '0 0 4px', lineHeight: 1.3 }}>{clg.collegeName}</h3>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--s-text3)' }}>
                                    <FiMapPin size={12} /> {clg.district || clg.location || 'Tamil Nadu'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                              <SBadge color={badgeColor}>{clg.stream}</SBadge>
                              {clg.accreditation && <SBadge color="gray">{clg.accreditation}</SBadge>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20, marginTop: 'auto' }}>
                              {[
                                { l: 'Fees/yr', v: clg.feesPerYear ? (clg.feesPerYear >= 100000 ? `${(clg.feesPerYear / 100000).toFixed(1)}L` : `${(clg.feesPerYear / 1000).toFixed(0)}K`) : '—', c: '#16a34a' },
                                { l: 'Placement', v: clg.placementPercentage ? `${clg.placementPercentage}%` : '—', c: '#1d5fba' },
                                { l: 'Rank', v: clg.rank || '—', c: 'var(--s-primary)' },
                              ].map((s, i) => (
                                <div key={i} style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 8px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                                  <div style={{ fontFamily: 'var(--s-font-display)', fontWeight: 900, fontSize: 15, color: s.c }}>{s.v}</div>
                                  <div style={{ fontSize: 11, color: 'var(--s-text3)', marginTop: 4, fontWeight: 600 }}>{s.l}</div>
                                </div>
                              ))}
                            </div>
                            
                            {clg.coursesOffered?.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                                {clg.coursesOffered.slice(0, 2).map((c, i) => (
                                  <span key={i} style={{ fontSize: 12, background: '#f8fafc', color: 'var(--s-text2)', padding: '4px 10px', borderRadius: 8, fontWeight: 600, border: '1px solid #e2e8f0' }}>{c}</span>
                                ))}
                                {clg.coursesOffered.length > 2 && (
                                  <span style={{ fontSize: 12, color: 'var(--s-text3)', padding: '4px' }}>+{clg.coursesOffered.length - 2} more</span>
                                )}
                              </div>
                            )}
                         </div>
                      );
                   })
                 )
              ) : filteredContent.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign:'center', padding:'100px 0', background:'#fff', borderRadius:32, border:'1px dashed #cbd5e1' }}>
                  <SEmpty title="Nothing found yet" desc={`We haven't added items to ${activeSec} for Class ${cleanLevel} yet.`} />
                </div>
              ) : (
                filteredContent.map(item => (
                  <div key={item._id} style={{ 
                    background:'#fff', borderRadius:32, border:'1px solid #f1f5f9', 
                    overflow:'hidden', display:'flex', flexDirection:'column', 
                    boxShadow:'0 10px 15px -3px rgba(0,0,0,0.02)', transition:'0.3s' 
                  }} className="hover-lift">
                    <div style={{ width: '100%', height: 230, position:'relative' }}>
                      <img src={item.coverImage || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        onClick={() => handleSaveAction(item)} 
                        style={{ 
                          position:'absolute', top:20, right:20, width:48, height:48, 
                          borderRadius:99, background:'#fff', border:'none', cursor:'pointer', 
                          display:'grid', placeItems:'center', color: savedIds.has(item._id) ? '#ef4444' : '#64748b',
                          boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)'
                        }}
                      >
                        {savedIds.has(item._id) ? <FiHeart size={22} fill="#ef4444" /> : <FiBookmark size={22} />}
                      </button>
                    </div>
                    <div style={{ padding: 32, flex:1, display:'flex', flexDirection:'column' }}>
                       <div style={{ display:'flex', gap:8, marginBottom:16 }}>
                          {item.featured && <SBadge color="gold">FEATURED</SBadge>}
                          {item.isDirect && <SBadge color="red">DIRECT</SBadge>}
                          <SBadge color="blue">{item.category}</SBadge>
                          {item.subCategoryLabel && <SBadge color="gray">{String(item.subCategoryLabel).toUpperCase()}</SBadge>}
                       </div>
                       <h3 style={{ fontSize:22, fontWeight:900, margin:'0 0 12px', lineHeight:1.3 }}>{item.title}</h3>
                       <p style={{ color:'#64748b', marginBottom:24, lineHeight:1.6 }}>{item.shortDescription}</p>
                       <SBtn 
                          variant={item.isDirect ? "outline" : "primary"}
                          style={{ width:'100%', marginTop:'auto', borderRadius:16, padding:'14px 0' }} 
                          onClick={() => handleCardClick(item)}
                       >
                          {item.isDirect ? 'Apply Now ↗' : 'Explore Detailed Guide'}
                       </SBtn>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </section>

      <AuthModal isOpen={authData.isOpen} onClose={() => setAuthData({...authData, isOpen:false})} message={authData.message} onLoginSuccess={() => fetchSavedItems()} />
      {alert.text && <div style={{ position:'fixed', bottom:40, right:40, zIndex:1000 }}><SAlert type={alert.type}>{alert.text}</SAlert></div>}
    </div>
  )
}
