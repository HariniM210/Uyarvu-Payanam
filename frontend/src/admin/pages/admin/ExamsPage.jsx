import React, { useState } from 'react'
import { Card, LevelBadge, DataTable, TR, TD, ActionBtn, FiltersRow, SearchInput, FilterSelect, PrimaryBtn, Modal, FormGrid, FormGroup, FormInput, FormActions } from '../../components/UI'

const EXAMS = [
  { id:1, name:'JEE Main',  body:'NTA',   level:'12th',     deadline:'Jan 2025', website:'jeemain.nta.nic.in' },
  { id:2, name:'NEET UG',   body:'NTA',   level:'12th',     deadline:'Mar 2025', website:'neet.nta.nic.in' },
  { id:3, name:'UPSC CSE',  body:'UPSC',  level:'Graduate', deadline:'Feb 2025', website:'upsc.gov.in' },
  { id:4, name:'NTSE',      body:'NCERT', level:'10th',     deadline:'Nov 2024', website:'ncert.nic.in' },
  { id:5, name:'NSO',       body:'SOF',   level:'8th',      deadline:'Oct 2024', website:'sofworld.org' },
]

export default function ExamsPage() {
  const [modal, setModal] = useState(false)
  return (
    <div style={{ animation:'fadeUp 0.4s ease both' }}>
      <FiltersRow>
        <SearchInput placeholder="🔍 Search exams..."/>
        <FilterSelect><option>All Levels</option><option>8th</option><option>10th</option><option>12th</option><option>Graduate</option></FilterSelect>
        <PrimaryBtn style={{ marginLeft:'auto' }} onClick={()=>setModal(true)}>+ Add Exam</PrimaryBtn>
      </FiltersRow>
      <Card>
        <DataTable columns={['Exam Name','Conducting Body','Level','Deadline','Website','Actions']} data={EXAMS} renderRow={(e)=>(
          <TR key={e.id}>
            <TD style={{ fontWeight:600, color:'var(--text)' }}>{e.name}</TD>
            <TD style={{ color:'var(--text3)' }}>{e.body}</TD>
            <TD><LevelBadge level={e.level}/></TD>
            <TD><span style={{ color:'#f59e0b', fontWeight:600, fontSize:12 }}>📅 {e.deadline}</span></TD>
            <TD><a href={`https://${e.website}`} target="_blank" rel="noreferrer" style={{ color:'var(--primary)', fontSize:12, fontWeight:600, textDecoration:'none' }}>🔗 {e.website}</a></TD>
            <TD><div style={{ display:'flex', gap:6 }}><ActionBtn>✏️ Edit</ActionBtn><ActionBtn danger>🗑 Delete</ActionBtn></div></TD>
          </TR>
        )}/>
      </Card>
      {modal && <Modal title="Add New Exam" onClose={()=>setModal(false)}>
        <FormGrid>
          <FormGroup label="Exam Name" full><FormInput placeholder="e.g. JEE Main"/></FormGroup>
          <FormGroup label="Conducting Body"><FormInput placeholder="e.g. NTA"/></FormGroup>
          <FormGroup label="Level"><select style={{ background:'var(--surface2)', border:'1.5px solid var(--border)', color:'var(--text)', borderRadius:10, padding:'9px 12px', fontSize:13.5, fontFamily:'Outfit', outline:'none', width:'100%' }}><option>8th</option><option>10th</option><option>12th</option><option>Graduate</option></select></FormGroup>
          <FormGroup label="Important Dates"><FormInput placeholder="e.g. Jan 30, 2025"/></FormGroup>
          <FormGroup label="Application Link" full><FormInput placeholder="https://"/></FormGroup>
          <FormGroup label="Official Website" full><FormInput placeholder="https://"/></FormGroup>
          <FormGroup label="Description" full><FormInput as="textarea" placeholder="Exam details, syllabus info..."/></FormGroup>
        </FormGrid>
        <FormActions onClose={()=>setModal(false)}/>
      </Modal>}
    </div>
  )
}
