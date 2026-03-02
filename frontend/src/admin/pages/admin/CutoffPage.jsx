import React, { useState } from 'react'
import { Card, DataTable, TR, TD, ActionBtn, FiltersRow, FilterSelect, PrimaryBtn, Modal, FormGrid, FormGroup, FormInput, FormActions } from '../../components/UI'

const CUTOFF = [
  { college:'IIT Bombay', course:'CSE',  year:2024, general:60.5, obc:54.0, sc:32.1, st:28.8 },
  { college:'IIT Madras', course:'ECE',  year:2024, general:55.2, obc:49.8, sc:28.4, st:24.2 },
  { college:'NIT Trichy', course:'Mech', year:2024, general:48.3, obc:43.5, sc:24.8, st:20.1 },
  { college:'AIIMS Delhi',course:'MBBS', year:2024, general:720,  obc:640,  sc:580,  st:520  },
]

function Mark({ v, color }) {
  return <span style={{ fontWeight:700, color, fontSize:13 }}>{v}</span>
}

export default function CutoffPage() {
  const [modal, setModal] = useState(false)
  return (
    <div style={{ animation:'fadeUp 0.4s ease both' }}>
      <FiltersRow>
        <FilterSelect><option>2024</option><option>2023</option><option>2022</option></FilterSelect>
        <FilterSelect><option>All States</option><option>Maharashtra</option><option>Tamil Nadu</option><option>Delhi</option></FilterSelect>
        <PrimaryBtn style={{ marginLeft:'auto' }} onClick={()=>setModal(true)}>+ Upload Cutoff</PrimaryBtn>
      </FiltersRow>
      <Card>
        <DataTable columns={['College','Course','Year','General','OBC','SC','ST','Actions']} data={CUTOFF} renderRow={(r,i)=>(
          <TR key={i}>
            <TD style={{ fontWeight:600, color:'var(--text)' }}>{r.college}</TD>
            <TD style={{ color:'var(--text3)' }}>{r.course}</TD>
            <TD style={{ color:'var(--text3)' }}>{r.year}</TD>
            <TD><Mark v={r.general} color="var(--primary)"/></TD>
            <TD><Mark v={r.obc}     color="#f59e0b"/></TD>
            <TD><Mark v={r.sc}      color="#3b82f6"/></TD>
            <TD><Mark v={r.st}      color="#ef4444"/></TD>
            <TD><ActionBtn>✏️ Edit</ActionBtn></TD>
          </TR>
        )}/>
      </Card>
      {modal && <Modal title="Upload Cutoff Data" onClose={()=>setModal(false)}>
        <FormGrid>
          <FormGroup label="College" full><FormInput placeholder="Select or type college name"/></FormGroup>
          <FormGroup label="Course"><FormInput placeholder="e.g. CSE, ECE"/></FormGroup>
          <FormGroup label="Year"><FormInput placeholder="e.g. 2024"/></FormGroup>
          <FormGroup label="General"><FormInput placeholder="Cutoff marks"/></FormGroup>
          <FormGroup label="OBC"><FormInput placeholder="Cutoff marks"/></FormGroup>
          <FormGroup label="SC"><FormInput placeholder="Cutoff marks"/></FormGroup>
          <FormGroup label="ST"><FormInput placeholder="Cutoff marks"/></FormGroup>
          <FormGroup label="State"><FormInput placeholder="e.g. Maharashtra"/></FormGroup>
        </FormGrid>
        <FormActions onClose={()=>setModal(false)}/>
      </Modal>}
    </div>
  )
}
