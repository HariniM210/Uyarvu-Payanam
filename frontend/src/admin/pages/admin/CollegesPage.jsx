import React, { useState, useEffect, useCallback } from 'react'
import { Card, LevelBadge, DataTable, TR, TD, ActionBtn, FiltersRow, SearchInput, FilterSelect, PrimaryBtn, Modal, FormGrid, FormGroup, FormInput, FormActions } from '../../components/UI'
import { adminService } from '../../../services/adminService'

const STREAMS = ['All', 'Engineering', 'Medical', 'Arts & Science', 'Law', 'Polytechnic', 'Agriculture', 'Others']

const TN_DISTRICTS = [
  'All', 'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
  'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram',
  'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
  'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi',
  'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
  'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur',
  'Vellore', 'Viluppuram', 'Virudhunagar'
]

const EMPTY_FORM = {
  collegeName: '',
  stream: 'Engineering',
  district: '',
  location: '',
  state: 'Tamil Nadu',
  feesPerYear: '',
  placementPercentage: '',
  rank: '',
  accreditation: '',
  coursesOffered: '',
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeStream, setActiveStream] = useState('All')
  const [activeDistrict, setActiveDistrict] = useState('All')

  // Modal state
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  // ── Fetch colleges ──
  const fetchColleges = useCallback(async () => {
    try {
      setLoading(true)
      const params = {}
      if (activeStream !== 'All') params.stream = activeStream
      if (activeDistrict !== 'All') params.district = activeDistrict
      if (search) params.search = search
      const res = await adminService.getColleges(params)
      setColleges(res.data || [])
    } catch (err) {
      console.error('Failed to fetch colleges:', err)
    } finally {
      setLoading(false)
    }
  }, [activeStream, activeDistrict, search])

  useEffect(() => {
    const delay = setTimeout(fetchColleges, 300)
    return () => clearTimeout(delay)
  }, [fetchColleges])

  // ── Form helpers ──
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setModal(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    setForm({
      collegeName: c.collegeName,
      stream: c.stream,
      district: c.district || '',
      location: c.location || '',
      state: c.state || '',
      feesPerYear: c.feesPerYear || '',
      placementPercentage: c.placementPercentage || '',
      rank: c.rank || '',
      accreditation: c.accreditation || '',
      coursesOffered: (c.coursesOffered || []).join(', '),
    })
    setModal(true)
  }

  const closeModal = () => {
    setModal(false)
    setEditing(null)
    setForm(EMPTY_FORM)
  }

  // ── Save (Create / Update) ──
  const handleSave = async () => {
    if (!form.collegeName || !form.stream) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        feesPerYear: form.feesPerYear ? Number(form.feesPerYear) : 0,
        placementPercentage: form.placementPercentage ? Number(form.placementPercentage) : 0,
        coursesOffered: form.coursesOffered
          ? form.coursesOffered.split(',').map(s => s.trim()).filter(Boolean)
          : [],
      }

      if (editing) {
        const res = await adminService.updateCollege(editing._id, payload)
        setColleges(prev => prev.map(c => c._id === editing._id ? res.data : c))
      } else {
        const res = await adminService.createCollege(payload)
        setColleges(prev => [res.data, ...prev])
      }
      closeModal()
    } catch (err) {
      console.error('Save college error:', err)
      alert(err.response?.data?.message || 'Failed to save college')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ──
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return
    try {
      await adminService.deleteCollege(id)
      setColleges(prev => prev.filter(c => c._id !== id))
    } catch (err) {
      console.error('Delete college error:', err)
      alert('Failed to delete college')
    }
  }

  // ── Format helpers ──
  const formatFees = (n) => {
    if (!n) return '\u2014'
    if (n >= 100000) return `\u20B9${(n / 100000).toFixed(1)}L/yr`
    if (n >= 1000) return `\u20B9${(n / 1000).toFixed(1)}K/yr`
    return `\u20B9${n}/yr`
  }

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>

      {/* ── Stream Tabs ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {STREAMS.map(s => (
          <button key={s} onClick={() => setActiveStream(s)}
            style={{
              padding: '7px 16px', borderRadius: 20, fontSize: 12.5, fontWeight: 700,
              fontFamily: 'Outfit,sans-serif', cursor: 'pointer', transition: 'all 0.15s',
              border: activeStream === s ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
              background: activeStream === s ? 'var(--primary)' : 'var(--surface)',
              color: activeStream === s ? '#fff' : 'var(--text2)',
            }}>
            {s}
          </button>
        ))}
      </div>

      {/* ── Search + District Filter + Count + Add ── */}
      <FiltersRow>
        <SearchInput placeholder="🔍 Search colleges..." value={search} onChange={e => setSearch(e.target.value)} />
        <FilterSelect value={activeDistrict} onChange={e => setActiveDistrict(e.target.value)}>
          {TN_DISTRICTS.map(d => (
            <option key={d} value={d}>{d === 'All' ? '📍 All Districts' : d}</option>
          ))}
        </FilterSelect>
        <span style={{ marginLeft: 8, fontSize: 13, color: 'var(--text3)' }}>
          Showing <strong style={{ color: 'var(--primary)' }}>{colleges.length}</strong> colleges
        </span>
        <PrimaryBtn style={{ marginLeft: 'auto' }} onClick={openAdd}>+ Add College</PrimaryBtn>
      </FiltersRow>

      {/* ── Table ── */}
      <Card>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>Loading colleges...</div>
        ) : colleges.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>No colleges found</div>
        ) : (
          <DataTable
            columns={['College Name', 'Stream', 'District', 'Location', 'Fees / yr', 'Rank', 'Actions']}
            data={colleges}
            renderRow={(c) => (
              <TR key={c._id}>
                <TD>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 10, background: 'var(--primary-l)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
                    }}>🏫</div>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{c.collegeName}</span>
                  </div>
                </TD>
                <TD><LevelBadge level={c.stream} /></TD>
                <TD style={{ color: 'var(--text2)', fontWeight: 500 }}>{c.district || '\u2014'}</TD>
                <TD style={{ color: 'var(--text3)' }}>{c.location || '\u2014'}{c.state ? `, ${c.state}` : ''}</TD>
                <TD style={{ color: '#22c55e', fontWeight: 600 }}>{formatFees(c.feesPerYear)}</TD>
                <TD><span style={{ color: 'var(--primary)', fontWeight: 800, fontFamily: 'Nunito' }}>{c.rank || '\u2014'}</span></TD>
                <TD>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <ActionBtn onClick={() => openEdit(c)}>✏️ Edit</ActionBtn>
                    <ActionBtn danger onClick={() => handleDelete(c._id, c.collegeName)}>🗑 Delete</ActionBtn>
                  </div>
                </TD>
              </TR>
            )}
          />
        )}
      </Card>

      {/* ── Add / Edit Modal ── */}
      {modal && (
        <Modal title={editing ? 'Edit College' : 'Add New College'} onClose={closeModal}>
          <FormGrid>
            <FormGroup label="College Name" full>
              <FormInput name="collegeName" value={form.collegeName} onChange={handleChange} placeholder="e.g. IIT Madras" />
            </FormGroup>
            <FormGroup label="Stream">
              <select name="stream" value={form.stream} onChange={handleChange}
                style={{
                  width: '100%', background: 'var(--surface2)', border: '1.5px solid var(--border)',
                  color: 'var(--text)', borderRadius: 10, padding: '9px 12px', fontSize: 13.5,
                  fontFamily: 'Outfit,sans-serif', outline: 'none'
                }}>
                {STREAMS.filter(s => s !== 'All').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </FormGroup>
            <FormGroup label="District">
              <select name="district" value={form.district} onChange={handleChange}
                style={{
                  width: '100%', background: 'var(--surface2)', border: '1.5px solid var(--border)',
                  color: 'var(--text)', borderRadius: 10, padding: '9px 12px', fontSize: 13.5,
                  fontFamily: 'Outfit,sans-serif', outline: 'none'
                }}>
                <option value="">Select District</option>
                {TN_DISTRICTS.filter(d => d !== 'All').map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </FormGroup>
            <FormGroup label="Location">
              <FormInput name="location" value={form.location} onChange={handleChange} placeholder="e.g. Chennai" />
            </FormGroup>
            <FormGroup label="State">
              <FormInput name="state" value={form.state} onChange={handleChange} placeholder="e.g. Tamil Nadu" />
            </FormGroup>
            <FormGroup label="Fees per Year (\u20B9)">
              <FormInput name="feesPerYear" type="number" value={form.feesPerYear} onChange={handleChange} placeholder="e.g. 250000" />
            </FormGroup>
            <FormGroup label="Placement %">
              <FormInput name="placementPercentage" type="number" value={form.placementPercentage} onChange={handleChange} placeholder="e.g. 95" />
            </FormGroup>
            <FormGroup label="Rank">
              <FormInput name="rank" value={form.rank} onChange={handleChange} placeholder="e.g. #1" />
            </FormGroup>
            <FormGroup label="Accreditation">
              <FormInput name="accreditation" value={form.accreditation} onChange={handleChange} placeholder="e.g. NAAC A++" />
            </FormGroup>
            <FormGroup label="Courses Offered (comma-separated)" full>
              <FormInput name="coursesOffered" as="textarea" value={form.coursesOffered} onChange={handleChange} placeholder="e.g. B.Tech CSE, B.Tech ECE, M.Tech AI" />
            </FormGroup>
          </FormGrid>
          <FormActions
            onClose={closeModal}
            onSave={handleSave}
            saveDisabled={saving || !form.collegeName || !form.stream}
            saveText={saving ? 'Saving...' : editing ? 'Update College' : 'Add College'}
          />
        </Modal>
      )}
    </div>
  )
}
