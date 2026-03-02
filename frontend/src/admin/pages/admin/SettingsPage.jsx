import React, { useState } from 'react'
import { Card, Toggle } from '../../components/UI'

function SettingsRow({ icon, label, desc, toggle, on, onClick }) {
  return (
    <div style={{ background:'var(--surface2)', border:'1.5px solid var(--border)',
      borderRadius:12, padding:'14px 16px', display:'flex', alignItems:'center',
      gap:14, marginBottom:10 }}>
      <span style={{ fontSize:22 }}>{icon}</span>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:600, color:'var(--text)', marginBottom:2 }}>{label}</div>
        <div style={{ fontSize:12, color:'var(--text3)' }}>{desc}</div>
      </div>
      {toggle && <Toggle on={on} onClick={onClick}/>}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontFamily:'Nunito', fontSize:15, fontWeight:800, color:'var(--text)',
      marginBottom:14, marginTop:28, display:'flex', alignItems:'center', gap:8 }}>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const [t, setT] = useState({ reg:true, notif:true, maintenance:false, twofa:true, analytics:true })
  const tog = k => setT(s => ({...s, [k]:!s[k]}))

  return (
    <div style={{ maxWidth:700, animation:'fadeUp 0.4s ease both' }}>
      <SectionTitle>🔐 Security Settings</SectionTitle>
      <SettingsRow icon="🔐" label="Two-Factor Authentication" desc="Require 2FA code + secret key on every login" toggle on={t.twofa} onClick={()=>tog('twofa')}/>
      <SettingsRow icon="🛡️" label="Maintenance Mode" desc="Temporarily disable student access to the platform" toggle on={t.maintenance} onClick={()=>tog('maintenance')}/>

      <SectionTitle>⚙️ System Controls</SectionTitle>
      <SettingsRow icon="📝" label="Student Registration" desc="Allow new students to register on the platform" toggle on={t.reg} onClick={()=>tog('reg')}/>
      <SettingsRow icon="🔔" label="Push Notifications" desc="Send deadline reminders and alerts to students" toggle on={t.notif} onClick={()=>tog('notif')}/>
      <SettingsRow icon="📊" label="Analytics Tracking" desc="Track student engagement and platform usage" toggle on={t.analytics} onClick={()=>tog('analytics')}/>

      <SectionTitle>👤 Change Password</SectionTitle>
      <Card>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:16 }}>
          {['Current password','New password','Confirm new password'].map(p => (
            <div key={p} style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={{ fontSize:11, fontWeight:700, color:'var(--text3)', letterSpacing:'0.5px', textTransform:'uppercase' }}>{p}</label>
              <input type="password" placeholder="••••••••"
                style={{ background:'var(--surface2)', border:'1.5px solid var(--border)', color:'var(--text)',
                  borderRadius:10, padding:'9px 12px', fontSize:13.5, fontFamily:'Outfit', outline:'none' }}
                onFocus={e=>e.target.style.borderColor='var(--primary)'}
                onBlur={e=>e.target.style.borderColor='var(--border)'} />
            </div>
          ))}
        </div>
        <button style={{ padding:'10px 22px', background:'var(--primary)', border:'none', borderRadius:10,
          color:'#fff', fontFamily:'Nunito', fontWeight:800, fontSize:14, cursor:'pointer' }}>
          🔑 Update Password
        </button>
      </Card>

      <SectionTitle>👥 Sub-Admin Management</SectionTitle>
      <Card>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <span style={{ fontSize:13.5, color:'var(--text2)' }}>No sub-admins added yet.</span>
          <button style={{ padding:'8px 16px', background:'var(--primary-l)', border:'1.5px solid var(--border2)',
            borderRadius:10, color:'var(--primary)', fontFamily:'Nunito', fontWeight:700, fontSize:13, cursor:'pointer' }}>
            + Add Sub-Admin
          </button>
        </div>
        <div style={{ fontSize:12, color:'var(--text4)', borderTop:'1px solid var(--border)', paddingTop:12 }}>
          Sub-admins can manage content but cannot access system settings or delete other admins.
        </div>
      </Card>
    </div>
  )
}
