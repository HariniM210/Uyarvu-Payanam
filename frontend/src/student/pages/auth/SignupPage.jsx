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
  const { login, isAuthenticated, student }  = useStudentAuth()
  const navigate   = useNavigate()

  // If already authenticated, redirect properly based on onboarding status
  React.useEffect(() => {
    if (isAuthenticated) {
      const isClass5 = student?.classLevel === '5th' || student?.classLevel === 'Class 5' || student?.classLevel === '5';
      const isClass8 = student?.classLevel === '8th' || student?.classLevel === 'Class 8' || student?.classLevel === '8';
      const isClass10 = student?.classLevel === '10th' || student?.classLevel === 'Class 10' || student?.classLevel === '10';
      const isClass12 = student?.classLevel === '12th' || student?.classLevel === 'Class 12' || student?.classLevel === '12';
      
      if ((isClass5 || isClass8 || isClass10 || isClass12) && student?.onboardingCompleted === false) {
        navigate('/student/onboarding', { replace: true })
      } else {
        navigate('/student/dashboard', { replace: true })
      }
    }
  }, [isAuthenticated, navigate, student])

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', classLevel: '10th', district: '' })
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [apiError, setApiError] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [regDisabled, setRegDisabled] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  React.useEffect(() => {
    const checkReg = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/settings/public', { timeout: 3000 })
        if (res.data && res.data.studentRegistration === false) {
          setRegDisabled(true)
        }
      } catch (e) {
        // If the check fails for any reason (server down, timeout, etc.)
        // default to allowing registration so the user isn't blocked
        console.warn('Could not check registration status, defaulting to open')
      } finally {
        setInitialLoading(false)
      }
    }
    checkReg()
  }, [])

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
      
      // Auto-login after successful signup
      const loginRes = await axios.post('http://localhost:5000/api/students/login', {
        email: form.email, password: form.password
      })
      
      localStorage.setItem('studentToken', loginRes.data.token)
      const studentData = loginRes.data.student
      login(loginRes.data.token, studentData)
      
      const isClass5 = studentData.classLevel === '5th' || studentData.classLevel === 'Class 5' || studentData.classLevel === '5';
      const isClass8 = studentData.classLevel === '8th' || studentData.classLevel === 'Class 8' || studentData.classLevel === '8';
      const isClass10 = studentData.classLevel === '10th' || studentData.classLevel === 'Class 10' || studentData.classLevel === '10';
      const isClass12 = studentData.classLevel === '12th' || studentData.classLevel === 'Class 12' || studentData.classLevel === '12';

      if ((isClass5 || isClass8 || isClass10 || isClass12) && studentData.onboardingCompleted === false) {
        navigate('/student/onboarding', { replace: true })
      } else {
        navigate('/student/dashboard', { replace: true })
      }
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
          <Link to="/student/home" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="Uyarvu Payanam" style={{ height: 44, width: 'auto', objectFit: 'contain', borderRadius: 12 }} />
            <span style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 22, color: 'var(--s-text)' }}>
              Uyarvu <span style={{ color: 'var(--s-primary)' }}>Payanam</span>
            </span>
          </Link>
        </div>

        <SCard style={{ padding: '36px 32px' }} className="s-anim-up">
          <h1 style={{ fontFamily: 'var(--s-font-display)', fontWeight: 800, fontSize: 22, color: 'var(--s-text)', marginBottom: 6, textAlign: 'center' }}>
            {regDisabled ? 'Registration Closed' : 'Create Your Account'}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--s-text3)', textAlign: 'center', marginBottom: 28 }}>
            {regDisabled ? 'New registrations are currently disabled by the administrator.' : 'Start your personalised career journey today'}
          </p>

          {initialLoading ? (
             <div style={{ textAlign: 'center', padding: '40px 0' }}>Checking registration status...</div>
          ) : regDisabled ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <FiUser size={48} style={{ color: 'var(--s-text3)', opacity: 0.2, marginBottom: 16 }} />
              <p style={{ color: 'var(--s-text2)', fontSize: 15, lineHeight: 1.6 }}>
                We are not accepting new signups at this moment. Please check back later or contact support if you have an existing account.
              </p>
              <SBtn variant="secondary" onClick={() => navigate('/student/signin')} style={{ marginTop: 24 }}>
                Back to Sign In
              </SBtn>
            </div>
          ) : (
            <>
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
                <Link to="/student/signin" style={{ color: 'var(--s-primary)', fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
              </p>
            </>
          )}
        </SCard>
      </div>
    </div>
  )
}
