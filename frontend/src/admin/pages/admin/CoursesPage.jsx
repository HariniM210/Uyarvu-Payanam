// CoursesPage.jsx
import React, { useState } from 'react'
import { Card, LevelBadge, DataTable, TR, TD, ActionBtn, FiltersRow, SearchInput, FilterSelect, PrimaryBtn, Modal, FormGrid, FormGroup, FormInput, FormActions } from '../../components/UI'

const COURSES = [
  { id:1, name:'JEE Preparation',      level:'12th', duration:'2 Years',  eligibility:'10+2 PCM', scope:'Engineering Colleges' },
  { id:2, name:'NEET Preparation',     level:'12th', duration:'2 Years',  eligibility:'10+2 PCB', scope:'Medical Colleges' },
  { id:3, name:'Coding Foundations',   level:'10th', duration:'6 Months', eligibility:'8th Pass',  scope:'Tech Industry' },
  { id:4, name:'Science Olympiad',     level:'8th',  duration:'3 Months', eligibility:'7th Pass',  scope:'National Recognition' },
  { id:5, name:'Basic Computer Skills',level:'5th',  duration:'2 Months', eligibility:'4th Pass',  scope:'Digital Literacy' },
]

export default function CoursesPage() {
  const [modal, setModal] = useState(false)
  const [level, setLevel] = useState('All')
  const filtered = level==='All' ? COURSES : COURSES.filter(c=>c.level===level)
  return (
    <div style={{ animation:'fadeUp 0.4s ease both' }}>
      <FiltersRow>
        <SearchInput placeholder="🔍 Search courses..." />
        <FilterSelect value={level} onChange={e=>setLevel(e.target.value)}>
          <option>All</option><option>5th</option><option>8th</option><option>10th</option><option>12th</option>
        </FilterSelect>
        <PrimaryBtn style={{ marginLeft:'auto' }} onClick={()=>setModal(true)}>+ Add Course</PrimaryBtn>
      </FiltersRow>
      <Card>
        <DataTable columns={['Course Name','Level','Duration','Eligibility','Future Scope','Actions']} data={filtered} renderRow={(c)=>(
          <TR key={c.id}>
            <TD style={{ fontWeight:600, color:'var(--text)' }}>{c.name}</TD>
            <TD><LevelBadge level={c.level}/></TD>
            <TD style={{ color:'var(--text3)' }}>{c.duration}</TD>
            <TD style={{ color:'var(--text3)' }}>{c.eligibility}</TD>
            <TD style={{ color:'var(--text3)' }}>{c.scope}</TD>
            <TD><div style={{ display:'flex', gap:6 }}><ActionBtn>✏️ Edit</ActionBtn><ActionBtn danger>🗑 Delete</ActionBtn></div></TD>
          </TR>
        )}/>
      </Card>
      {modal && <Modal title="Add New Course" onClose={()=>setModal(false)}>
        <FormGrid>
          <FormGroup label="Course Name" full><FormInput placeholder="e.g. JEE Preparation"/></FormGroup>
          <FormGroup label="Level"><select style={{ background:'var(--surface2)', border:'1.5px solid var(--border)', color:'var(--text)', borderRadius:10, padding:'9px 12px', fontSize:13.5, fontFamily:'Outfit', outline:'none', width:'100%' }}><option>5th</option><option>8th</option><option>10th</option><option>12th</option></select></FormGroup>
          <FormGroup label="Duration"><FormInput placeholder="e.g. 2 Years"/></FormGroup>
          <FormGroup label="Eligibility"><FormInput placeholder="e.g. 10+2 PCM"/></FormGroup>
          <FormGroup label="Future Scope" full><FormInput placeholder="e.g. Engineering Colleges"/></FormGroup>
          <FormGroup label="Description" full><FormInput as="textarea" placeholder="Brief course description..."/></FormGroup>
        </FormGrid>
        <FormActions onClose={()=>setModal(false)}/>
      </Modal>}
    </div>
  )
}
