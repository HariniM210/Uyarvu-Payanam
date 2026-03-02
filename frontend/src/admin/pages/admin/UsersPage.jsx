import React, { useState } from 'react'
import { Card, LevelBadge, DataTable, TR, TD, ActionBtn, FiltersRow, SearchInput, FilterSelect } from '../../components/UI'

const USERS_DATA = [
  { id:1, name:'Priya Sharma',  email:'priya@gmail.com',  level:'12th', career:'Engineering', status:'Active' },
  { id:2, name:'Arjun Patel',   email:'arjun@gmail.com',  level:'10th', career:'Medicine',    status:'Active' },
  { id:3, name:'Sneha Reddy',   email:'sneha@gmail.com',  level:'8th',  career:'Arts',        status:'Blocked' },
  { id:4, name:'Rahul Kumar',   email:'rahul@gmail.com',  level:'12th', career:'Commerce',    status:'Active' },
  { id:5, name:'Anjali Singh',  email:'anjali@gmail.com', level:'5th',  career:'Science',     status:'Active' },
  { id:6, name:'Vikram Nair',   email:'vikram@gmail.com', level:'10th', career:'Engineering', status:'Active' },
  { id:7, name:'Pooja Verma',   email:'pooja@gmail.com',  level:'8th',  career:'Humanities',  status:'Active' },
]

export default function UsersPage() {
  const [users, setUsers] = useState(USERS_DATA)
  const [search, setSearch] = useState('')
  const [level, setLevel]   = useState('All')

  const filtered = users.filter(u =>
    (level === 'All' || u.level === level) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  )

  const toggleBlock = id => setUsers(u => u.map(x => x.id===id ? {...x, status:x.status==='Active'?'Blocked':'Active'} : x))

  return (
    <div style={{ animation:'fadeUp 0.4s ease both' }}>
      <FiltersRow>
        <SearchInput placeholder="🔍 Search by name or email..." value={search} onChange={e=>setSearch(e.target.value)} />
        <FilterSelect value={level} onChange={e=>setLevel(e.target.value)}>
          <option>All</option><option>5th</option><option>8th</option><option>10th</option><option>12th</option>
        </FilterSelect>
        <span style={{ marginLeft:'auto', fontSize:13, color:'var(--text3)' }}>
          Showing <strong style={{ color:'var(--primary)' }}>{filtered.length}</strong> users
        </span>
      </FiltersRow>
      <Card>
        <DataTable
          columns={['Name','Email','Level','Career Interest','Status','Actions']}
          data={filtered}
          renderRow={(u,i) => (
            <TR key={u.id}>
              <TD><div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:10,
                  background:`hsl(${u.id*47},60%,85%)`, display:'flex', alignItems:'center',
                  justifyContent:'center', fontWeight:800, fontSize:13, color:`hsl(${u.id*47},50%,35%)` }}>
                  {u.name[0]}
                </div>
                <span style={{ fontWeight:600, color:'var(--text)' }}>{u.name}</span>
              </div></TD>
              <TD style={{ color:'var(--text3)' }}>{u.email}</TD>
              <TD><LevelBadge level={u.level}/></TD>
              <TD style={{ color:'var(--text2)' }}>{u.career}</TD>
              <TD><LevelBadge level={u.status}/></TD>
              <TD><div style={{ display:'flex', gap:6 }}>
                <ActionBtn onClick={()=>toggleBlock(u.id)}>{u.status==='Active'?'🔒 Block':'🔓 Unblock'}</ActionBtn>
                <ActionBtn>🔑 Reset PW</ActionBtn>
                <ActionBtn danger>🗑 Delete</ActionBtn>
              </div></TD>
            </TR>
          )}
        />
      </Card>
    </div>
  )
}
