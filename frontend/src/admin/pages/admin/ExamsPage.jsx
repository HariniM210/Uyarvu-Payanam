import React, { useState, useEffect } from 'react'
import { Card, LevelBadge, DataTable, TR, TD, ActionBtn, FiltersRow, SearchInput, FilterSelect, PrimaryBtn, Modal, FormGrid, FormGroup, FormInput, FormActions } from '../../components/UI'
import { examService } from '../../../services/examService'

export default function ExamsPage() {
  const [modal, setModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [level, setLevel] = useState('All Levels')
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    examName: '',
    conductingBody: '',
    level: '8th',
    importantDate: '',
    applicationLink: '',
    officialWebsite: '',
    description: ''
  })
  const [editingExam, setEditingExam] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      console.log('🔄 [Frontend] Fetching exams from API...');
      setLoading(true)
      const result = await examService.getAllExams()
      console.log('📥 [Frontend] Exams received:', result);
      if (result.success) {
        console.log('✅ [Frontend] Loaded', result.count, 'exams');
        setExams(result.data)
      }
    } catch (error) {
      console.error('❌ [Frontend] Failed to fetch exams:', error)
      setMessage({ type: 'error', text: 'Failed to load exams' })
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

  const handleSubmit = async () => {
    console.log('🔵 [Frontend] handleSubmit called');
    console.log('📋 Form Data:', formData);
    
    setSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      const payload = {
        examName: formData.examName,
        conductingBody: formData.conductingBody,
        level: formData.level,
        importantDate: formData.importantDate,
        applicationLink: formData.applicationLink,
        officialWebsite: formData.officialWebsite,
        description: formData.description
      }

      console.log('📦 Payload to send:', payload);
      console.log('🚀 Sending POST request to backend...');
      
      const result = await examService.createExam(payload)
      console.log('✅ [Frontend] Response received:', result);
      
      if (result.success) {
        console.log('✨ Exam created successfully!');
        setMessage({ type: 'success', text: 'Exam added successfully!' })
        setFormData({
          examName: '',
          conductingBody: '',
          level: '8th',
          importantDate: '',
          applicationLink: '',
          officialWebsite: '',
          description: ''
        })
        console.log('🔄 Refetching exams...');
        fetchExams()
        setTimeout(() => {
          setModal(false)
          setMessage({ type: '', text: '' })
        }, 1500)
      }
    } catch (error) {
      console.error('❌ [Frontend] Error:', error);
      console.error('❌ Error response:', error.response?.data);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to add exam' 
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (exam) => {
    console.log('✏️ [Frontend] Edit exam:', exam);
    setEditingExam(exam)
    setFormData({
      examName: exam.examName,
      conductingBody: exam.conductingBody,
      level: exam.level,
      importantDate: exam.importantDate,
      applicationLink: exam.applicationLink || '',
      officialWebsite: exam.officialWebsite || '',
      description: exam.description || ''
    })
    setEditModal(true)
  }

  const handleUpdate = async () => {
    console.log('🔵 [Frontend] handleUpdate called for:', editingExam._id);
    setSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      const payload = {
        examName: formData.examName,
        conductingBody: formData.conductingBody,
        level: formData.level,
        importantDate: formData.importantDate,
        applicationLink: formData.applicationLink,
        officialWebsite: formData.officialWebsite,
        description: formData.description
      }

      console.log('📦 Update payload:', payload);
      const result = await examService.updateExam(editingExam._id, payload)
      console.log('✅ [Frontend] Update response:', result);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Exam updated successfully!' })
        fetchExams()
        setTimeout(() => {
          setEditModal(false)
          setEditingExam(null)
          setMessage({ type: '', text: '' })
        }, 1500)
      }
    } catch (error) {
      console.error('❌ [Frontend] Update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update exam' 
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) {
      return
    }

    try {
      console.log('🗑️ [Frontend] Deleting exam:', id);
      const result = await examService.deleteExam(id)
      if (result.success) {
        console.log('✅ Exam deleted');
        setMessage({ type: 'success', text: 'Exam deleted successfully' })
        fetchExams()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      }
    } catch (error) {
      console.error('❌ [Frontend] Delete error:', error);
      setMessage({ type: 'error', text: 'Failed to delete exam' })
    }
  }

  // Filter exams
  const filtered = exams.filter(e => {
    const matchesLevel = level === 'All Levels' || e.level === level
    const matchesSearch = e.examName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesLevel && matchesSearch
  })

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--text2)' }}>
        Loading exams...
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
          placeholder="🔍 Search exams..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <FilterSelect value={level} onChange={e => setLevel(e.target.value)}>
          <option>All Levels</option>
          <option>8th</option>
          <option>10th</option>
          <option>12th</option>
          <option>Graduate</option>
        </FilterSelect>
        <PrimaryBtn style={{ marginLeft:'auto' }} onClick={()=>setModal(true)}>+ Add Exam</PrimaryBtn>
      </FiltersRow>

      <Card>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text2)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
            <p>No exams found</p>
          </div>
        ) : (
          <DataTable columns={['Exam Name','Conducting Body','Level','Important Date','Website','Actions']} data={filtered} renderRow={(e)=>(
            <TR key={e._id}>
              <TD style={{ fontWeight:600, color:'var(--text)' }}>{e.examName}</TD>
              <TD style={{ color:'var(--text3)' }}>{e.conductingBody}</TD>
              <TD><LevelBadge level={e.level}/></TD>
              <TD><span style={{ color:'#f59e0b', fontWeight:600, fontSize:12 }}>📅 {e.importantDate}</span></TD>
              <TD>
                {e.officialWebsite ? (
                  <a href={e.officialWebsite.startsWith('http') ? e.officialWebsite : `https://${e.officialWebsite}`} target="_blank" rel="noreferrer" style={{ color:'var(--primary)', fontSize:12, fontWeight:600, textDecoration:'none' }}>
                    🔗 Visit
                  </a>
                ) : (
                  <span style={{ color:'var(--text3)', fontSize:12 }}>-</span>
                )}
              </TD>
              <TD>
                <div style={{ display:'flex', gap:6 }}>
                  <ActionBtn onClick={() => handleEdit(e)}>✏️ Edit</ActionBtn>
                  <ActionBtn danger onClick={() => handleDelete(e._id)}>🗑 Delete</ActionBtn>
                </div>
              </TD>
            </TR>
          )}/>
        )}
      </Card>

      {/* Add Exam Modal */}
      {modal && (
        <Modal title="Add New Exam" onClose={()=>setModal(false)}>
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
            <FormGroup label="Exam Name" full>
              <FormInput 
                name="examName"
                value={formData.examName}
                onChange={handleInputChange}
                placeholder="e.g. JEE Main"
              />
            </FormGroup>
            <FormGroup label="Conducting Body">
              <FormInput 
                name="conductingBody"
                value={formData.conductingBody}
                onChange={handleInputChange}
                placeholder="e.g. NTA"
              />
            </FormGroup>
            <FormGroup label="Level">
              <select 
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                style={{ background:'var(--surface2)', border:'1.5px solid var(--border)', color:'var(--text)', borderRadius:10, padding:'9px 12px', fontSize:13.5, fontFamily:'Outfit', outline:'none', width:'100%' }}
              >
                <option value="8th">8th</option>
                <option value="10th">10th</option>
                <option value="12th">12th</option>
                <option value="Graduate">Graduate</option>
              </select>
            </FormGroup>
            <FormGroup label="Important Date">
              <FormInput 
                name="importantDate"
                value={formData.importantDate}
                onChange={handleInputChange}
                placeholder="e.g. Jan 30, 2025"
              />
            </FormGroup>
            <FormGroup label="Application Link" full>
              <FormInput 
                name="applicationLink"
                value={formData.applicationLink}
                onChange={handleInputChange}
                placeholder="https://"
              />
            </FormGroup>
            <FormGroup label="Official Website" full>
              <FormInput 
                name="officialWebsite"
                value={formData.officialWebsite}
                onChange={handleInputChange}
                placeholder="https://"
              />
            </FormGroup>
            <FormGroup label="Description" full>
              <FormInput 
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Exam details, syllabus info..."
              />
            </FormGroup>
          </FormGrid>
          <FormActions 
            onClose={()=>setModal(false)}
            onSave={handleSubmit}
            saveDisabled={submitting}
            saveText={submitting ? 'Saving...' : 'Save Exam'}
          />
        </Modal>
      )}

      {/* Edit Exam Modal */}
      {editModal && (
        <Modal title="Edit Exam" onClose={()=>setEditModal(false)}>
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
            <FormGroup label="Exam Name" full>
              <FormInput 
                name="examName"
                value={formData.examName}
                onChange={handleInputChange}
                placeholder="e.g. JEE Main"
              />
            </FormGroup>
            <FormGroup label="Conducting Body">
              <FormInput 
                name="conductingBody"
                value={formData.conductingBody}
                onChange={handleInputChange}
                placeholder="e.g. NTA"
              />
            </FormGroup>
            <FormGroup label="Level">
              <select 
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                style={{ background:'var(--surface2)', border:'1.5px solid var(--border)', color:'var(--text)', borderRadius:10, padding:'9px 12px', fontSize:13.5, fontFamily:'Outfit', outline:'none', width:'100%' }}
              >
                <option value="8th">8th</option>
                <option value="10th">10th</option>
                <option value="12th">12th</option>
                <option value="Graduate">Graduate</option>
              </select>
            </FormGroup>
            <FormGroup label="Important Date">
              <FormInput 
                name="importantDate"
                value={formData.importantDate}
                onChange={handleInputChange}
                placeholder="e.g. Jan 30, 2025"
              />
            </FormGroup>
            <FormGroup label="Application Link" full>
              <FormInput 
                name="applicationLink"
                value={formData.applicationLink}
                onChange={handleInputChange}
                placeholder="https://"
              />
            </FormGroup>
            <FormGroup label="Official Website" full>
              <FormInput 
                name="officialWebsite"
                value={formData.officialWebsite}
                onChange={handleInputChange}
                placeholder="https://"
              />
            </FormGroup>
            <FormGroup label="Description" full>
              <FormInput 
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Exam details, syllabus info..."
              />
            </FormGroup>
          </FormGrid>
          <FormActions 
            onClose={()=>setEditModal(false)}
            onSave={handleUpdate}
            saveDisabled={submitting}
            saveText={submitting ? 'Updating...' : 'Update Exam'}
          />
        </Modal>
      )}
    </div>
  )
}
