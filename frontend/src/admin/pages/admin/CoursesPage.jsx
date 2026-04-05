// CoursesPage.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, LevelBadge, DataTable, TR, TD, ActionBtn, FiltersRow, SearchInput, FilterSelect, PrimaryBtn, SBtn, Modal, FormGrid, FormGroup, FormInput, FormActions } from '../../components/UI'
import { courseService } from '../../../services/courseService'
import AddCourseModal from './AddCourseModal'

export default function CoursesPage() {
  const navigate = useNavigate()
  const [showAddCourseModal, setShowAddCourseModal] = useState(false)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTarget, setSelectedTarget] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const result = await courseService.getAllCourses()
      if (result.success) {
        setCourses(result.data)
      }
    } catch (error) {
      console.error('❌ Failed to fetch courses:', error)
      setMessage({ type: 'error', text: 'Failed to load courses' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return
    try {
      const result = await courseService.deleteCourse(id)
      if (result.success) {
        setMessage({ type: 'success', text: 'Course deleted successfully' })
        fetchCourses()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete course' })
    }
  }

  const handleExport = () => {
    if (filtered.length === 0) return;
    const headers = ['Course Name', 'Type', 'Trajectory', 'Category', 'Duration', 'Eligibility'];
    const rows = filtered.map(c => [
      `"${c.courseName.replace(/"/g, '""')}"`,
      `"${(c.level || '').replace(/"/g, '""')}"`,
      `"${(c.targetLevel || '').replace(/"/g, '""')}"`,
      `"${(c.category || '').replace(/"/g, '""')}"`,
      `"${(c.duration || '').replace(/"/g, '""')}"`,
      `"${(c.eligibility || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Courses_${new Date().toLocaleDateString()}.csv`);
    link.click();
  }

  const filtered = courses.filter(c => {
    const matchesTarget = selectedTarget === 'All' || c.targetLevel === selectedTarget
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory
    const matchesSearch = c.courseName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTarget && matchesCategory && matchesSearch
  })

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text2)' }}>Loading courses...</div>

  return (
    <div style={{ animation:'fadeUp 0.4s ease both' }}>
      {message.text && (
        <div style={{ 
          padding: 12, marginBottom: 16, borderRadius: 8, fontSize: 13.5, fontWeight: 600,
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
        }}>
          {message.text}
        </div>
      )}

      <FiltersRow>
        <SearchInput 
          placeholder="🔍 Search courses..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <FilterSelect value={selectedTarget} onChange={e=>setSelectedTarget(e.target.value)}>
          <option value="All">All Trajectories</option>
          <option value="After 10th">After 10th</option>
          <option value="After 12th">After 12th</option>
        </FilterSelect>
        <FilterSelect value={selectedCategory} onChange={e=>setSelectedCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {[
            "Engineering", "Medical", "Law", "Arts", "Commerce",
            "Science", "Design", "Architecture", "Polytechnic", "Diploma"
          ].map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </FilterSelect>
        <div style={{ marginLeft:'auto', display:'flex', gap:10 }}>
          <SBtn variant="outline" onClick={handleExport} disabled={filtered.length === 0}>📥 Export</SBtn>
          <PrimaryBtn onClick={()=>setShowAddCourseModal(true)}>+ Add Course</PrimaryBtn>
        </div>
      </FiltersRow>

      <Card>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text2)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
            <p>No courses found</p>
          </div>
        ) : (
          <DataTable columns={['Course Name', 'Type', 'Trajectory', 'Category', 'Duration', 'Actions']} data={filtered} renderRow={(c)=>(
            <TR key={c._id}>
              <TD style={{ fontWeight:600, color:'var(--text)' }}>{c.courseName}</TD>
              <TD style={{ color:'var(--text2)' }}>{c.level}</TD>
              <TD><LevelBadge level={c.targetLevel}/></TD>
              <TD style={{ color:'var(--text3)' }}>{c.category}</TD>
              <TD style={{ color:'var(--text3)' }}>{c.duration}</TD>
              <TD>
                <div style={{ display:'flex', gap:6 }}>
                  <ActionBtn onClick={() => navigate(`/admin/courses/edit/${c._id}`)}>📝 Details</ActionBtn>
                  <ActionBtn danger onClick={() => handleDelete(c._id)}>🗑</ActionBtn>
                </div>
              </TD>
            </TR>
          )}/>
        )}
      </Card>

      {showAddCourseModal && (
        <AddCourseModal
          onClose={() => setShowAddCourseModal(false)}
          onCourseAdded={fetchCourses}
        />
      )}
    </div>
  )
}
