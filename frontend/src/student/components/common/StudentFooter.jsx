import React from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi'

const EXPLORE = [
  { to: '/class5',  label: 'Class 5'  },
  { to: '/class8',  label: 'Class 8'  },
  { to: '/class10', label: 'Class 10' },
  { to: '/class12', label: 'Class 12' },
  { to: '/careers',  label: 'All Paths' },
]

const QUICK = [
  { to: '/colleges',      label: 'College Finder' },
  { to: '/courses',       label: 'Courses'        },
  { to: '/notifications', label: 'Notifications'  },
  { to: '/signin',        label: 'Student Login'  },
]

export default function StudentFooter() {
  return (
    <footer style={{
      background: '#0c1520',
      color: '#94a3b8',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 24px 28px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40, marginBottom: 48,
        }}>
          {/* Brand */}
          <div>
            <Link to="/home" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span style={{
                  fontFamily: 'var(--s-font-display)', fontWeight: 800,
                  fontSize: 17, color: '#7dd3fc',
                }}>
                  Uyarvu Payanam
                </span>
                <span style={{
                  fontFamily: 'var(--s-font-display)', fontWeight: 600,
                  fontSize: 11, color: '#64748b',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  Career Guidance Platform
                </span>
              </div>
            </Link>
            <p style={{
              fontSize: 14, lineHeight: 1.7,
              color: '#64748b', maxWidth: 240, marginBottom: 20,
            }}>
              Empowering Tamil Nadu students with the right career guidance at every step.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[FiInstagram, FiTwitter, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#64748b', textDecoration: 'none',
                  transition: 'all 0.2s',
                }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 style={{
              fontFamily: 'var(--s-font-display)', fontWeight: 700,
              fontSize: 12, color: '#7dd3fc', marginBottom: 16,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              Explore
            </h4>
            {EXPLORE.map(l => (
              <Link key={l.to} to={l.to} style={{
                display: 'block', color: '#64748b',
                textDecoration: 'none', fontSize: 14, marginBottom: 10,
                transition: 'color 0.15s',
              }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--s-font-display)', fontWeight: 700,
              fontSize: 12, color: '#7dd3fc', marginBottom: 16,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              Quick Links
            </h4>
            {QUICK.map(l => (
              <Link key={l.to} to={l.to} style={{
                display: 'block', color: '#64748b',
                textDecoration: 'none', fontSize: 14, marginBottom: 10,
              }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontFamily: 'var(--s-font-display)', fontWeight: 700,
              fontSize: 12, color: '#7dd3fc', marginBottom: 16,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              Contact
            </h4>
            {[
              { Icon: FiMail,   text: 'support@uyarvupayanam.in' },
              { Icon: FiPhone,  text: '+91 98765 43210'          },
              { Icon: FiMapPin, text: 'Coimbatore, Tamil Nadu'   },
            ].map(({ Icon, text }, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                marginBottom: 12, fontSize: 14, color: '#64748b',
              }}>
                <Icon size={15} style={{ color: '#7dd3fc', flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 22, display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 10,
        }}>
          <p style={{ fontSize: 13, color: '#334155' }}>
            © {new Date().getFullYear()} Uyarvu Payanam. All rights reserved.
          </p>
          <p style={{ fontSize: 13, color: '#334155' }}>
            Guiding Tamil Nadu's future, one student at a time.
          </p>
        </div>
      </div>
    </footer>
  )
}
