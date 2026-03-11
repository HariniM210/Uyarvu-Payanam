import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStudentAuth } from '../../context/StudentAuthContext'
import axios from 'axios'
import { authService } from '../../services'
import { SBtn, SInput, SSelect, SAlert, SCard, SDivider } from '../../components/ui'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

const CLASS_LEVELS = ['5th','6th','7th','8th','9th','10th','11th','12th','Undergraduate','Graduate']
const TN_DISTRICTS = [
  'Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Erode',
  'Tirunelveli','Vellore','Thanjavur','Dindigul','Kanchipuram','Namakkal',
  'Dharmapuri','Krishnagiri','Karur','Thoothukudi','Tiruppur',
  'Tiruvannamalai','Cuddalore','Nagapattinam','Others',
]

export default function SignupPage() {
  const { login }  = useStudentAuth()
  const navigate   = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', classLevel: '10th', district: '' })
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [apiError, setApiError] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim())                        e.name            = 'Full name is required'
    if (!form.email)                              e.email           = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email))   e.email           = 'Invalid email address'
    if (!form.password)                           e.password        = 'Password is required'
    else if (form.password.length < 6)            e.password        = 'Minimum 6 characters'
    if (form.password !== form.confirmPassword)   e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setApiError('')
    try {
      await axios.post('http://localhost:5000/api/students/register', {
        name: form.name, email: form.email,
        password: form.password, classLevel: form.classLevel,
        district: form.district,
      })
      alert("Signup successful");
      navigate('/student/login')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
    setApiError('')
  }

  return (
    <div className="student-root" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(140deg,#f7f6f3 0%,#eaf3ee 100%)',
      padding: '80px 20px 40px',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/student" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--s-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21 }}>🗺️</div>
            <span style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 22, color: 'var(--s-text)' }}>
              Career<span style={{ color: 'var(--s-primary)' }}>Map</span>
            </span>
          </Link>
        </div>

        <SCard style={{ padding: '36px 32px' }} className="s-anim-up">
          <h1 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 22, color: 'var(--s-text)', marginBottom: 6, textAlign: 'center' }}>
            Create Your Account
          </h1>
          <p style={{ fontSize: 14, color: 'var(--s-text3)', textAlign: 'center', marginBottom: 28 }}>
            Start your personalised career journey today
          </p>

          {apiError && (
            <div style={{ marginBottom: 18 }}>
              <SAlert type="error" onClose={() => setApiError('')}>{apiError}</SAlert>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SInput label="Full Name" placeholder="Your full name" icon={<FiUser />} value={form.name} onChange={set('name')} error={errors.name} />
            <SInput label="Email Address" type="email" placeholder="you@email.com" icon={<FiMail />} value={form.email} onChange={set('email')} error={errors.email} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="s-grid-2col">
              <div style={{ position: 'relative' }}>
                <SInput
                  label="Password" type={showPwd ? 'text' : 'password'}
                  placeholder="Min 6 chars" icon={<FiLock />}
                  value={form.password} onChange={set('password')} error={errors.password}
                />
                <button type="button" onClick={() => setShowPwd(s => !s)} style={{
                  position: 'absolute', right: 12,
                  top: errors.password ? 30 : '50%',
                  transform: errors.password ? 'none' : 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--s-text3)', padding: 0,
                }}>
                  {showPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              <SInput label="Confirm Password" type={showPwd ? 'text' : 'password'} placeholder="Repeat password" icon={<FiLock />} value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="s-grid-2col">
              <SSelect label="Class Level" value={form.classLevel} onChange={set('classLevel')}>
                {CLASS_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </SSelect>
              <SSelect label="District" value={form.district} onChange={set('district')}>
                <option value="">Select district</option>
                {TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </SSelect>
            </div>
            <SBtn type="submit" variant="primary" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }} disabled={loading}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </SBtn>
          </form>

          <SDivider label="or" />
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--s-text3)' }}>
            Already have an account?{' '}
            <Link to="/student/login" style={{ color: 'var(--s-primary)', fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
          </p>
        </SCard>
      </div>
    </div>
  )
}
