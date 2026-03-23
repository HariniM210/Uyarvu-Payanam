import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, ActionBtn, PrimaryBtn, Modal, FormGrid, FormGroup, FormInput, FormActions } from '../../components/UI'
import { careerPathService } from '../../../services/careerPathService'
import { FiPlus, FiTrash2, FiVideo, FiImage, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const LEVEL_COLORS = {
  '5': '#8b5cf6',
  '8': '#f59e0b',
  '10': '#2d9e5f',
  '12': '#ef4444'
}

export default function CareersPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false)
  const [careerPaths, setCareerPaths] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    ageGroup: '',
    level: '5',
    careerDirections: '',
    description: '',
    sections: []
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCareerPaths()
  }, [])

  const fetchCareerPaths = async () => {
    try {
      setLoading(true)
      const result = await careerPathService.getAllCareerPaths()
      if (result.success) setCareerPaths(result.data)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load career paths' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { heading: '', content: '', videoUrl: '', images: [] }]
    })
  }

  const removeSection = (idx) => {
    const updated = [...formData.sections]
    updated.splice(idx, 1)
    setFormData({ ...formData, sections: updated })
  }

  const updateSection = (idx, field, value) => {
    const updated = [...formData.sections]
    updated[idx][field] = value
    setFormData({ ...formData, sections: updated })
  }

  const handleSectionImages = (idx, value) => {
    const imgs = value.split(',').map(s => s.trim()).filter(Boolean)
    updateSection(idx, 'images', imgs)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      const careerDirectionsArray = formData.careerDirections
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '')

      const payload = { ...formData, careerDirections: careerDirectionsArray }
      const result = await careerPathService.createCareerPath(payload)

      if (result.success) {
        setMessage({ type: 'success', text: 'Career path added successfully!' })
        setFormData({ title: '', ageGroup: '', level: '5', careerDirections: '', description: '', sections: [] })
        fetchCareerPaths()
        setTimeout(() => {
          setShowModal(false)
          setMessage({ type: '', text: '' })
        }, 1500)
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add career path' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this career path?')) return
    try {
      const result = await careerPathService.deleteCareerPath(id)
      if (result.success) {
        setMessage({ type: 'success', text: 'Career path deleted successfully' })
        fetchCareerPaths()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' })
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text2)' }}>Loading...</div>

  return (
    <div style={{ animation:'fadeUp 0.4s ease both' }}>
      {message.text && (
        <div style={{ padding: 12, marginBottom: 16, background: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24', borderRadius: 8 }}>
          {message.text}
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:20 }}>
        <PrimaryBtn onClick={() => setShowModal(true)}>+ Add New Career Milestone</PrimaryBtn>
      </div>

      {careerPaths.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
          <p style={{ color: 'var(--text2)', fontSize: 15, marginBottom: 8 }}>No career paths added yet</p>
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>Click "Add Career Path" to create your first entry</p>
        </Card>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {[...careerPaths]
            .sort((a, b) => {
              const order = { '5th': 1, '8th': 2, '10th': 3, '12th': 4 };
              const levelA = a.level ? a.level.toLowerCase() : '';
              const levelB = b.level ? b.level.toLowerCase() : '';
              return (order[levelA] || 99) - (order[levelB] || 99);
            })
            .map(path => (
            <Card key={path._id} style={{ borderTop:`4px solid ${LEVEL_COLORS[path.level] || '#6366f1'}` }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <span style={{ fontFamily:'Nunito', fontWeight:800, fontSize:17, color:'var(--text)' }}>{path.title}</span>
                <span style={{ fontSize:11, color:'var(--text3)', background:'var(--surface2)',
                  padding:'4px 10px', borderRadius:20, fontWeight:600 }}>{path.ageGroup}</span>
              </div>
              <div style={{ fontSize:11, color:'var(--text3)', marginBottom:8, fontWeight:700 }}>
                Level: {path.level}
              </div>
              <p style={{ fontSize:13.5, color:'var(--text2)', marginBottom:12, lineHeight:1.7 }}>{path.description}</p>
              <div style={{ fontSize:12, color:'var(--text3)', marginBottom:14 }}>
                <span style={{ fontWeight:600 }}>Career Options: </span>
                <span style={{ color:'var(--text2)' }}>{path.careerDirections.join(', ')}</span>
              </div>
              <div style={{ display:'flex', gap:8, marginTop: 'auto' }}>
                <PrimaryBtn onClick={() => navigate(`/admin/career/${path.level.toLowerCase()}`)} style={{ flex: 1, padding: '6px 14px', fontSize: 13, background: `var(--surface2)`, color: 'var(--text)', border: '1px solid var(--border)' }}>
                  View Full Details
                </PrimaryBtn>
                <ActionBtn onClick={() => handleDelete(path._id)}>🗑️ Delete</ActionBtn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Build Interactive Career Milestone" onClose={() => setShowModal(false)} width="850px">
          <FormGrid>
            <FormGroup label="Page Title" full>
              <FormInput name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Explore, Learn & Grow After 5th" />
            </FormGroup>
            <FormGroup label="Level">
              <select name="level" value={formData.level} onChange={handleInputChange} style={{ background:'var(--surface2)', border:'1.5px solid var(--border)', color:'var(--text)', borderRadius:10, padding:'9px 12px', width:'100%' }}>
                <option value="5">Class 5</option>
                <option value="8">Class 8</option>
                <option value="10">Class 10</option>
                <option value="12">Class 12</option>
              </select>
            </FormGroup>
            <FormGroup label="Subtext / Age Group">
               <FormInput name="ageGroup" value={formData.ageGroup} onChange={handleInputChange} placeholder="e.g. 10-12 yrs" />
            </FormGroup>
            <FormGroup label="Intro Description" full>
               <FormInput as="textarea" name="description" value={formData.description} onChange={handleInputChange} placeholder="General guidance overview..." />
            </FormGroup>
            <FormGroup label="Career Directions / Tags (comma-separated)" full>
               <FormInput name="careerDirections" value={formData.careerDirections} onChange={handleInputChange} placeholder="e.g. Engineering, Medicine, Arts" />
            </FormGroup>

            {/* Rich Sections Builder */}
            <div style={{ gridColumn:'1 / -1', marginTop:24 }}>
               <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                  <h3 style={{ fontSize:18, fontWeight:800, color:'var(--text)' }}>Rich Media Sections</h3>
                  <PrimaryBtn type="button" onClick={addSection} style={{ padding:'6px 14px', fontSize:12 }}>+ Add Interactive Section</PrimaryBtn>
               </div>
               
               <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                  {formData.sections.map((sec, idx) => (
                    <div key={idx} style={{ padding:20, background:'var(--surface1)', border:'1.5px solid var(--border)', borderRadius:16, position:'relative' }}>
                       <button type="button" onClick={() => removeSection(idx)} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', color:'#ef4444', cursor:'pointer' }}><FiTrash2 size={18} /></button>
                       <div style={{ marginBottom:14 }}>
                          <FormGroup label={`Section ${idx + 1} Heading`}>
                             <FormInput value={sec.heading} onChange={e => updateSection(idx, 'heading', e.target.value)} placeholder="e.g. Academic Foundation" />
                          </FormGroup>
                       </div>
                       <FormGroup label="Content / Guidance" full>
                          <FormInput as="textarea" value={sec.content} onChange={e => updateSection(idx, 'content', e.target.value)} placeholder="Enter detailed guidance here..." />
                       </FormGroup>
                       <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:14 }}>
                          <FormGroup label="YouTube Video Link">
                             <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                <FiVideo color="var(--text3)" />
                                <FormInput value={sec.videoUrl} onChange={e => updateSection(idx, 'videoUrl', e.target.value)} placeholder="https://youtube.com/..." />
                             </div>
                          </FormGroup>
                          <FormGroup label="Image URLs (comma-separated)">
                             <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                <FiImage color="var(--text3)" />
                                <FormInput value={sec.images?.join(', ')} onChange={e => handleSectionImages(idx, e.target.value)} placeholder="img1.jpg, img2.jpg" />
                             </div>
                          </FormGroup>
                       </div>
                    </div>
                  ))}
               </div>
               {formData.sections.length === 0 && (
                  <div style={{ padding:30, textAlign:'center', border:'2px dashed var(--border)', borderRadius:16, color:'var(--text3)', fontSize:14 }}>
                     No rich sections added yet. Use sections for images and videos.
                  </div>
               )}
            </div>
          </FormGrid>
          <FormActions onClose={() => setShowModal(false)} onSave={handleSubmit} saveDisabled={submitting} saveText={submitting ? 'Saving...' : 'Publish Milestone'} />
        </Modal>
      )}
    </div>
  )
}
