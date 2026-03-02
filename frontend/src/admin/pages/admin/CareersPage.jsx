import React, { useState } from 'react'
import { Card, ActionBtn, PrimaryBtn, Modal, FormGrid, FormGroup, FormInput, FormActions } from '../../components/UI'

const PATHS = [
  { level:'After 5th',  age:'10-12 yrs', desc:'Foundation skills, Olympiads, basic career awareness', careers:'Science, Arts, Sports, Music', color:'#8b5cf6' },
  { level:'After 8th',  age:'13-15 yrs', desc:'Stream selection guidance, scholarships, talent programs', careers:'PCM, PCB, Commerce, Humanities', color:'#f59e0b' },
  { level:'After 10th', age:'15-17 yrs', desc:'Stream selection, polytechnic, ITI, junior college', careers:'Engineering, Medical, Commerce, Arts', color:'#2d9e5f' },
  { level:'After 12th', age:'17-19 yrs', desc:'Entrance exams, college admissions, career path clarity', careers:'All Graduate Programs', color:'#ef4444' },
]

export default function CareersPage() {
  const [showModal, setShowModal] = useState(false)
  return (
    <div style={{ animation:'fadeUp 0.4s ease both' }}>
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:20 }}>
        <PrimaryBtn onClick={() => setShowModal(true)}>+ Add Career Path</PrimaryBtn>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {PATHS.map(p => (
          <Card key={p.level} style={{ borderTop:`4px solid ${p.color}` }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <span style={{ fontFamily:'Nunito', fontWeight:800, fontSize:17, color:'var(--text)' }}>{p.level}</span>
              <span style={{ fontSize:11, color:'var(--text3)', background:'var(--surface2)',
                padding:'4px 10px', borderRadius:20, fontWeight:600 }}>{p.age}</span>
            </div>
            <p style={{ fontSize:13.5, color:'var(--text2)', marginBottom:12, lineHeight:1.7 }}>{p.desc}</p>
            <div style={{ fontSize:12, color:'var(--text3)', marginBottom:14 }}>
              <span style={{ fontWeight:600 }}>Career Options: </span>
              <span style={{ color:'var(--text2)' }}>{p.careers}</span>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <ActionBtn>✏️ Edit</ActionBtn>
              <ActionBtn>📋 Add Notes</ActionBtn>
            </div>
          </Card>
        ))}
      </div>
      {showModal && (
        <Modal title="Add Career Path" onClose={() => setShowModal(false)}>
          <FormGrid>
            <FormGroup label="Title" full><FormInput placeholder="e.g. After 5th" /></FormGroup>
            <FormGroup label="Age Group"><FormInput placeholder="e.g. 10-12 yrs" /></FormGroup>
            <FormGroup label="Level">
              <select style={{ background:'var(--surface2)', border:'1.5px solid var(--border)', color:'var(--text)', borderRadius:10, padding:'9px 12px', fontSize:13.5, fontFamily:'Outfit,sans-serif', outline:'none', width:'100%' }}>
                <option>5th</option><option>8th</option><option>10th</option><option>12th</option>
              </select>
            </FormGroup>
            <FormGroup label="Career Directions" full><FormInput as="textarea" placeholder="Possible career paths..." /></FormGroup>
            <FormGroup label="Description" full><FormInput as="textarea" placeholder="Guidance text for students..." /></FormGroup>
          </FormGrid>
          <FormActions onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  )
}
