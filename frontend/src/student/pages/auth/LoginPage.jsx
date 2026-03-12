import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useStudentAuth } from '../../context/StudentAuthContext'
import axios from 'axios'
import { authService } from '../../services'
import { SBtn, SInput, SAlert, SCard, SDivider } from '../../components/ui'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function LoginPage() {
  const { login }  = useStudentAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const from       = location.state?.from?.pathname || '/student/dashboard'

  const [form,     setForm]     = useState({ email: '', password: '' })
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [apiError, setApiError] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email)                              e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email))   e.email    = 'Invalid email address'
    if (!form.password)                           e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setApiError('')
    try {
      const res = await axios.post('http://localhost:5000/api/students/login', form)
      localStorage.setItem('studentToken', res.data.token)
      login(res.data.token, res.data.student)
      navigate('/student/dashboard', { replace: true })
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Check your credentials.')
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
      <div style={{ width: '100%', maxWidth: 420 }}>
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
            Welcome Back
          </h1>
          <p style={{ fontSize: 14, color: 'var(--s-text3)', textAlign: 'center', marginBottom: 28 }}>
            Sign in to continue your career journey
          </p>

          {apiError && (
            <div style={{ marginBottom: 18 }}>
              <SAlert type="error" onClose={() => setApiError('')}>{apiError}</SAlert>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <SInput
              label="Email Address" type="email" placeholder="you@email.com"
              icon={<FiMail />} value={form.email}
              onChange={set('email')} error={errors.email}
            />
            <div style={{ position: 'relative' }}>
              <SInput
                label="Password"
                type={showPwd ? 'text' : 'password'}
                placeholder="Your password"
                icon={<FiLock />} value={form.password}
                onChange={set('password')} error={errors.password}
              />
              <button type="button" onClick={() => setShowPwd(s => !s)} style={{
                position: 'absolute', right: 12,
                top: errors.password ? 30 : '50%',
                transform: errors.password ? 'none' : 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--s-text3)', padding: 0,
              }}>
                {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            <SBtn type="submit" variant="primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} disabled={loading}>
              {loading ? 'Signing In…' : 'Sign In'}
            </SBtn>
          </form>

          <SDivider label="or" />
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--s-text3)' }}>
            Don't have an account?{' '}
            <Link to="/student/signup" style={{ color: 'var(--s-primary)', fontWeight: 700, textDecoration: 'none' }}>
              Create one free →
            </Link>
          </p>
        </SCard>
      </div>
    </div>
  )
}
