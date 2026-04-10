import React, { useState } from 'react';
import { Modal, FormGrid, FormGroup, FormInput, FormActions } from '../../components/UI';
import { courseService } from '../../../services/courseService';

export default function AddCourseModal({ onClose, onCourseAdded }) {
  const [formData, setFormData] = useState({
    courseName: '',
    category: 'Engineering',
    level: 'Polytechnic',
    targetLevel: 'After 10th',
    duration: '',
    eligibility: '',
    shortDescription: ''
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
        targetLevel: formData.targetLevel,
        duration: formData.duration,
        eligibility: formData.eligibility,
        shortDescription: formData.shortDescription
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
        <FormGroup label="Target Level">
          <select 
            name="targetLevel"
            value={formData.targetLevel}
            onChange={handleInputChange}
            style={{ background:'var(--surface2)', border:'1.5px solid var(--border)', color:'var(--text)', borderRadius:10, padding:'9px 12px', fontSize:13.5, fontFamily:'Outfit', outline:'none', width:'100%' }}
          >
            <option value="After 10th">After 10th</option>
            <option value="After 12th">After 12th</option>
          </select>
        </FormGroup>
        <FormGroup label="Course Type (Level)">
          <select 
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            style={{ background:'var(--surface2)', border:'1.5px solid var(--border)', color:'var(--text)', borderRadius:10, padding:'9px 12px', fontSize:13.5, fontFamily:'Outfit', outline:'none', width:'100%' }}
          >
            <option value="Polytechnic">Polytechnic</option>
            <option value="Diploma">Diploma</option>
            <option value="B.Sc">B.Sc</option>
            <option value="B.A">B.A</option>
            <option value="B.Com">B.Com</option>
            <option value="BBA">BBA</option>
            <option value="BCA">BCA</option>
            <option value="Engineering">Engineering</option>
            <option value="Medical">Medical</option>
            <option value="Law">Law</option>
            <option value="Architecture">Architecture</option>
            <option value="Design">Design</option>
            <option value="Vocational">Vocational</option>
            <option value="Certification">Certification</option>
          </select>
        </FormGroup>
        <FormGroup label="Category">
           <select 
             name="category"
             value={formData.category}
             onChange={handleInputChange}
             style={{ background:'var(--surface2)', border:'1.5px solid var(--border)', color:'var(--text)', borderRadius:10, padding:'9px 12px', fontSize:13.5, fontFamily:'Outfit', outline:'none', width:'100%' }}
           >
             {["Agriculture", "Architecture", "Arts", "Commerce", "Design", "Engineering", "Hotel Management", "IT & Computer", "ITI", "Law", "Media & Journalism", "Medical", "Polytechnic", "Science"].map(cat => (
               <option key={cat} value={cat}>{cat}</option>
             ))}
           </select>
        </FormGroup>
        <FormGroup label="Duration">
          <FormInput 
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="e.g. 3 Years"
          />
        </FormGroup>
        <FormGroup label="Eligibility">
          <FormInput 
            name="eligibility"
            value={formData.eligibility}
            onChange={handleInputChange}
            placeholder="e.g. 10th Pass / 12th Pass"
          />
        </FormGroup>
        <FormGroup label="Short Description" full>
          <FormInput 
            name="shortDescription"
            as="textarea"
            value={formData.shortDescription}
            onChange={handleInputChange}
            placeholder="A brief overview of the course..."
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
