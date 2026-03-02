import React, { useState } from 'react'
import { Card, LevelBadge, DataTable, TR, TD, ActionBtn, FiltersRow, SearchInput, FilterSelect, PrimaryBtn, Modal, FormGrid, FormGroup, FormInput, FormActions } from '../../components/UI'

const COLLEGES = [
  { id:1, name:'IIT Bombay',  location:'Mumbai',  state:'Maharashtra', fees:'₹2.5L/yr',  placement:'98%',  rank:'#1' },
  { id:2, name:'AIIMS Delhi', location:'Delhi',   state:'Delhi',       fees:'₹1.6K/yr',  placement:'100%', rank:'#1 Med' },
  { id:3, name:'NIT Trichy',  location:'Trichy',  state:'Tamil Nadu',  fees:'₹1.4L/yr',  placement:'92%',  rank:'#8' },
  { id:4, name:'IIT Madras',  location:'Chennai', state:'Tamil Nadu',  fees:'₹2.3L/yr',  placement:'97%',  rank:'#2' },
]

export default function CollegesPage() {
  const [modal, setModal] = useState(false)
  return (
    <div style={{ animation:'fadeUp 0.4s ease both' }}>
      <FiltersRow>
        <SearchInput placeholder="🔍 Search colleges..."/>
        <FilterSelect><option>All States</option><option>Maharashtra</option><option>Delhi</option><option>Tamil Nadu</option></FilterSelect>
        <PrimaryBtn style={{ marginLeft:'auto' }} onClick={()=>setModal(true)}>+ Add College</PrimaryBtn>
      </FiltersRow>
      <Card>
        <DataTable columns={['College Name','Location','State','Fees / yr','Placement','Rank','Actions']} data={COLLEGES} renderRow={(c)=>(
          <TR key={c.id}>
            <TD><div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:10, background:'var(--primary-l)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏫</div>
              <span style={{ fontWeight:600, color:'var(--text)' }}>{c.name}</span>
            </div></TD>
            <TD style={{ color:'var(--text3)' }}>{c.location}</TD>
            <TD style={{ color:'var(--text3)' }}>{c.state}</TD>
            <TD style={{ color:'#22c55e', fontWeight:600 }}>{c.fees}</TD>
            <TD><LevelBadge level={c.placement}/></TD>
            <TD><span style={{ color:'var(--primary)', fontWeight:800, fontFamily:'Nunito' }}>{c.rank}</span></TD>
            <TD><div style={{ display:'flex', gap:6 }}><ActionBtn>✏️ Edit</ActionBtn><ActionBtn danger>🗑 Delete</ActionBtn></div></TD>
          </TR>
        )}/>
      </Card>
      {modal && <Modal title="Add New College" onClose={()=>setModal(false)}>
        <FormGrid>
          <FormGroup label="College Name" full><FormInput placeholder="e.g. IIT Bombay"/></FormGroup>
          <FormGroup label="Location"><FormInput placeholder="e.g. Mumbai"/></FormGroup>
          <FormGroup label="State"><FormInput placeholder="e.g. Maharashtra"/></FormGroup>
          <FormGroup label="Fees per Year"><FormInput placeholder="e.g. ₹2.5L"/></FormGroup>
          <FormGroup label="Placement %"><FormInput placeholder="e.g. 98%"/></FormGroup>
          <FormGroup label="Ranking"><FormInput placeholder="e.g. #1"/></FormGroup>
          <FormGroup label="Website" full><FormInput placeholder="https://"/></FormGroup>
          <FormGroup label="Courses Offered" full><FormInput as="textarea" placeholder="List courses offered..."/></FormGroup>
        </FormGrid>
        <FormActions onClose={()=>setModal(false)}/>
      </Modal>}
    </div>
  )
}
