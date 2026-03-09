import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../config/axios'
import { Card, Toggle } from '../../components/UI'

const initialToggles = {
  twoFactorAuth: false,
  maintenanceMode: false,
  studentRegistration: true,
  pushNotifications: true,
  analyticsTracking: true,
}

function SettingsRow({ icon, label, desc, on, onClick, disabled }) {
  return (
    <div
      style={{
        background: 'var(--surface2)',
        border: '1.5px solid var(--border)',
        borderRadius: 12,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        marginBottom: 10,
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text3)' }}>{desc}</div>
      </div>
      <Toggle on={on} onClick={disabled ? undefined : onClick} />
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontFamily: 'Nunito',
        fontSize: 15,
        fontWeight: 800,
        color: 'var(--text)',
        marginBottom: 14,
        marginTop: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const [toggles, setToggles] = useState(initialToggles)
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState('')

  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwdSaving, setPwdSaving] = useState(false)

  const [subAdminForm, setSubAdminForm] = useState({ name: '', email: '', password: '' })
  const [subAdmins, setSubAdmins] = useState([])
  const [subAdminSaving, setSubAdminSaving] = useState(false)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const showMessage = (text) => {
    setMessage(text)
    setError('')
    setTimeout(() => setMessage(''), 3000)
  }

  const showError = (text) => {
    setError(text)
    setMessage('')
    setTimeout(() => setError(''), 4000)
  }

  const loadAll = async () => {
    try {
      setLoading(true)
      const [settingsRes, subAdminsRes] = await Promise.all([
        axiosInstance.get('/settings'),
        axiosInstance.get('/admin/subadmins'),
      ])

      const s = settingsRes.data || {}
      setToggles({
        twoFactorAuth: Boolean(s.twoFactorAuth),
        maintenanceMode: Boolean(s.maintenanceMode),
        studentRegistration: Boolean(s.studentRegistration),
        pushNotifications: Boolean(s.pushNotifications),
        analyticsTracking: Boolean(s.analyticsTracking),
      })

      setSubAdmins(subAdminsRes.data?.subAdmins || [])
    } catch (e) {
      showError(e.response?.data?.message || 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const updateToggle = async (key) => {
    const nextValue = !toggles[key]

    setToggles((prev) => ({ ...prev, [key]: nextValue }))
    setSavingKey(key)

    try {
      await axiosInstance.put('/settings/update', { [key]: nextValue })
      showMessage('Setting updated')
    } catch (e) {
      setToggles((prev) => ({ ...prev, [key]: !nextValue }))
      showError(e.response?.data?.message || 'Failed to update setting')
    } finally {
      setSavingKey('')
    }
  }

  const handleChangePassword = async () => {
    if (!pwd.currentPassword || !pwd.newPassword || !pwd.confirmPassword) {
      showError('Please fill all password fields')
      return
    }

    if (pwd.newPassword !== pwd.confirmPassword) {
      showError('New password and confirm password do not match')
      return
    }

    if (pwd.newPassword.length < 8) {
      showError('New password must be at least 8 characters')
      return
    }

    try {
      setPwdSaving(true)
      await axiosInstance.put('/admin/change-password', {
        currentPassword: pwd.currentPassword,
        newPassword: pwd.newPassword,
      })

      setPwd({ currentPassword: '', newPassword: '', confirmPassword: '' })
      showMessage('Password updated successfully')
    } catch (e) {
      showError(e.response?.data?.message || 'Failed to update password')
    } finally {
      setPwdSaving(false)
    }
  }

  const handleCreateSubAdmin = async () => {
    if (!subAdminForm.email || !subAdminForm.password) {
      showError('Email and password are required')
      return
    }

    try {
      setSubAdminSaving(true)
      await axiosInstance.post('/admin/create-subadmin', {
        name: subAdminForm.name || 'Sub Admin',
        email: subAdminForm.email,
        password: subAdminForm.password,
        permissions: {
          manageUsers: true,
          manageSettings: false,
          manageContent: true,
          manageNotifications: true,
          viewReports: true,
        },
      })

      setSubAdminForm({ name: '', email: '', password: '' })
      await loadAll()
      showMessage('Sub-admin created successfully')
    } catch (e) {
      showError(e.response?.data?.message || 'Failed to create sub-admin')
    } finally {
      setSubAdminSaving(false)
    }
  }

  const handleDeleteSubAdmin = async (id) => {
    try {
      await axiosInstance.delete(`/admin/subadmin/${id}`)
      setSubAdmins((prev) => prev.filter((a) => a._id !== id))
      showMessage('Sub-admin deleted')
    } catch (e) {
      showError(e.response?.data?.message || 'Failed to delete sub-admin')
    }
  }

  return (
    <div style={{ maxWidth: 900, animation: 'fadeUp 0.4s ease both' }}>
      {message && (
        <div style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a', border: '1px solid #16a34a', padding: '10px 12px', borderRadius: 10, marginBottom: 12, fontSize: 13, fontWeight: 600 }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.12)', color: '#dc2626', border: '1px solid #dc2626', padding: '10px 12px', borderRadius: 10, marginBottom: 12, fontSize: 13, fontWeight: 600 }}>
          {error}
        </div>
      )}

      <SectionTitle>Security Settings</SectionTitle>
      <SettingsRow icon="??" label="Two-Factor Authentication" desc="Require 2FA code + secret key on every login" on={toggles.twoFactorAuth} disabled={loading || savingKey === 'twoFactorAuth'} onClick={() => updateToggle('twoFactorAuth')} />
      <SettingsRow icon="???" label="Maintenance Mode" desc="Temporarily disable student access to the platform" on={toggles.maintenanceMode} disabled={loading || savingKey === 'maintenanceMode'} onClick={() => updateToggle('maintenanceMode')} />

      <SectionTitle>System Controls</SectionTitle>
      <SettingsRow icon="??" label="Student Registration" desc="Allow new students to register on the platform" on={toggles.studentRegistration} disabled={loading || savingKey === 'studentRegistration'} onClick={() => updateToggle('studentRegistration')} />
      <SettingsRow icon="??" label="Push Notifications" desc="Send deadline reminders and alerts to students" on={toggles.pushNotifications} disabled={loading || savingKey === 'pushNotifications'} onClick={() => updateToggle('pushNotifications')} />
      <SettingsRow icon="??" label="Analytics Tracking" desc="Track student engagement and platform usage" on={toggles.analyticsTracking} disabled={loading || savingKey === 'analyticsTracking'} onClick={() => updateToggle('analyticsTracking')} />

      <SectionTitle>Change Password</SectionTitle>
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          <input type="password" placeholder="Current password" value={pwd.currentPassword} onChange={(e) => setPwd((p) => ({ ...p, currentPassword: e.target.value }))} style={{ background: 'var(--surface2)', border: '1.5px solid var(--border)', color: 'var(--text)', borderRadius: 10, padding: '9px 12px', fontSize: 13.5, fontFamily: 'Outfit', outline: 'none' }} />
          <input type="password" placeholder="New password" value={pwd.newPassword} onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))} style={{ background: 'var(--surface2)', border: '1.5px solid var(--border)', color: 'var(--text)', borderRadius: 10, padding: '9px 12px', fontSize: 13.5, fontFamily: 'Outfit', outline: 'none' }} />
          <input type="password" placeholder="Confirm password" value={pwd.confirmPassword} onChange={(e) => setPwd((p) => ({ ...p, confirmPassword: e.target.value }))} style={{ background: 'var(--surface2)', border: '1.5px solid var(--border)', color: 'var(--text)', borderRadius: 10, padding: '9px 12px', fontSize: 13.5, fontFamily: 'Outfit', outline: 'none' }} />
        </div>
        <button onClick={handleChangePassword} disabled={pwdSaving} style={{ padding: '10px 22px', background: 'var(--primary)', border: 'none', borderRadius: 10, color: '#fff', fontFamily: 'Nunito', fontWeight: 800, fontSize: 14, cursor: pwdSaving ? 'not-allowed' : 'pointer', opacity: pwdSaving ? 0.7 : 1 }}>
          {pwdSaving ? 'Updating...' : 'Update Password'}
        </button>
      </Card>

      <SectionTitle>Sub-Admin Management</SectionTitle>
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, marginBottom: 14 }}>
          <input placeholder="Name" value={subAdminForm.name} onChange={(e) => setSubAdminForm((f) => ({ ...f, name: e.target.value }))} style={{ background: 'var(--surface2)', border: '1.5px solid var(--border)', color: 'var(--text)', borderRadius: 10, padding: '9px 12px', fontSize: 13.5, fontFamily: 'Outfit', outline: 'none' }} />
          <input placeholder="Email" value={subAdminForm.email} onChange={(e) => setSubAdminForm((f) => ({ ...f, email: e.target.value }))} style={{ background: 'var(--surface2)', border: '1.5px solid var(--border)', color: 'var(--text)', borderRadius: 10, padding: '9px 12px', fontSize: 13.5, fontFamily: 'Outfit', outline: 'none' }} />
          <input type="password" placeholder="Password" value={subAdminForm.password} onChange={(e) => setSubAdminForm((f) => ({ ...f, password: e.target.value }))} style={{ background: 'var(--surface2)', border: '1.5px solid var(--border)', color: 'var(--text)', borderRadius: 10, padding: '9px 12px', fontSize: 13.5, fontFamily: 'Outfit', outline: 'none' }} />
          <button onClick={handleCreateSubAdmin} disabled={subAdminSaving} style={{ padding: '10px 16px', background: 'var(--primary)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, cursor: subAdminSaving ? 'not-allowed' : 'pointer', opacity: subAdminSaving ? 0.7 : 1 }}>
            Add
          </button>
        </div>

        {subAdmins.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>No sub-admins added yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {subAdmins.map((a) => (
              <div key={a._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px' }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>{a.name || 'Sub Admin'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{a.email}</div>
                </div>
                <button onClick={() => handleDeleteSubAdmin(a._id)} style={{ border: '1px solid #dc2626', background: 'transparent', color: '#dc2626', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
