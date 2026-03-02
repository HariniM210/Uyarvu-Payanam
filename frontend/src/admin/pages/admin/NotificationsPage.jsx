import React, { useState } from 'react'
import { LevelBadge, ActionBtn, FiltersRow, PrimaryBtn, Modal, FormGrid, FormGroup, FormInput, FormActions } from '../../components/UI'

const NOTIFS = [
  { id:1, icon:'📝', title:'JEE Main Registration Open',  desc:'Last date to apply is January 30, 2025',              level:'12th', type:'Exam' },
  { id:2, icon:'🎓', title:'NSP Scholarship Deadline',    desc:'Apply before October 31 to avail NSP pre-matric',     level:'8th',  type:'Scholarship' },
  { id:3, icon:'📋', title:'NEET Admit Card Released',    desc:'Download your admit card from official website',      level:'12th', type:'Exam' },
  { id:4, icon:'🏫', title:'Counselling Dates Announced', desc:'JoSAA counselling begins October 10, 2024',           level:'12th', type:'Counselling' },
]

export default function NotificationsPage() {
  const [modal, setModal] = useState(false)
  return (
    <div style={{ animation:'fadeUp 0.4s ease both' }}>
      <FiltersRow>
        <span style={{ fontSize:13, color:'var(--text3)' }}>{NOTIFS.length} active notifications</span>
        <PrimaryBtn style={{ marginLeft:'auto' }} onClick={()=>setModal(true)}>+ New Notification</PrimaryBtn>
      </FiltersRow>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {NOTIFS.map(n => (
          <div key={n.id} style={{ background:'var(--surface)', border:'1.5px solid var(--border)',
            borderRadius:16, padding:'16px 18px', display:'flex', alignItems:'flex-start', gap:14,
            borderLeft:`4px solid var(--primary)` }}>
            <div style={{ width:42, height:42, borderRadius:12, background:'var(--primary-l)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
              {n.icon}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'Nunito', fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:4 }}>{n.title}</div>
              <div style={{ fontSize:13, color:'var(--text3)', marginBottom:10 }}>{n.desc}</div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <LevelBadge level={n.level}/>
                <span style={{ fontSize:11, padding:'3px 8px', background:'var(--primary-l)',
                  color:'var(--primary)', borderRadius:20, fontWeight:700 }}>{n.type}</span>
              </div>
            </div>
            <div style={{ display:'flex', gap:6, flexShrink:0 }}>
              <ActionBtn>✏️ Edit</ActionBtn>
              <ActionBtn danger>🗑 Delete</ActionBtn>
            </div>
          </div>
        ))}
      </div>
      {modal && <Modal title="Create Notification" onClose={()=>setModal(false)}>
        <FormGrid>
          <FormGroup label="Title" full><FormInput placeholder="Notification title"/></FormGroup>
          <FormGroup label="Target Level"><select style={{ background:'var(--surface2)', border:'1.5px solid var(--border)', color:'var(--text)', borderRadius:10, padding:'9px 12px', fontSize:13.5, fontFamily:'Outfit', outline:'none', width:'100%' }}><option>All</option><option>5th</option><option>8th</option><option>10th</option><option>12th</option></select></FormGroup>
          <FormGroup label="Expiry Date"><FormInput placeholder="e.g. Jan 30, 2025"/></FormGroup>
          <FormGroup label="Description" full><FormInput as="textarea" placeholder="Notification details..."/></FormGroup>
        </FormGrid>
        <FormActions onClose={()=>setModal(false)}/>
      </Modal>}
    </div>
  )
}
