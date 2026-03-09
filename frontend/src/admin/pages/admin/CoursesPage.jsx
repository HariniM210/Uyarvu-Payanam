// CoursesPage.jsx
import React, { useState, useEffect } from 'react'
import { Card, LevelBadge, DataTable, TR, TD, ActionBtn, FiltersRow, SearchInput, FilterSelect, PrimaryBtn, Modal, FormGrid, FormGroup, FormInput, FormActions } from '../../components/UI'
import { courseService } from '../../../services/courseService'
import AddCourseModal from './AddCourseModal'

export default function CoursesPage() {
  const [showAddCourseModal, setShowAddCourseModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    courseName: '',
    category: 'Medical',
    level: '10th',
    duration: '',
    eligibility: '',
    futureScope: ''
  })
  const [editingCourse, setEditingCourse] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      console.log('🔄 [Frontend] Fetching courses from API...');
      setLoading(true)
      const result = await courseService.getAllCourses()
      console.log('📥 [Frontend] Courses received:', result);
      if (result.success) {
        console.log('✅ [Frontend] Loaded', result.count, 'courses');
        setCourses(result.data)
      }
    } catch (error) {
      console.error('❌ [Frontend] Failed to fetch courses:', error)
      setMessage({ type: 'error', text: 'Failed to load courses' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }



  const handleEdit = (course) => {
    console.log('✏️ [Frontend] Edit course:', course);
    setEditingCourse(course)
    setFormData({
      courseName: course.courseName,
      category: course.category || 'Medical',
      level: course.level,
      duration: course.duration,
      eligibility: course.eligibility,
      futureScope: course.futureScope
    })
    setEditModal(true)
  }

  const handleUpdate = async () => {
    console.log('🔵 [Frontend] handleUpdate called for:', editingCourse._id);
    setSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      const payload = {
        courseName: formData.courseName,
        category: formData.category,
        level: formData.level,
        duration: formData.duration,
        eligibility: formData.eligibility,
        futureScope: formData.futureScope
      }

      console.log('📦 Update payload:', payload);
      const result = await courseService.updateCourse(editingCourse._id, payload)
      console.log('✅ [Frontend] Update response:', result);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Course updated successfully!' })
        fetchCourses()
        setTimeout(() => {
          setEditModal(false)
          setEditingCourse(null)
          setMessage({ type: '', text: '' })
        }, 1500)
      }
    } catch (error) {
      console.error('❌ [Frontend] Update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update course' 
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return
    }

    try {
      console.log('🗑️ [Frontend] Deleting course:', id);
      const result = await courseService.deleteCourse(id)
      if (result.success) {
        console.log('✅ Course deleted');
        setMessage({ type: 'success', text: 'Course deleted successfully' })
        fetchCourses()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      }
    } catch (error) {
      console.error('❌ [Frontend] Delete error:', error);
      setMessage({ type: 'error', text: 'Failed to delete course' })
    }
  }

  // Filter courses
  const filtered = courses.filter(c => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory
    const matchesLevel = selectedLevel === 'All' || c.level === selectedLevel
    const matchesSearch = c.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesLevel && matchesSearch
  })

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--text2)' }}>
        Loading courses...
      </div>
    )
  }

  return (
    <div style={{ animation:'fadeUp 0.4s ease both' }}>
      {message.text && (
        <div style={{ 
          padding: 12, 
          marginBottom: 16,
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          borderRadius: 8,
          fontSize: 13.5,
          fontWeight: 600
        }}>
          {message.text}
        </div>
      )}

      <FiltersRow>
        <SearchInput 
          placeholder="🔍 Search courses..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <FilterSelect value={selectedLevel} onChange={e=>setSelectedLevel(e.target.value)}>
          <option value="All">All Levels</option>
          {[
            "10th", "12th", "Diploma", "Undergraduate"
          ].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
        </FilterSelect>
        <FilterSelect value={selectedCategory} onChange={e=>setSelectedCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {[
            "Medical", "Engineering", "Science", "Commerce", "Arts", 
            "Design", "Agriculture", "Polytechnic", "ITI"
          ].map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </FilterSelect>
        <PrimaryBtn style={{ marginLeft:'auto' }} onClick={()=>setShowAddCourseModal(true)}>+ Add Course</PrimaryBtn>
      </FiltersRow>

      <Card>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text2)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
            <p>No courses found</p>
          </div>
        ) : (
          <DataTable columns={['Course Name', 'Category', 'Level', 'Duration', 'Eligibility', 'Future Scope', 'Actions']} data={filtered} renderRow={(c)=>(
            <TR key={c._id}>
              <TD style={{ fontWeight:600, color:'var(--text)' }}>{c.courseName}</TD>
              <TD style={{ color:'var(--text2)' }}>{c.category}</TD>
              <TD><LevelBadge level={c.level}/></TD>
              <TD style={{ color:'var(--text3)' }}>{c.duration}</TD>
              <TD style={{ color:'var(--text3)' }}>{c.eligibility}</TD>
              <TD style={{ color:'var(--text3)' }}>{c.futureScope}</TD>
              <TD>
                <div style={{ display:'flex', gap:6 }}>
                  <ActionBtn onClick={() => handleEdit(c)}>✏️ Edit</ActionBtn>
                  <ActionBtn danger onClick={() => handleDelete(c._id)}>🗑 Delete</ActionBtn>
                </div>
              </TD>
            </TR>
          )}/>
        )}
      </Card>

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <AddCourseModal
          onClose={() => setShowAddCourseModal(false)}
          onCourseAdded={fetchCourses}
        />
      )}

      {/* Edit Course Modal */}
      {editModal && (
        <Modal title="Edit Course" onClose={()=>setEditModal(false)}>
          {message.text && message.type === 'success' && (
            <div style={{ padding: 12, marginBottom: 16, backgroundColor: '#d4edda', color: '#155724', borderRadius: 8, fontSize: 13 }}>
              ✓ {message.text}
            </div>
          )}
          {message.text && message.type === 'error' && (
            <div style={{ padding: 12, marginBottom: 16, backgroundColor: '#f8d7da', color: '#721c24', borderRadius: 8, fontSize: 13 }}>
              ⚠ {message.text}
            </div>
          )}
          <FormGrid>
            <FormGroup label="Course Name" full>
              <FormInput 
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                placeholder="e.g. JEE Preparation"
              />
            </FormGroup>
            <FormGroup label="Category">
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{ background:'var(--surface2)', border:'1.5px solid var(--border)', color:'var(--text)', borderRadius:10, padding:'9px 12px', fontSize:13.5, fontFamily:'Outfit', outline:'none', width:'100%' }}
              >
                {[
                  "Medical", "Engineering", "Science", "Commerce", "Arts", 
                  "Design", "Agriculture", "Polytechnic", "ITI"
                ].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </FormGroup>
            <FormGroup label="Level">
              <select 
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                style={{ background:'var(--surface2)', border:'1.5px solid var(--border)', color:'var(--text)', borderRadius:10, padding:'9px 12px', fontSize:13.5, fontFamily:'Outfit', outline:'none', width:'100%' }}
              >
                <option value="10th">10th</option>
                <option value="12th">12th</option>
                <option value="Diploma">Diploma</option>
                <option value="Undergraduate">Undergraduate</option>
              </select>
            </FormGroup>
            <FormGroup label="Duration">
              <FormInput 
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g. 2 Years"
              />
            </FormGroup>
            <FormGroup label="Eligibility">
              <FormInput 
                name="eligibility"
                value={formData.eligibility}
                onChange={handleInputChange}
                placeholder="e.g. 10+2 PCM"
              />
            </FormGroup>
            <FormGroup label="Future Scope" full>
              <FormInput 
                name="futureScope"
                value={formData.futureScope}
                onChange={handleInputChange}
                placeholder="e.g. Engineering Colleges"
              />
            </FormGroup>
          </FormGrid>
          <FormActions 
            onClose={()=>setEditModal(false)}
            onSave={handleUpdate}
            saveDisabled={submitting}
            saveText={submitting ? 'Updating...' : 'Update Course'}
          />
        </Modal>
      )}
    </div>
  )
}
