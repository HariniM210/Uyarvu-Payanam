import React, { useState } from 'react'

/* ── Level Badge ── */
export function LevelBadge({ level }) {
  const map = {
    '5th':      { bg:'rgba(139,92,246,0.12)',  color:'#7c3aed' },
    '8th':      { bg:'rgba(245,158,11,0.12)',  color:'#d97706' },
    '10th':     { bg:'rgba(45,158,95,0.12)',   color:'#2d9e5f' },
    '12th':     { bg:'rgba(239,68,68,0.12)',   color:'#dc2626' },
    'Graduate': { bg:'rgba(59,130,246,0.12)',  color:'#2563eb' },
    'All':      { bg:'rgba(45,158,95,0.12)',   color:'#2d9e5f' },
    'Active':   { bg:'rgba(34,197,94,0.12)',   color:'#16a34a' },
    'Expired':  { bg:'rgba(239,68,68,0.12)',   color:'#dc2626' },
    'Blocked':  { bg:'rgba(239,68,68,0.12)',   color:'#dc2626' },
  }
  const s = map[level] || { bg:'rgba(45,158,95,0.1)', color:'#2d9e5f' }
  return (
    <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:20,
      fontSize:11, fontWeight:700, background:s.bg, color:s.color, whiteSpace:'nowrap' }}>
      {level}
    </span>
  )
}

/* ── Card ── */
export function Card({ children, style }) {
  return (
    <div style={{ background:'var(--surface)', border:'1.5px solid var(--border)',
      borderRadius:16, padding:20, ...style }}>
      {children}
    </div>
  )
}

/* ── Card Header ── */
export function CardHeader({ title, action, actionLabel = 'View All' }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
      <h3 style={{ fontFamily:'Nunito', fontSize:15, fontWeight:800, color:'var(--text)' }}>{title}</h3>
      {action && <span onClick={action} style={{ fontSize:12, color:'var(--primary)', cursor:'pointer', fontWeight:600 }}>{actionLabel}</span>}
    </div>
  )
}

/* ── Stats Card ── */
export function StatCard({ icon, value, label, delta, deltaUp, color }) {
  return (
    <div style={{ background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:16,
      padding:20, position:'relative', overflow:'hidden', transition:'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
      <div style={{ position:'absolute', right:-16, bottom:-16, width:72, height:72,
        borderRadius:'50%', background:color, opacity:0.07 }} />
      <div style={{ fontSize:24, marginBottom:10 }}>{icon}</div>
      <div style={{ fontFamily:'Nunito', fontSize:28, fontWeight:900, color }}>{value}</div>
      <div style={{ fontSize:12, color:'var(--text3)', marginTop:3 }}>{label}</div>
      {delta && (
        <span style={{ position:'absolute', top:14, right:14, fontSize:11, fontWeight:700,
          padding:'3px 8px', borderRadius:20,
          background: deltaUp ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          color: deltaUp ? '#16a34a' : '#dc2626' }}>{delta}</span>
      )}
    </div>
  )
}

/* ── Progress Bar ── */
export function ProgressBar({ label, value, max, color, pct }) {
  const percent = pct !== undefined ? pct : Math.round((value / max) * 100)
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:13 }}>
        <span style={{ color:'var(--text2)' }}>{label}</span>
        <span style={{ fontWeight:700, color }}>{pct !== undefined ? `${pct}%` : value}</span>
      </div>
      <div style={{ height:7, background:'var(--surface2)', borderRadius:10, overflow:'hidden', border:'1px solid var(--border)' }}>
        <div style={{ height:'100%', width:`${percent}%`, background:color, borderRadius:10, transition:'width 1s ease' }} />
      </div>
    </div>
  )
}

/* ── Table Wrapper ── */
export function DataTable({ columns, data, renderRow }) {
  return (
    <div style={{ overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ borderBottom:'1.5px solid var(--border)' }}>
            {columns.map(c => (
              <th key={c} style={{ padding:'10px 14px', textAlign:'left', fontSize:10.5,
                fontWeight:700, color:'var(--text3)', letterSpacing:'0.8px', textTransform:'uppercase' }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map((row, i) => renderRow(row, i))}</tbody>
      </table>
    </div>
  )
}

/* ── Table Row ── */
export function TR({ children, style }) {
  const [hov, setHov] = useState(false)
  return (
    <tr style={{ borderBottom:'1px solid rgba(212,235,215,0.4)', background: hov ? 'var(--surface2)' : 'transparent',
      transition:'background 0.15s', ...style }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      {children}
    </tr>
  )
}

export function TD({ children, style }) {
  return <td style={{ padding:'12px 14px', fontSize:13.5, verticalAlign:'middle', ...style }}>{children}</td>
}


/* ── Action Button ── */
export function ActionBtn({ children, danger, onClick, style }) {
  const [hov, setHov] = useState(false)

  const btnStyle = {
    border: `1.5px solid ${hov ? (danger ? '#dc2626' : 'var(--primary)') : 'var(--border)'}`,
    borderRadius: 8,
    padding: '5px 11px',
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: 600,
    transition: 'all 0.15s',
    color: hov ? (danger ? '#dc2626' : 'var(--primary)') : 'var(--text3)',
    background: hov ? (danger ? 'rgba(239,68,68,0.06)' : 'var(--primary-l)') : 'transparent',
    ...style,
  }

  return (
    <button
      onClick={onClick}
      style={btnStyle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </button>
  )
}
/* ── Filters Row ── */
export function FiltersRow({ children }) {
  return <div style={{ display:'flex', gap:10, marginBottom:20, alignItems:'center', flexWrap:'wrap' }}>{children}</div>
}

export function SearchInput({ placeholder, value, onChange }) {
  return (
    <input placeholder={placeholder || '🔍 Search...'}
      value={value} onChange={onChange}
      style={{ background:'var(--surface)', border:'1.5px solid var(--border)', color:'var(--text)',
        borderRadius:10, padding:'9px 14px', fontSize:13, fontFamily:'Outfit,sans-serif',
        outline:'none', width:240, transition:'border-color 0.15s' }}
      onFocus={e => e.target.style.borderColor='var(--primary)'}
      onBlur={e => e.target.style.borderColor='var(--border)'} />
  )
}

export function FilterSelect({ children, value, onChange }) {
  return (
    <select value={value} onChange={onChange}
      style={{ background:'var(--surface)', border:'1.5px solid var(--border)', color:'var(--text2)',
        borderRadius:10, padding:'9px 14px', fontSize:13, fontFamily:'Outfit,sans-serif',
        outline:'none', cursor:'pointer' }}>
      {children}
    </select>
  )
}

export function PrimaryBtn({ children, onClick, style }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick}
      style={{ background: hov ? 'var(--primary-d)' : 'var(--primary)',
        border:'none', borderRadius:10, padding:'9px 18px', color:'#fff',
        fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:13.5,
        cursor:'pointer', display:'flex', alignItems:'center', gap:6,
        boxShadow: hov ? '0 6px 20px var(--primary-glow)' : '0 2px 8px var(--primary-glow)',
        transform: hov ? 'translateY(-1px)' : 'none', transition:'all 0.15s', ...style }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      {children}
    </button>
  )
}

/* ── Modal ── */
export function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
      backdropFilter:'blur(4px)', zIndex:200, display:'flex',
      alignItems:'center', justifyContent:'center', animation:'fadeIn 0.15s ease' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'var(--surface)', border:'1.5px solid var(--border)',
        borderRadius:20, padding:32, width:560, maxWidth:'95vw', maxHeight:'85vh',
        overflowY:'auto', animation:'scaleIn 0.2s ease',
        boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <h3 style={{ fontFamily:'Nunito', fontSize:20, fontWeight:800, color:'var(--text)' }}>{title}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none',
            fontSize:20, cursor:'pointer', color:'var(--text3)', padding:4,
            borderRadius:8, lineHeight:1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ── Modal Form Grid ── */
export function FormGrid({ children }) {
  return <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>{children}</div>
}

export function FormGroup({ label, full, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6,
      gridColumn: full ? '1/-1' : undefined }}>
      <label style={{ fontSize:11, fontWeight:700, color:'var(--text3)',
        letterSpacing:'0.5px', textTransform:'uppercase' }}>{label}</label>
      {children}
    </div>
  )
}

export function FormInput({ type='text', placeholder, as='input' }) {
  const base = { width:'100%', background:'var(--surface2)', border:'1.5px solid var(--border)',
    color:'var(--text)', borderRadius:10, padding:'9px 12px', fontSize:13.5,
    fontFamily:'Outfit,sans-serif', outline:'none', transition:'border-color 0.15s' }
  if (as === 'textarea') return (
    <textarea placeholder={placeholder} style={{ ...base, resize:'vertical', minHeight:80 }}
      onFocus={e => e.target.style.borderColor='var(--primary)'}
      onBlur={e => e.target.style.borderColor='var(--border)'} />
  )
  if (as === 'select') return null
  return (
    <input type={type} placeholder={placeholder} style={base}
      onFocus={e => e.target.style.borderColor='var(--primary)'}
      onBlur={e => e.target.style.borderColor='var(--border)'} />
  )
}

export function FormActions({ onClose }) {
  return (
    <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:24 }}>
      <button onClick={onClose}
        style={{ padding:'9px 20px', borderRadius:10, background:'none',
          border:'1.5px solid var(--border)', color:'var(--text2)',
          fontFamily:'Outfit,sans-serif', fontWeight:600, fontSize:13.5, cursor:'pointer' }}>
        Cancel
      </button>
      <button onClick={onClose}
        style={{ padding:'9px 20px', borderRadius:10, background:'var(--primary)',
          border:'none', color:'#fff', fontFamily:'Nunito,sans-serif', fontWeight:800,
          fontSize:13.5, cursor:'pointer' }}>
        Save Changes
      </button>
    </div>
  )
}

/* ── Toggle Switch ── */
export function Toggle({ on, onClick }) {
  return (
    <div onClick={onClick}
      style={{ width:42, height:24, borderRadius:20, cursor:'pointer', position:'relative',
        background: on ? 'var(--primary)' : 'var(--border)', transition:'background 0.2s',
        flexShrink:0, boxShadow: on ? '0 0 0 3px var(--primary-glow)' : 'none' }}>
      <div style={{ position:'absolute', width:18, height:18, background:'#fff',
        borderRadius:'50%', top:3, left: on ? 21 : 3, transition:'left 0.2s',
        boxShadow:'0 2px 4px rgba(0,0,0,0.2)' }} />
    </div>
  )
}

/* ── Mini Activity Dot ── */
export function ActivityDot({ color }) {
  return <div style={{ width:8, height:8, borderRadius:'50%', background:color, flexShrink:0, marginTop:5 }} />
}
