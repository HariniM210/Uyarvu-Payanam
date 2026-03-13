import React, { useState, useEffect, useMemo } from 'react'
import { adminService } from '../../../services/adminService'
import { Card, DataTable, TR, TD, ActionBtn, FiltersRow, FilterSelect, PrimaryBtn, Modal, FormGrid, FormGroup, FormInput, FormActions } from '../../components/UI'

const CATEGORIES = ['Engineering', 'MBBS', 'BBA / BCom', 'Arts & Science', 'Law', 'Hotel Management']

function Mark({ v, color }) {
  return <span style={{ fontWeight:700, color, fontSize:13 }}>{v ?? 'N/A'}</span>
}

export default function CutoffPage() {
const [allCutoffs, setAllCutoffs] = useState([])
  const [modal, setModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Engineering')
  const [selectedYear, setSelectedYear] = useState(2024)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [sorting, setSorting] = useState({ field: 'college', direction: 'asc' })

  const pageSizeOptions = [10, 25, 50, 200, 1000]

  const fetchCutoffs = async () => {
    try {
      setLoading(true)
      const data = await adminService.getCutoffs()
      console.log('Cutoff data loaded:', { count: data.data?.length, total: data.total })
      setAllCutoffs(data.data || [])
      setCurrentPage(1)
    } catch (err) {
      console.error('Failed to load cutoffs', err)
    } finally {
      setLoading(false)
    }
  }

  const [importing, setImporting] = useState(false)

  const importCutoffs = async () => {
    try {
      setImporting(true)
      await adminService.importCutoffs(selectedYear)
      console.log('Import completed')
      // refresh after import so table gets updated automatically
      await fetchCutoffs()
    } catch (err) {
      console.error('Import error', err)
      alert('Import failed: ' + (err.response?.data?.error || err.message))
    } finally {
      setImporting(false)
    }
  }

  useEffect(() => {
    fetchCutoffs()
  }, [selectedYear, selectedCategory])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, departmentFilter, pageSize, sorting])

  const departments = useMemo(() => {
    return [...new Set(allCutoffs.map(item => item.department || item.course || ''))].filter(Boolean)
  }, [allCutoffs])

  const filteredCutoffs = useMemo(() => {
    const categoryFilter = selectedCategory.trim().toLowerCase()
    const yearFilter = Number(selectedYear)
    return allCutoffs.filter(r => {
      const college = (r.collegeName || r.college || '').toString().toLowerCase()
      const department = (r.department || r.course || '').toString().toLowerCase()
      const search = searchTerm.trim().toLowerCase()
      const matchesCategory = !categoryFilter || department.includes(categoryFilter) || college.includes(categoryFilter)
      const matchesYear = !yearFilter || Number(r.year || 0) === yearFilter
      const matchesSearch = !search || college.includes(search) || department.includes(search) || (r.collegeCode || r.college_code || '').toString().toLowerCase().includes(search)
      const matchesDepartment = !departmentFilter || department === departmentFilter.toLowerCase()
      return matchesCategory && matchesYear && matchesSearch && matchesDepartment
    })
  }, [allCutoffs, selectedCategory, selectedYear, searchTerm, departmentFilter])

  const sortedCutoffs = useMemo(() => {
    if (!sorting.field) return filteredCutoffs
    return [...filteredCutoffs].sort((a, b) => {
      const mapVal = item => {
        if (sorting.field === 'college') return (item.collegeName || item.college || '').toString().toLowerCase()
        if (sorting.field === 'college_code') return (item.collegeCode || item.college_code || '').toString().toLowerCase()
        if (sorting.field === 'department') return (item.department || item.course || '').toString().toLowerCase()
        if (sorting.field === 'year') return Number(item.year || 0)
        return Number(item[sorting.field] || item[sorting.field.replace('_cutoff', '')] || 0)
      }

      const v1 = mapVal(a)
      const v2 = mapVal(b)
      if (v1 < v2) return sorting.direction === 'asc' ? -1 : 1
      if (v1 > v2) return sorting.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredCutoffs, sorting])

  const totalRows = sortedCutoffs.length
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))

  const paginatedCutoffs = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedCutoffs.slice(start, start + pageSize)
  }, [sortedCutoffs, currentPage, pageSize])

  const rows = paginatedCutoffs.map((r, i) => ({
    college_code: r.collegeCode || r.college_code || '',
    college: r.collegeName || r.college || '',
    department: r.department || r.course || '',
    year: r.year || '',
    oc_cutoff: r.oc || r.general || 0,
    bc_cutoff: r.bc || r.obc || 0,
    mbc_cutoff: r.mbc || 0,
    sc_cutoff: r.sc || 0,
    st_cutoff: r.st || 0,
    id: r._id || i,
  }))

  return (
    <div style={{ animation:'fadeUp 0.4s ease both' }}>
      <FiltersRow>
        <FilterSelect value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </FilterSelect>

        <FilterSelect value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
          <option value={2022}>2022</option>
        </FilterSelect>

        <FilterSelect value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}>
          <option value=''>All Departments</option>
          {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
        </FilterSelect>

        <input
          type='text'
          placeholder='Search college or course...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            background:'var(--surface)', border:'1.5px solid var(--border)', color:'var(--text)',
            borderRadius:10, padding:'9px 14px', fontSize:13, fontFamily:'Outfit,sans-serif',
            outline:'none', width:240
          }}
        />

        <FilterSelect value={sorting.field} onChange={e => setSorting(prev => ({ ...prev, field: e.target.value }))}>
          <option value='college'>College</option>
          <option value='college_code'>College Code</option>
          <option value='department'>Department</option>
          <option value='year'>Year</option>
          <option value='oc_cutoff'>OC Cutoff</option>
          <option value='bc_cutoff'>BC Cutoff</option>
          <option value='mbc_cutoff'>MBC Cutoff</option>
          <option value='sc_cutoff'>SC Cutoff</option>
          <option value='st_cutoff'>ST Cutoff</option>
        </FilterSelect>

        <FilterSelect value={sorting.direction} onChange={e => setSorting(prev => ({ ...prev, direction: e.target.value }))}>
          <option value='asc'>Ascending</option>
          <option value='desc'>Descending</option>
        </FilterSelect>

        <FilterSelect value={pageSize} onChange={e => {
          setPageSize(Number(e.target.value))
          setCurrentPage(1)
        }}>
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>{size} per page</option>
          ))}
        </FilterSelect>

        <PrimaryBtn style={{ marginLeft:'auto', marginRight:'0.5rem' }} onClick={importCutoffs} disabled={importing}>
          {importing ? 'Importing...' : 'Import Cutoff Data'}
        </PrimaryBtn>

        <PrimaryBtn onClick={() => setModal(true)}>+ Add Cutoff</PrimaryBtn>
      </FiltersRow>

      <Card>
        <DataTable columns={['College Code', 'College Name', 'Department', 'Year', 'OC', 'BC', 'MBC', 'SC', 'ST', 'Actions']} data={rows} renderRow={(r) => (
          <TR key={r.id}>
            <TD style={{ fontWeight:600, color:'var(--text)' }}>{r.college_code}</TD>
            <TD style={{ color:'var(--text3)' }}>{r.college}</TD>
            <TD style={{ color:'var(--text3)' }}>{r.department}</TD>
            <TD style={{ color:'var(--text3)' }}>{r.year}</TD>
            <TD><Mark v={r.oc_cutoff} color='var(--primary)'/></TD>
            <TD><Mark v={r.bc_cutoff} color='#f59e0b'/></TD>
            <TD><Mark v={r.mbc_cutoff} color='#8b5cf6'/></TD>
            <TD><Mark v={r.sc_cutoff} color='#3b82f6'/></TD>
            <TD><Mark v={r.st_cutoff} color='#ef4444'/></TD>
            <TD><ActionBtn>✏️ Edit</ActionBtn></TD>
          </TR>
        )} />
        {loading && <div style={{ padding:'1rem', textAlign:'center' }}>Loading...</div>}
        {!loading && !rows.length && <div style={{ padding:'1rem', textAlign:'center' }}>No data found.</div>}
      </Card>

      <div style={{ marginTop:'1.5rem', padding:'1rem', background:'var(--surface2)', borderRadius:12, border:'1px solid var(--border)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
          <div style={{ color:'var(--text2)', fontSize:14 }}>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalRows)} of {totalRows.toLocaleString()} records
          </div>
          <div style={{ display:'flex', gap:'0.25rem', alignItems:'center', flexWrap:'wrap' }}>
            <button disabled={currentPage <= 1} onClick={() => setCurrentPage(1)} style={{ padding:'0.5rem 0.75rem', border:'1px solid var(--border)', borderRadius:6, background: currentPage === 1 ? 'var(--surface)' : 'var(--surface)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>« First</button>
            <button disabled={currentPage <= 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} style={{ padding:'0.5rem 0.75rem', border:'1px solid var(--border)', borderRadius:6, background: 'var(--surface)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>‹ Prev</button>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 4
                ? i + 1
                : currentPage >= totalPages - 3
                  ? totalPages - 6 + i
                  : currentPage - 3 + i
              if (pageNum < 1 || pageNum > totalPages) return null
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 6,
                    border: currentPage === pageNum ? 'none' : '1px solid var(--border)',
                    background: currentPage === pageNum ? 'var(--primary)' : 'var(--surface)',
                    color: currentPage === pageNum ? '#fff' : 'var(--text)',
                    fontWeight: currentPage === pageNum ? 700 : 500,
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  {pageNum}
                </button>
              )
            })}
            <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} style={{ padding:'0.5rem 0.75rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--surface)', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}>Next ›</button>
            <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(totalPages)} style={{ padding:'0.5rem 0.75rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--surface)', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}>Last »</button>
          </div>
        </div>
      </div>

      {modal && <Modal title='Add Cutoff Data' onClose={()=>setModal(false)}>
        <FormGrid>
          <FormGroup label='College' full><FormInput name='college' placeholder='College name' /></FormGroup>
          <FormGroup label='Course'><FormInput name='course' placeholder='Course/Dept'/></FormGroup>
          <FormGroup label='Year'><FormInput name='year' type='number' placeholder='2024'/></FormGroup>
          <FormGroup label='General'><FormInput name='general' type='number' placeholder='OC cutoff'/></FormGroup>
          <FormGroup label='OBC'><FormInput name='obc' type='number' placeholder='OBC cutoff'/></FormGroup>
          <FormGroup label='SC'><FormInput name='sc' type='number' placeholder='SC cutoff'/></FormGroup>
          <FormGroup label='ST'><FormInput name='st' type='number' placeholder='ST cutoff'/></FormGroup>
          <FormGroup label='College Code'><FormInput name='college_code' placeholder='Counselling code'/></FormGroup>
        </FormGrid>
        <FormActions onClose={()=>setModal(false)}/>
      </Modal>}
    </div>
  )
}

