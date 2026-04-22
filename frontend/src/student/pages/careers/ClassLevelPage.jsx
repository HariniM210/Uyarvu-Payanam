import React, { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  FiArrowLeft, FiHeart, FiFlag, FiTarget, FiStar,
  FiAward, FiActivity, FiVideo, FiBriefcase, FiInfo,
  FiBookmark, FiCompass, FiSearch, FiLayers, FiDollarSign,
  FiFileText, FiLink, FiHelpCircle, FiBookOpen, FiChevronDown, FiChevronUp, FiMapPin
} from 'react-icons/fi'
import { classContentService } from '../../../services/classContentService'
import { userActionService } from '../../../services/userActionService'
import { useStudentAuth } from '../../context/StudentAuthContext'
import { SBtn, SLoader, SEmpty, SBadge, SAlert } from '../../components/ui'
import { scholarshipService } from '../../services'
import AuthModal from '../../components/ui/AuthModal'
import { courseService } from '../../../services/courseService'
import { collegeService } from '../../services/index'
import axiosInstance from '../../../config/axios'

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
  "5": [
    { id: 'Basics', label: 'Basics', icon: FiFlag, color: '#6366f1' },
    { id: 'Exams', label: 'Exams', icon: FiAward, color: '#f59e0b' },
    { id: 'Scholarships', label: 'Scholarships', icon: FiDollarSign, color: '#10b981' },
    { id: 'Fun', label: 'Fun', icon: FiActivity, color: '#ec4899' },
    { id: 'Skills', label: 'Skills', icon: FiTarget, color: '#10b981' },
    { id: 'Games', label: 'Games', icon: FiStar, color: '#8b5cf6' },
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
    { id: 'College Mapping', label: 'College Map', icon: FiLink, color: '#f97316' },
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
    { id: 'College Mapping', label: 'College Map', icon: FiLink, color: '#f97316' },
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
  const [activeSubTab, setActiveSubTab] = useState('All') 
  const [authData, setAuthData] = useState({ isOpen: false, message: '', pendingAction: null })
  const { isAuthenticated } = useStudentAuth()
  const [savedIds, setSavedIds] = useState(new Set())
  const [alert, setAlert] = useState({ type: '', text: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState([])
  const [colleges, setColleges] = useState([]) 
  const [explorerData, setExplorerData] = useState([])
  const [explorerLoading, setExplorerLoading] = useState(false)
  const [expandedCourseCat, setExpandedCourseCat] = useState(null)
  const [mappingData, setMappingData] = useState([])
  const [mappingLoading, setMappingLoading] = useState(false)
  
  useEffect(() => {
    fetchContent()
    if (isAuthenticated) fetchSavedItems()
  }, [cleanLevel, isAuthenticated])

  useEffect(() => {
    setActiveSec('Basics');
    setActiveSubTab('All');
  }, [cleanLevel]);

  useEffect(() => {
    if (!['Careers', 'Colleges'].includes(activeSec)) return;
    
    const fetchExplorerData = async () => {
      setExplorerLoading(true)
      try {
        const query = { 
          search: searchQuery.trim(),
          level: cleanLevel
        }
        if (activeSubTab !== 'All') query.category = activeSubTab
        
        const res = await courseService.getExplorerData(query)
        if (res.success) {
           setExplorerData(res.data)
           if (activeSec === 'Colleges') setColleges(res.data)
           if (activeSec === 'Careers') setCourses(res.data)
        }
      } catch (err) {
        console.error('Error fetching explorer data', err)
      } finally {
        setExplorerLoading(false)
      }
    }
    
    const t = setTimeout(fetchExplorerData, 350)
    return () => clearTimeout(t)
  }, [activeSec, activeSubTab, searchQuery, cleanLevel])

  useEffect(() => {
    if (activeSec !== 'College Mapping') return;
    
    const fetchMapping = async () => {
      setMappingLoading(true)
      try {
        const levelFilter = cleanLevel === '10' ? 'diploma' : (cleanLevel === '12' ? 'after12th' : '')
        const res = await axiosInstance.get('/college-courses')
        if (res.data.success) {
          let data = res.data.data
          if (levelFilter) {
             data = data.map(college => ({
               ...college,
               coursesOffered: college.coursesOffered.filter(c => 
                 c.level === levelFilter || (cleanLevel === '12' && c.level === 'diploma')
               )
             })).filter(college => college.coursesOffered.length > 0)
          }
          setMappingData(data)
        }
      } catch (err) {
        console.error('Mapping fetch error', err)
      } finally {
        setMappingLoading(false)
      }
    }
    fetchMapping()
  }, [activeSec, cleanLevel])

  const fetchContent = async () => {
    try {
      setLoading(true)

      const [contentRes, scholarshipRes, careerRes] = await Promise.all([
        classContentService.getPublicList({ targetClass: cleanLevel }).catch(() => null),
        axiosInstance.get(`/scholarships`, { 
          params: { grade: `${cleanLevel}th`, userSide: true } 
        }).catch(() => null),
        careerService.getAll({ level: cleanLevel }).catch(() => null)
      ])

      const contentList = contentRes?.data || (Array.isArray(contentRes) ? contentRes : [])
      const scholarshipList = scholarshipRes?.data?.data || (Array.isArray(scholarshipRes?.data) ? scholarshipRes.data : [])
      const careerList = careerRes?.data || (Array.isArray(careerRes) ? careerRes : [])

      // Merge curated content and career paths
      const allFetchedContent = [
        ...contentList,
        ...(careerList || []).map(c => ({
          ...c,
          sectionType: 'Careers',
          title: c.title || c.careerName,
          category: c.category || 'Featured Path',
          slug: c.slug || c._id
        }))
      ]
      
      setContents(allFetchedContent)
      
      if (scholarshipRes && scholarshipRes.success !== false) {
        const mappedScholarships = scholarshipList.map(s => ({
          ...s,
          title: s.scholarshipName,
          coverImage: s.image,
          shortDescription: s.benefit || s.eligibility || s.description || "Active scholarship for students.",
          sectionType: 'Scholarships',
          category: s.category || 'Direct',
          subCategoryLabel: s.provider,
          slug: `direct-${s._id}`,
          isDirect: true
        }))
        setScholarships(mappedScholarships)
      }

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
        setAlert({ type: 'success', text: 'Saved to success path! âœ¨' })
      }
      setTimeout(() => setAlert({ type: '', text: '' }), 3000)
    } catch (err) {
      setAlert({ type: 'error', text: 'Action failed.' })
    }
  }

  const filteredContent = useMemo(() => {
    const allItems = [...(contents || []), ...(scholarships || [])]

    return allItems.filter(c => {
      const matchesSection = c.sectionType === activeSec
      const titleStr = c.title || ''
      const descStr = c.shortDescription || ''
      const matchesSearch = titleStr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            descStr.toLowerCase().includes(searchQuery.toLowerCase())
      
      let matchesSubTab = true;
      if (activeSubTab !== 'All') {
        if (activeSec === 'Streams' || activeSec === 'Scholarships' || activeSec === 'Entrance Exams') {
           matchesSubTab = c.category === activeSubTab || c.subCategoryLabel === activeSubTab;
        }
      }

      return matchesSection && matchesSearch && matchesSubTab
    })
  }, [contents, scholarships, activeSec, searchQuery, activeSubTab])

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
          <div style={{ display: 'inline-block', padding: '8px 16px', borderRadius: 99, background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20, border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            Empowering Your Future
          </div>
          <h1 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 900, fontSize: 'clamp(40px, 7vw, 64px)', margin: '0 0 24px', letterSpacing: '-0.05em', lineHeight: 1 }}>
            Class {cleanLevel}th <span style={{ background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Success Compass</span>
          </h1>
          <p style={{ fontSize: 20, maxWidth: 650, margin: '0 auto 48px', opacity: 0.8, lineHeight: 1.6, fontWeight: 500 }}>
            Navigate your options with confidence. We've curated the best {cleanLevel === '12' ? 'universities' : 'vocational paths'} and courses for you.
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
          display: 'flex', gap: 6, overflowX: 'auto', padding: '8px', 
          backgroundColor:'rgba(255,255,255,0.7)', backdropFilter:'blur(20px)', borderRadius:24, boxShadow:'0 20px 25px -5px rgba(0,0,0,0.05)',
          marginBottom: activeSec === 'Streams' ? 20 : 50, border:'1px solid rgba(255,255,255,0.5)', position:'sticky', top:20, zIndex:100
        }}>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => { setActiveSec(s.id); setActiveSubTab('All'); }}
              style={{
                flexShrink: 0, padding: '14px 24px', borderRadius: 18, border: 'none',
                background: activeSec === s.id ? s.color : 'transparent',
                color: activeSec === s.id ? '#fff' : '#475569',
                display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize:14,
                cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeSec === s.id ? `0 10px 15px -3px ${s.color}44` : 'none',
                transform: activeSec === s.id ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <s.icon size={18} style={{ opacity: activeSec === s.id ? 1 : 0.7 }} /> {s.label}
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
               <h2 style={{ fontSize:28, fontWeight:900 }}>{activeSec} Insight</h2>
               <span style={{ color:'#94a3b8', fontSize:14, fontWeight:600 }}>
                 {(activeSec === 'Colleges' || activeSec === 'Careers') ? (filteredContent.length + explorerData.length) : filteredContent.length} items found
               </span>
            </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
                {activeSec === 'Careers' && filteredContent.length > 0 && (
                   <div style={{ marginBottom: 40 }}>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(360px, 1fr))', gap:32 }}>
                         {filteredContent.map(item => (
                            <div key={item._id} style={{ background:'#fff', padding:32, borderRadius:32, border:'1px solid #f1f5f9' }}>
                               <SBadge color="blue">{item.category}</SBadge>
                               <h3 style={{ fontSize:22, fontWeight:900, marginTop:16 }}>{item.title}</h3>
                               <p style={{ color:'#64748b', margin:'12px 0 20px' }}>{item.shortDescription}</p>
                               <SBtn variant="outline" onClick={() => navigate(`/class${cleanLevel}/content/${item.slug || item._id}`)}>View Guidance</SBtn>
                            </div>
                         ))}
                      </div>
                   </div>
                )}
               {activeSec === 'Careers' || activeSec === 'Colleges' ? (
                  explorerLoading ? (
                    <div style={{ gridColumn: '1/-1', padding: '100px 0' }}><SLoader /></div>
                  ) : explorerData.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign:'center', padding:'100px 0', background:'#fff', borderRadius:32, border:'1px dashed #cbd5e1' }}>
                      <SEmpty icon={activeSec === 'Careers' ? <FiBriefcase size={48} /> : <FiMapPin size={48} />} title={`No ${activeSec.toLowerCase()} found`} desc="We couldn't find matching data for this category." />
                    </div>
                  ) : (
                    explorerData.map(group => (
                       <div key={group.categoryName} style={{ 
                         background:'#fff', borderRadius:28, border:'1px solid #f1f5f9', 
                         overflow:'hidden', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(0,0,0,0.03)', 
                         gridColumn: '1/-1', marginBottom: 20
                       }}>
                          <div 
                            onClick={() => setExpandedCourseCat(expandedCourseCat === group.categoryName ? null : group.categoryName)}
                            style={{ padding:'28px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', background: expandedCourseCat === group.categoryName ? '#f8fafc' : '#fff', transition:'all 0.2s' }}
                          >
                             <div style={{ display:'flex', alignItems:'center', gap:20 }}>
                                <div style={{ 
                                  width:56, height:56, borderRadius:16, 
                                  background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', 
                                  color:'#fff', display:'grid', placeItems:'center', fontWeight:900, fontSize:20,
                                  boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
                                }}>
                                   {group.categoryName.substring(0, 1).toUpperCase()}
                                </div>
                                <div>
                                   <h3 style={{ margin:0, fontSize:24, fontWeight:900, color:'#1e293b' }}>{group.categoryName}</h3>
                                   <div style={{ display:'flex', gap:20, marginTop:8 }}>
                                      <span style={{ fontSize:14, color:'#64748b', fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
                                         <FiBookOpen size={16} color="#6366f1" /> {group.courseCount} Courses
                                      </span>
                                      <span style={{ fontSize:14, color:'#64748b', fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
                                         <FiMapPin size={16} color="#f59e0b" /> {group.collegeCount} Colleges
                                      </span>
                                   </div>
                                 </div>
                             </div>
                             <div style={{ 
                               background:'#f1f5f9', width:44, height:44, borderRadius:12, 
                               display:'grid', placeItems:'center', color:'#64748b', transition:'0.3s'
                             }}>
                                {expandedCourseCat === group.categoryName ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                             </div>
                          </div>
                          
                          {expandedCourseCat === group.categoryName && (
                             <div style={{ padding: '0 32px 32px', borderTop:'1px solid #f1f5f9' }}>
                                {/* COURSES SECTION */}
                                {group.courses.length > 0 && (
                                   <div style={{ marginTop: 32, marginBottom: 40 }}>
                                      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
                                         <h4 style={{ fontSize:12, fontWeight:900, color:'#94a3b8', textTransform:'uppercase', letterSpacing:2, whiteSpace:'nowrap' }}>Recommended Courses</h4>
                                         <div style={{ height:1, background:'#f1f5f9', flex:1 }} />
                                      </div>
                                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:24 }}>
                                         {group.courses.map(c => (
                                           <div key={c._id} style={{ 
                                             border:'1px solid #f1f5f9', borderRadius:24, padding:24, 
                                             display:'flex', flexDirection:'column', background:'#fafafa',
                                             transition: 'all 0.2s'
                                           }} className="hover-lift">
                                              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
                                                 <SBadge color="blue">{c.duration || 'N/A'}</SBadge>
                                                 <span style={{ fontSize:11, fontWeight:800, color:'#94a3b8', textTransform:'uppercase' }}>{c.sourceName}</span>
                                              </div>
                                              <h4 style={{ margin:'0 0 12px', fontSize:19, fontWeight:900, color:'#1e293b', lineHeight:1.3 }}>{c.courseName}</h4>
                                              <div style={{ marginTop:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12 }}>
                                                 <span style={{ fontSize:12, fontWeight:800, color:'#6366f1', background:'#eef2ff', padding:'4px 10px', borderRadius:8 }}>{c.level}</span>
                                                 <SBtn variant="primary" size="sm" style={{ borderRadius:12, padding:'8px 16px' }} onClick={() => navigate(`/course/${c._id}`)}>
                                                    Full Syllabus
                                                 </SBtn>
                                              </div>
                                           </div>
                                         ))}
                                      </div>
                                   </div>
                                )}
 
                                {/* COLLEGES SECTION */}
                                {group.colleges.length > 0 && (
                                   <div>
                                      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
                                         <h4 style={{ fontSize:12, fontWeight:900, color:'#94a3b8', textTransform:'uppercase', letterSpacing:2, whiteSpace:'nowrap' }}>Available at Top Institutions</h4>
                                         <div style={{ height:1, background:'#f1f5f9', flex:1 }} />
                                      </div>
                                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(360px, 1fr))', gap:24 }}>
                                         {group.colleges.map(clg => (
                                            <div key={clg._id} style={{ 
                                              background:'#fff', borderRadius:24, border:'1px solid #f1f5f9', padding:28,
                                              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                                            }} className="hover-lift">
                                               <div style={{ display:'flex', gap:16, alignItems:'center', marginBottom:16 }}>
                                                  <div style={{ width:48, height:48, borderRadius:14, background:'#f0f9ff', color:'#0ea5e9', display:'grid', placeItems:'center' }}>
                                                     <FiMapPin size={22} />
                                                  </div>
                                                  <h4 style={{ margin:0, fontSize:17, fontWeight:900, color:'#1e293b', lineHeight:1.3 }}>{clg.collegeName}</h4>
                                               </div>
                                               <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:14, color:'#64748b', marginBottom:24, fontWeight:500 }}>
                                                  {clg.district}, {clg.location}
                                               </div>
                                               <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid #f8fafc', paddingTop:20 }}>
                                                  <span style={{ fontSize:12, fontWeight:800, color:'#0891b2', background:'#ecfeff', padding:'4px 12px', borderRadius:8 }}>{clg.stream}</span>
                                                  <SBtn variant="outline" size="sm" style={{ borderRadius:12, fontWeight:700 }} onClick={() => navigate(`/colleges/${clg._id}`)}>
                                                     Explore Campus
                                                  </SBtn>
                                               </div>
                                            </div>
                                         ))}
                                      </div>
                                   </div>
                                )}
                             </div>
                          )}
                       </div>
                    )))
                ) : activeSec === 'College Mapping' ? (
                  mappingLoading ? (
                    <div style={{ gridColumn: '1/-1', padding: '100px 0' }}><SLoader /></div>
                  ) : mappingData.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign:'center', padding:'100px 0', background:'#fff', borderRadius:32, border:'1px dashed #cbd5e1' }}>
                      <SEmpty icon={<FiLink size={48} />} title="No mappings found" desc="Contact admin to map colleges to courses for this level." />
                    </div>
                  ) : (
                    mappingData.map(clg => (
                      <div key={clg._id} style={{ background:'#fff', borderRadius:24, border:'1px solid #f1f5f9', padding:24, boxShadow:'0 10px 15px -3px rgba(0,0,0,0.02)' }}>
                        <div style={{ display:'flex', gap:16, alignItems:'center', marginBottom:20 }}>
                          <div style={{ width:48, height:48, borderRadius:12, background:'var(--s-primary-l)', color:'var(--s-primary)', display:'grid', placeItems:'center', fontSize:20 }}><FiMapPin size={24} /></div>
                          <div>
                            <h3 style={{ margin:0, fontSize:18, fontWeight:900 }}>{clg.collegeName}</h3>
                            <div style={{ fontSize:13, color:'#64748b' }}><FiMapPin size={12} /> {clg.location}, {clg.district}</div>
                          </div>
                        </div>
                        
                        <div style={{ background:'#f8fafc', borderRadius:16, padding:16 }}>
                          <div style={{ fontSize:12, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>Courses Available</div>
                          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                            {clg.coursesOffered && clg.coursesOffered.map(c => (
                              <span key={c._id} style={{ background:'#fff', border:'1px solid #e2e8f0', padding:'6px 12px', borderRadius:8, fontSize:13, fontWeight:600 }}>
                                {c.courseName}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div style={{ marginTop:20, display:'flex', justifyContent:'flex-end' }}>
                          <SBtn variant="outline" size="sm" onClick={() => navigate(`/colleges/${clg._id}`)}>View College Details</SBtn>
                        </div>
                      </div>
                    ))
                  )
                ) : filteredContent.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign:'center', padding:'100px 0', background:'#fff', borderRadius:32, border:'1px dashed #cbd5e1' }}>
                  <SEmpty title="Nothing found yet" desc={`We haven't added items to ${activeSec} for Class ${cleanLevel} yet.`} />
                </div>
              ) : (
                filteredContent.map(item => {
                  if (item.isDirect) {
                    return (
                      <div key={item._id} style={{ 
                        background:'#fff', borderRadius:32, border:'1px solid #f1f5f9', 
                        overflow:'hidden', display:'flex', flexDirection:'column', 
                        boxShadow:'0 10px 15px -3px rgba(0,0,0,0.02)', transition:'0.3s' 
                      }} className="hover-lift">
                        <div style={{ padding: 32, flex:1, display:'flex', flexDirection:'column', position: 'relative' }}>
                          <button 
                            onClick={() => handleSaveAction(item)} 
                            style={{ 
                              position:'absolute', top:24, right:24, width:44, height:44, 
                              borderRadius:99, background:'#f8fafc', border:'1px solid #e2e8f0', cursor:'pointer', 
                              display:'grid', placeItems:'center', color: savedIds.has(item._id) ? '#ef4444' : '#64748b',
                              transition: 'all 0.2s'
                            }}
                          >
                            {savedIds.has(item._id) ? <FiHeart size={20} fill="#ef4444" /> : <FiBookmark size={20} />}
                          </button>

                          <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap', paddingRight: 50 }}>
                             <SBadge color="green">SCHOLARSHIP</SBadge>
                             {item.category && <SBadge color="blue">{item.category}</SBadge>}
                             {(item.grades || []).map(g => <SBadge key={g} color="purple">{g}</SBadge>)}
                          </div>
                          
                          <h3 style={{ fontSize:22, fontWeight:900, margin:'0 0 8px', lineHeight:1.3 }}>{item.scholarshipName}</h3>
                          <div style={{ fontSize:14, fontWeight:700, color:'#64748b', marginBottom:20, display:'flex', alignItems:'center', gap:6 }}>
                             <FiBriefcase size={14}/> {item.provider || "Unknown Provider"}
                          </div>
                          
                          <div style={{ background:'#f8fafc', borderRadius:16, padding:16, marginBottom:20, flex:1 }}>
                             {item.benefit && (
                                <div style={{ marginBottom:12 }}>
                                  <div style={{ fontSize:11, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>Benefit</div>
                                  <div style={{ fontSize:15, fontWeight:800, color:'#10b981' }}>{item.benefit}</div>
                                </div>
                             )}
                             {item.eligibility && (
                                <div style={{ marginBottom:12 }}>
                                  <div style={{ fontSize:11, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>Eligibility</div>
                                  <div style={{ fontSize:13, fontWeight:600, color:'#334155', lineHeight: 1.5 }}>{item.eligibility}</div>
                                </div>
                             )}
                             {item.deadline && (
                                <div>
                                  <div style={{ fontSize:11, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>Last Date</div>
                                  <div style={{ fontSize:13, fontWeight:700, color:'#ef4444' }}>{item.deadline}</div>
                                </div>
                             )}
                          </div>
                          
                          <SBtn 
                             variant="outline"
                             style={{ width:'100%', borderRadius:16, padding:'14px 0', border: '2px solid #3b82f6', color: '#3b82f6' }} 
                             onClick={() => handleCardClick(item)}
                          >
                             Apply / View Details Ã¢â€ â€”
                          </SBtn>
                        </div>
                      </div>
                    )
                  }

                  return (
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
                            <SBadge color="blue">{item.category}</SBadge>
                            {item.subCategoryLabel && <SBadge color="gray">{String(item.subCategoryLabel).toUpperCase()}</SBadge>}
                         </div>
                         <h3 style={{ fontSize:22, fontWeight:900, margin:'0 0 12px', lineHeight:1.3 }}>{item.title}</h3>
                         <p style={{ color:'#64748b', marginBottom:24, lineHeight:1.6 }}>{item.shortDescription}</p>
                         <SBtn 
                            variant="primary"
                            style={{ width:'100%', marginTop:'auto', borderRadius:16, padding:'14px 0' }} 
                            onClick={() => handleCardClick(item)}
                         >
                            Explore Detailed Guide
                         </SBtn>
                      </div>
                    </div>
                  )
                })
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

