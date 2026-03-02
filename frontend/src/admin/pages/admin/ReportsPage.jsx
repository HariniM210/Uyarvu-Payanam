import React from 'react'
import { Card, CardHeader, ActionBtn } from '../../components/UI'

const months = ['Aug','Sep','Oct','Nov','Dec','Jan']
const regs    = [120,185,143,240,210,305]
const maxR    = Math.max(...regs)

export default function ReportsPage() {
  return (
    <div style={{ animation:'fadeUp 0.4s ease both' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        {[
          { icon:'👨‍🎓', title:'Registration Report',  desc:'All students by level & date',       color:'#2d9e5f' },
          { icon:'📘', title:'Popular Courses',       desc:'Most selected courses this month',    color:'#3b82f6' },
          { icon:'🎓', title:'Scholarship Trends',    desc:'Application & deadline tracking',     color:'#f59e0b' },
        ].map((r,i) => (
          <Card key={i} style={{ cursor:'pointer', borderTop:`3px solid ${r.color}` }}>
            <div style={{ fontSize:32, marginBottom:12 }}>{r.icon}</div>
            <div style={{ fontFamily:'Nunito', fontWeight:800, fontSize:15, marginBottom:5, color:'var(--text)' }}>{r.title}</div>
            <div style={{ fontSize:12.5, color:'var(--text3)', marginBottom:18, lineHeight:1.6 }}>{r.desc}</div>
            <div style={{ display:'flex', gap:8 }}>
              <ActionBtn style={{ flex:1, justifyContent:'center', textAlign:'center' }}>📄 PDF</ActionBtn>
              <ActionBtn style={{ flex:1, justifyContent:'center', textAlign:'center' }}>📊 Excel</ActionBtn>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="📈 6-Month Registration Analytics" />
        <div style={{ display:'flex', alignItems:'flex-end', gap:10, height:180, paddingBottom:4 }}>
          {months.map((m,i) => (
            <div key={m} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:11.5, fontWeight:700, color: i===5 ? 'var(--primary)' : 'var(--text3)' }}>{regs[i]}</span>
              <div style={{ flex:1, width:'100%', display:'flex', alignItems:'flex-end' }}>
                <div style={{ width:'100%', borderRadius:'8px 8px 0 0',
                  height:`${(regs[i]/maxR)*100}%`,
                  background: i===5
                    ? 'linear-gradient(180deg, var(--primary) 0%, var(--primary-d) 100%)'
                    : 'var(--surface2)',
                  border: i===5 ? 'none' : '1.5px solid var(--border)',
                  transition:'height 1s ease', minHeight:4 }} />
              </div>
              <span style={{ fontSize:11, color:'var(--text3)', fontWeight:600 }}>{m}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
