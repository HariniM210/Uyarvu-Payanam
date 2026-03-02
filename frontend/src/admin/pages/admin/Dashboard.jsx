import React from 'react'
import { StatCard, Card, CardHeader, ProgressBar, ActivityDot } from '../../components/UI'

const months = ['Aug','Sep','Oct','Nov','Dec','Jan']
const values = [28,45,38,60,52,75]
const maxV = Math.max(...values)

export default function Dashboard() {
  return (
    <div style={{ animation:'fadeUp 0.4s ease both' }}>
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        <StatCard icon="👨‍🎓" value="2,847" label="Total Students"  delta="+12%" deltaUp color="#2d9e5f" />
        <StatCard icon="📘"   value="64"    label="Active Courses"  delta="+3"  deltaUp color="#3b82f6" />
        <StatCard icon="📝"   value="28"    label="Exams Listed"    delta="0"         color="#f59e0b" />
        <StatCard icon="🎓"   value="15"    label="Scholarships"    delta="-1"        color="#ef4444" />
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, marginBottom:24 }}>
        {/* Bar chart */}
        <Card>
          <CardHeader title="📈 Registration Growth" />
          <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:140, paddingBottom:4 }}>
            {months.map((m,i) => (
              <div key={m} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <span style={{ fontSize:11, fontWeight:700, color: i===5 ? 'var(--primary)' : 'var(--text3)' }}>{values[i]}</span>
                <div style={{ flex:1, width:'100%', display:'flex', alignItems:'flex-end' }}>
                  <div style={{ width:'100%', borderRadius:'6px 6px 0 0',
                    height:`${(values[i]/maxV)*100}%`,
                    background: i===5 ? 'var(--primary)' : 'var(--surface2)',
                    border: i===5 ? 'none' : '1.5px solid var(--border)',
                    transition:'height 1s ease' }} />
                </div>
                <span style={{ fontSize:10, color:'var(--text3)' }}>{m}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Level distribution */}
        <Card>
          <CardHeader title="🎯 Level Distribution" />
          <ProgressBar label="Class 12th" pct={38} color="#ef4444" />
          <ProgressBar label="Class 10th" pct={30} color="#2d9e5f" />
          <ProgressBar label="Class 8th"  pct={20} color="#f59e0b" />
          <ProgressBar label="Class 5th"  pct={12} color="#8b5cf6" />
        </Card>
      </div>

      {/* Bottom row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Activity */}
        <Card>
          <CardHeader title="⚡ Recent Activity" actionLabel="View All" action={() => {}} />
          {[
            { text:'New student registered – Priya Sharma (12th)', time:'2 min ago', color:'#22c55e' },
            { text:'JEE Main exam deadline updated', time:'1 hr ago', color:'#f59e0b' },
            { text:'NSP Scholarship reminder sent to 340 students', time:'3 hrs ago', color:'#2d9e5f' },
            { text:'IIT Bombay cutoff data uploaded (2024)', time:'Yesterday', color:'#ef4444' },
            { text:'New course added – Coding Foundations', time:'2 days ago', color:'#3b82f6' },
          ].map((a,i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12,
              padding:'10px 0', borderBottom: i<4 ? '1px solid var(--border)' : 'none' }}>
              <ActivityDot color={a.color} />
              <div>
                <div style={{ fontSize:13, color:'var(--text2)' }}>{a.text}</div>
                <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Popular Careers */}
        <Card>
          <CardHeader title="🏆 Popular Careers" />
          {[
            { name:'Engineering', count:1040, color:'#2d9e5f' },
            { name:'Medicine',    count:680,  color:'#ef4444' },
            { name:'Commerce',    count:420,  color:'#f59e0b' },
            { name:'Arts & Design',count:380, color:'#8b5cf6' },
            { name:'Govt. Jobs',  count:327,  color:'#3b82f6' },
          ].map(c => (
            <ProgressBar key={c.name} label={c.name} value={c.count} max={1040} color={c.color} />
          ))}
        </Card>
      </div>
    </div>
  )
}
