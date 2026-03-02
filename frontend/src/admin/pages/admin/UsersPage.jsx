import React, { useState, useEffect, useCallback } from 'react'
import { Card, LevelBadge, DataTable, TR, TD, ActionBtn, FiltersRow, SearchInput, FilterSelect } from '../../components/UI'
import { adminService } from '../../../services/adminService'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const params = {}
      if (search) params.search = search
      if (status !== 'all') params.status = status
      const data = await adminService.getUsers(params)
      setUsers(data)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }, [search, status])

  useEffect(() => {
    const delay = setTimeout(fetchUsers, 300)
    return () => clearTimeout(delay)
  }, [fetchUsers])

  const handleBlock = async (id) => {
    try {
      const { user } = await adminService.blockUser(id)
      setUsers(prev => prev.map(u => u._id === id ? user : u))
    } catch (err) {
      console.error('Failed to block user:', err)
    }
  }

  const handleUnblock = async (id) => {
    try {
      const { user } = await adminService.unblockUser(id)
      setUsers(prev => prev.map(u => u._id === id ? user : u))
    } catch (err) {
      console.error('Failed to unblock user:', err)
    }
  }

  const handleResetPassword = async (id, name) => {
    if (!window.confirm(`Reset password for ${name}?`)) return
    try {
      await adminService.resetPassword(id)
      alert(`Password reset successfully for ${name}`)
    } catch (err) {
      console.error('Failed to reset password:', err)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) return
    try {
      await adminService.deleteUser(id)
      setUsers(prev => prev.filter(u => u._id !== id))
    } catch (err) {
      console.error('Failed to delete user:', err)
    }
  }

  const statusLabel = (s) => s === 'active' ? 'Active' : 'Blocked'

  return (
    <div style={{ animation:'fadeUp 0.4s ease both' }}>
      <FiltersRow>
        <SearchInput placeholder="\uD83D\uDD0D Search by name or email..." value={search} onChange={e=>setSearch(e.target.value)} />
        <FilterSelect value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </FilterSelect>
        <span style={{ marginLeft:'auto', fontSize:13, color:'var(--text3)' }}>
          Showing <strong style={{ color:'var(--primary)' }}>{users.length}</strong> users
        </span>
      </FiltersRow>
      <Card>
        {loading ? (
          <div style={{ padding:40, textAlign:'center', color:'var(--text3)' }}>Loading users...</div>
        ) : users.length === 0 ? (
          <div style={{ padding:40, textAlign:'center', color:'var(--text3)' }}>No users found</div>
        ) : (
          <DataTable
            columns={['Name','Email','Level','Career Interest','Status','Actions']}
            data={users}
            renderRow={(u) => (
              <TR key={u._id}>
                <TD><div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:10,
                    background:`hsl(${u.name.charCodeAt(0)*7},60%,85%)`, display:'flex', alignItems:'center',
                    justifyContent:'center', fontWeight:800, fontSize:13, color:`hsl(${u.name.charCodeAt(0)*7},50%,35%)` }}>
                    {u.name[0]}
                  </div>
                  <span style={{ fontWeight:600, color:'var(--text)' }}>{u.name}</span>
                </div></TD>
                <TD style={{ color:'var(--text3)' }}>{u.email}</TD>
                <TD><LevelBadge level={u.classLevel || '—'}/></TD>
                <TD style={{ color:'var(--text2)' }}>{u.selectedCareer || '—'}</TD>
                <TD><LevelBadge level={statusLabel(u.status)}/></TD>
                <TD><div style={{ display:'flex', gap:6 }}>
                  {u.status === 'active'
                    ? <ActionBtn onClick={()=>handleBlock(u._id)}>{"\uD83D\uDD12 Block"}</ActionBtn>
                    : <ActionBtn onClick={()=>handleUnblock(u._id)}>{"\uD83D\uDD13 Unblock"}</ActionBtn>
                  }
                  <ActionBtn onClick={()=>handleResetPassword(u._id, u.name)}>{"\uD83D\uDD11 Reset PW"}</ActionBtn>
                  <ActionBtn danger onClick={()=>handleDelete(u._id, u.name)}>{"\uD83D\uDDD1 Delete"}</ActionBtn>
                </div></TD>
              </TR>
            )}
          />
        )}
      </Card>
    </div>
  )
}
