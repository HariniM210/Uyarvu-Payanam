import React, { useState } from 'react';
import { Modal, FormGrid, FormGroup, FormInput, FormActions } from '../../components/UI';
import { courseService } from '../../../services/courseService';

export default function AddCourseModal({ onClose, onCourseAdded }) {
  const [formData, setFormData] = useState({
    courseName: '',
    category: 'Medical',
    level: '10th',
    duration: '',
    eligibility: '',
    futureScope: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        courseName: formData.courseName,
        category: formData.category,
        level: formData.level,
        duration: formData.duration,
        eligibility: formData.eligibility,
        futureScope: formData.futureScope
      };

      const result = await courseService.createCourse(payload);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Course added successfully!' });
        
        onCourseAdded();
        
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('❌ [Frontend] Error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to add course' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Add New Course" onClose={onClose}>
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
              "Engineering", "Medical", "Law", "Arts", "Commerce",
              "Science", "Design", "Architecture", "Education", "Aviation"
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
            <option value="5">Class 5</option>
            <option value="8">Class 8</option>
            <option value="10">Class 10</option>
            <option value="12">Class 12</option>
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
        onClose={onClose}
        onSave={handleSubmit}
        saveDisabled={submitting}
        saveText={submitting ? 'Saving...' : 'Save Course'}
      />
    </Modal>
  );
}
