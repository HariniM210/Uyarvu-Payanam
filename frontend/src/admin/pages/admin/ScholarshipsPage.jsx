import React, { useState } from 'react'
import { Card, LevelBadge, DataTable, TR, TD, ActionBtn, FiltersRow, SearchInput, FilterSelect, PrimaryBtn, Modal, FormGrid, FormGroup, FormInput, FormActions } from '../../components/UI'

const SCHOLARSHIPS = [
  { id:1, name:'NSP Pre-Matric',           level:'8th',  income:'₹1L/yr',   deadline:'Oct 2024', status:'Active' },
  { id:2, name:'NSP Post-Matric',          level:'12th', income:'₹2.5L/yr', deadline:'Nov 2024', status:'Active' },
  { id:3, name:'INSPIRE Scholarship',      level:'12th', income:'No Limit',  deadline:'Aug 2025', status:'Active' },
  { id:4, name:'CM Scholarship TN',        level:'10th', income:'₹1.8L/yr', deadline:'Dec 2024', status:'Expired' },
]

export default function ScholarshipsPage() {
  const [modal, setModal] = useState(false)
  return (
    <div style={{ animation:'fadeUp 0.4s ease both' }}>
      <FiltersRow>
        <SearchInput placeholder="🔍 Search scholarships..."/>
        <FilterSelect><option>All</option><option>5th</option><option>8th</option><option>10th</option><option>12th</option></FilterSelect>
        <PrimaryBtn style={{ marginLeft:'auto' }} onClick={()=>setModal(true)}>+ Add Scholarship</PrimaryBtn>
      </FiltersRow>
      <Card>
        <DataTable columns={['Scholarship Name','Level','Income Limit','Deadline','Status','Actions']} data={SCHOLARSHIPS} renderRow={(s)=>(
          <TR key={s.id}>
            <TD style={{ fontWeight:600, color:'var(--text)' }}>{s.name}</TD>
            <TD><LevelBadge level={s.level}/></TD>
            <TD style={{ color:'var(--text3)' }}>{s.income}</TD>
            <TD><span style={{ color:'#f59e0b', fontWeight:600, fontSize:12 }}>📅 {s.deadline}</span></TD>
            <TD><LevelBadge level={s.status}/></TD>
            <TD><div style={{ display:'flex', gap:6 }}>
              <ActionBtn>✏️ Edit</ActionBtn>
              <ActionBtn>🔔 Remind</ActionBtn>
              <ActionBtn danger>🗑 Delete</ActionBtn>
            </div></TD>
          </TR>
        )}/>
      </Card>
      {modal && <Modal title="Add New Scholarship" onClose={()=>setModal(false)}>
        <FormGrid>
          <FormGroup label="Scholarship Name" full><FormInput placeholder="e.g. NSP Pre-Matric"/></FormGroup>
          <FormGroup label="Level"><select style={{ background:'var(--surface2)', border:'1.5px solid var(--border)', color:'var(--text)', borderRadius:10, padding:'9px 12px', fontSize:13.5, fontFamily:'Outfit', outline:'none', width:'100%' }}><option>5th</option><option>8th</option><option>10th</option><option>12th</option></select></FormGroup>
          <FormGroup label="Income Limit"><FormInput placeholder="e.g. ₹1L/yr"/></FormGroup>
          <FormGroup label="Deadline"><FormInput placeholder="e.g. Oct 2024"/></FormGroup>
          <FormGroup label="Required Documents" full><FormInput as="textarea" placeholder="List required documents..."/></FormGroup>
          <FormGroup label="Application Link" full><FormInput placeholder="https://"/></FormGroup>
          <FormGroup label="Description" full><FormInput as="textarea" placeholder="Eligibility criteria..."/></FormGroup>
        </FormGrid>
        <FormActions onClose={()=>setModal(false)}/>
      </Modal>}
    </div>
  )
}
