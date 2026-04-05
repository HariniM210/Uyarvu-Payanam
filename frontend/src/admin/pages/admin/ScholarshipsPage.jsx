import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  FiSearch, FiPlus, FiUpload, FiEdit2, FiTrash2, FiExternalLink, 
  FiFilter, FiLayers, FiInfo, FiCheckCircle 
} from 'react-icons/fi';
import { 
  Card, DataTable, TR, TD, ActionBtn, FiltersRow, SearchInput, 
  SBtn, Modal, FormGrid, FormGroup, FormInput, FormActions, 
  FilterSelect, SBadge, SLoader 
} from '../../components/UI';

// Base URL for API
const API_URL = "http://localhost:5000/api/scholarships";

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, isEdit: false, data: null });
  const [uploadMessage, setUploadMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");

  const initialFormState = {
    scholarshipName: '',
    provider: '',
    amount: '',
    eligibility: '',
    applicationLink: '',
    targetClass: ["10"], // Default to 10th
    category: 'Government',
    description: '',
    status: 'published'
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      // Assuming res.data is the array or { data: [] }
      setScholarships(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) {
      console.error("Error fetching scholarships", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        ...item,
        targetClass: item.targetClass || ["10"]
      });
      setModal({ open: true, isEdit: true, data: item });
    } else {
      setFormData(initialFormState);
      setModal({ open: true, isEdit: false, data: null });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClassToggle = (cls) => {
    setFormData(prev => {
      const current = prev.targetClass || [];
      if (current.includes(cls)) {
        return { ...prev, targetClass: current.filter(c => c !== cls) };
      } else {
        return { ...prev, targetClass: [...current, cls] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal.isEdit) {
        await axios.put(`${API_URL}/${modal.data._id}`, formData, { withCredentials: true });
      } else {
        await axios.post(`${API_URL}/add-scholarship`, formData, { withCredentials: true });
      }
      setModal({ open: false, isEdit: false, data: null });
      fetchScholarships();
    } catch (err) {
      alert("Save failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scholarship?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      fetchScholarships();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const body = new FormData();
    body.append("file", file);

    try {
      setLoading(true);
      setUploadMessage("Uploading...");
      const res = await axios.post(`${API_URL}/upload`, body, { withCredentials: true });
      setUploadMessage(`Success: ${res.data.inserted} added.`);
      fetchScholarships();
    } catch (err) {
      setUploadMessage("Upload failed.");
    } finally {
      e.target.value = ""; 
      setTimeout(() => setUploadMessage(""), 5000);
    }
  };

  const filteredData = useMemo(() => {
    return scholarships.filter(s => {
      const matchesSearch = (s.scholarshipName || "").toLowerCase().includes(search.toLowerCase()) ||
                            (s.provider || "").toLowerCase().includes(search.toLowerCase());
      const matchesClass = filterClass === "all" || (s.targetClass || []).includes(filterClass);
      return matchesSearch && matchesClass;
    });
  }, [scholarships, search, filterClass]);

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
      <FiltersRow>
        <SearchInput 
          placeholder="Search scholarship name or provider..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <FilterSelect value={filterClass} onChange={e => setFilterClass(e.target.value)}>
           <option value="all">All Grades</option>
           <option value="5">Class 5th</option>
           <option value="8">Class 8th</option>
           <option value="10">Class 10th</option>
           <option value="12">Class 12th</option>
        </FilterSelect>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
          {uploadMessage && <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '14px' }}>{uploadMessage}</span>}
          <input 
            type="file" 
            accept=".csv, .xlsx" 
            id="csv-upload" 
            style={{ display: 'none' }} 
            onChange={handleFileUpload} 
          />
          <SBtn variant="outline" onClick={() => document.getElementById('csv-upload').click()}>
            <FiUpload style={{ marginRight:8 }} /> Import CSV
          </SBtn>
          <SBtn variant="primary" onClick={() => handleOpenModal()}>
            <FiPlus style={{ marginRight:8 }} /> Add Scholarship
          </SBtn>
        </div>
      </FiltersRow>

      <Card>
        {loading ? (
          <SLoader />
        ) : (
          <DataTable
            columns={['Scholarship Name', 'Grades', 'Provider', 'Benefit', 'Action']}
            data={filteredData}
            renderRow={(s) => (
              <TR key={s._id}>
                <TD style={{ fontWeight: 800, color: 'var(--text)', fontSize:15 }}>
                  {(s.scholarshipName || '').toUpperCase()}
                </TD>
                <TD>
                   <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                      {(s.targetClass || []).map(c => (
                        <SBadge key={c} color="blue">{c}th</SBadge>
                      ))}
                   </div>
                </TD>
                <TD>{s.provider || 'N/A'}</TD>
                <TD style={{ fontWeight: 600, color: 'var(--primary)' }}>{s.amount || 'N/A'}</TD>
                <TD>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <ActionBtn onClick={() => handleOpenModal(s)} title="Edit"><FiEdit2 size={16} /></ActionBtn>
                    <ActionBtn onClick={() => handleDelete(s._id)} title="Delete" style={{ color:'#ef4444' }}><FiTrash2 size={16} /></ActionBtn>
                    {s.applicationLink && (
                       <ActionBtn onClick={() => window.open(s.applicationLink, '_blank')} title="Link"><FiExternalLink size={16} /></ActionBtn>
                    )}
                  </div>
                </TD>
              </TR>
            )}
          />
        )}
      </Card>

      {modal.open && (
        <Modal title={modal.isEdit ? "Edit Scholarship" : "Add Scholarship"} onClose={() => setModal({open:false, isEdit:false, data:null})}>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup label="Scholarship Name" full>
                <FormInput name="scholarshipName" value={formData.scholarshipName} onChange={handleInputChange} required />
              </FormGroup>
              <FormGroup label="Provider">
                <FormInput name="provider" value={formData.provider} onChange={handleInputChange} />
              </FormGroup>
              <FormGroup label="Benefit Amount">
                <FormInput name="amount" value={formData.amount} onChange={handleInputChange} placeholder="e.g. ₹10,000" />
              </FormGroup>
              <FormGroup label="Category">
                <select name="category" value={formData.category} onChange={handleInputChange} style={{ width:'100%', padding:12, borderRadius:12, border:'1.5px solid var(--border)' }}>
                   <option value="Government">Government</option>
                   <option value="Private">Private</option>
                   <option value="Merit">Merit Based</option>
                </select>
              </FormGroup>
              <FormGroup label="Eligibility">
                <FormInput name="eligibility" value={formData.eligibility} onChange={handleInputChange} />
              </FormGroup>
              <FormGroup label="Target Grades (Select Multi)" full>
                 <div style={{ display:'flex', gap:10 }}>
                    {["5", "8", "10", "12"].map(cls => (
                      <button 
                         type="button" 
                         key={cls}
                         onClick={() => handleClassToggle(cls)}
                         style={{ 
                            padding:'10px 20px', borderRadius:12, border: formData.targetClass.includes(cls) ? '2px solid var(--primary)' : '1px solid var(--border)',
                            background: formData.targetClass.includes(cls) ? 'var(--surface2)' : '#fff',
                            color: formData.targetClass.includes(cls) ? 'var(--primary)' : 'var(--text3)',
                            fontWeight: 700, cursor:'pointer'
                         }}
                      >Class {cls}th</button>
                    ))}
                 </div>
              </FormGroup>
              <FormGroup label="Application Link" full>
                <FormInput name="applicationLink" value={formData.applicationLink} onChange={handleInputChange} placeholder="https://..." />
              </FormGroup>
              <FormGroup label="Description" full>
                <FormInput as="textarea" name="description" value={formData.description} onChange={handleInputChange} style={{ minHeight:100 }} />
              </FormGroup>
            </FormGrid>
            <FormActions onClose={() => setModal({open:false, isEdit:false, data:null})} />
          </form>
        </Modal>
      )}
    </div>
  );
}
