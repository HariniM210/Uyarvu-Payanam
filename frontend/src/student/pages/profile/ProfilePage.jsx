import React, { useState } from 'react'
import { useStudentAuth } from '../../context/StudentAuthContext'
import { authService } from '../../services'
import { SCard, SBtn, SInput, SSelect, SAlert, SBadge } from '../../components/ui'
import { FiUser, FiMail, FiPhone, FiMapPin, FiBookOpen, FiEdit2, FiSave, FiX } from 'react-icons/fi'

const LEVELS    = ['5th','6th','7th','8th','9th','10th','11th','12th','Undergraduate','Graduate']
const DISTRICTS = ['Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Erode','Tirunelveli','Vellore','Thanjavur','Dindigul','Kanchipuram','Namakkal','Others']
const INTERESTS = ['Engineering','Medical','Arts & Science','Government Services','Design','Business','Law','Skill Based','Not sure yet']

export default function ProfilePage() {
  const { student, updateStudent } = useStudentAuth()

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name:           student?.name           || '',
    phone:          student?.phone          || '',
    classLevel:     student?.classLevel     || '10th',
    district:       student?.district       || '',
    careerInterest: student?.careerInterest || '',
  })
  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState('')
  const [error,   setError]   = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await authService.updateProfile(form)
      updateStudent(res.student || res.data || form)
      setSuccess('Profile updated successfully!')
      setEditing(false)
      setTimeout(() => setSuccess(''), 3500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setForm({
      name:           student?.name           || '',
      phone:          student?.phone          || '',
      classLevel:     student?.classLevel     || '10th',
      district:       student?.district       || '',
      careerInterest: student?.careerInterest || '',
    })
    setEditing(false)
    setError('')
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  const initials = student?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'S'

  const INFO_ROWS = [
    { icon: <FiUser size={15} />,    label: 'Full Name',       value: student?.name           || '—'                },
    { icon: <FiMail size={15} />,    label: 'Email',           value: student?.email          || '—'                },
    { icon: <FiPhone size={15} />,   label: 'Phone',           value: student?.phone          || 'Not provided'     },
    { icon: <FiBookOpen size={15} />,label: 'Class Level',     value: student?.classLevel ? `Class ${student.classLevel}` : '—' },
    { icon: <FiMapPin size={15} />,  label: 'District',        value: student?.district       || 'Not provided'     },
    { icon: <FiBookOpen size={15} />,label: 'Career Interest', value: student?.careerInterest || 'Not specified'    },
  ]

  return (
    <div className="student-root" style={{ padding: '32px 20px', maxWidth: 700, margin: '0 auto' }}>

      <h1 className="s-anim-up" style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 'clamp(22px,4vw,30px)', color: 'var(--s-text)', marginBottom: 26 }}>
        My Profile
      </h1>

      {success && <div style={{ marginBottom: 16 }}><SAlert type="success" onClose={() => setSuccess('')}>{success}</SAlert></div>}
      {error   && <div style={{ marginBottom: 16 }}><SAlert type="error"   onClose={() => setError('')}>{error}</SAlert></div>}

      {/* Avatar card */}
      <SCard className="s-anim-up" style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 20, padding: '24px', flexWrap: 'wrap' }}>
        <div style={{
          width: 68, height: 68, borderRadius: 18, background: 'var(--s-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 26, flexShrink: 0,
        }}>{initials}</div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <h2 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 20, color: 'var(--s-text)', marginBottom: 8 }}>
            {student?.name}
          </h2>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            <SBadge color="green" dot>Active</SBadge>
            {student?.classLevel     && <SBadge color="blue">Class {student.classLevel}</SBadge>}
            {student?.district       && <SBadge color="gray">{student.district}</SBadge>}
            {student?.careerInterest && <SBadge color="purple">{student.careerInterest}</SBadge>}
          </div>
        </div>
        {!editing && (
          <SBtn variant="outline" size="sm" onClick={() => setEditing(true)}>
            <FiEdit2 size={14} /> Edit Profile
          </SBtn>
        )}
      </SCard>

      {/* Info card */}
      <SCard className="s-anim-up s-d1" style={{ padding: '28px' }}>
        <h3 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 700, fontSize: 15, color: 'var(--s-text)', marginBottom: 22 }}>
          Personal Information
        </h3>

        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SInput label="Full Name"    placeholder="Your full name"   icon={<FiUser />}   value={form.name}  onChange={set('name')} />
            <SInput label="Phone Number" placeholder="+91 XXXXX XXXXX"  icon={<FiPhone />}  value={form.phone} onChange={set('phone')} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="s-grid-2col">
              <SSelect label="Class Level" value={form.classLevel} onChange={set('classLevel')}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </SSelect>
              <SSelect label="District" value={form.district} onChange={set('district')}>
                <option value="">Select district</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </SSelect>
            </div>
            <SSelect label="Career Interest" value={form.careerInterest} onChange={set('careerInterest')}>
              <option value="">Select your interest</option>
              {INTERESTS.map(i => <option key={i} value={i}>{i}</option>)}
            </SSelect>
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <SBtn variant="primary" onClick={handleSave} disabled={saving}>
                <FiSave size={14} /> {saving ? 'Saving...' : 'Save Changes'}
              </SBtn>
              <SBtn variant="ghost" onClick={handleCancel}>
                <FiX size={14} /> Cancel
              </SBtn>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
            {INFO_ROWS.map((row, i) => (
              <div key={i} style={{ padding: '13px 15px', background: 'var(--s-bg2)', borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--s-text3)', marginBottom: 5 }}>
                  {row.icon}
                  <span style={{ fontSize: 11.5, fontWeight: 700, fontFamily: 'var(--s-font-display)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {row.label}
                  </span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--s-text)' }}>{row.value}</div>
              </div>
            ))}
          </div>
        )}
      </SCard>

      <SCard className="s-anim-up s-d2" style={{ padding: '18px 22px', marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--s-text3)', marginBottom: 3 }}>Account Status</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#16a34a' }}>Active Student Account</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12.5, color: 'var(--s-text3)' }}>
            Member since {student?.createdAt ? new Date(student.createdAt).getFullYear() : new Date().getFullYear()}
          </div>
          {student?._id && (
            <div style={{ fontSize: 11.5, color: 'var(--s-text3)', marginTop: 2 }}>
              ID: {student._id.slice(-8)}
            </div>
          )}
        </div>
      </SCard>
    </div>
  )
}
