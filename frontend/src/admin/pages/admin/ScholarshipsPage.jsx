import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, DataTable, TR, TD, ActionBtn, FiltersRow, SearchInput, PrimaryBtn, Modal, FormGrid, FormGroup, FormInput, FormActions } from '../../components/UI';

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/scholarships");
      setScholarships(res.data);
    } catch (err) {
      console.error("Error fetching scholarships", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setUploadMessage("Uploading...");
      const res = await axios.post("http://localhost:5000/api/scholarships/upload", formData);
      setUploadMessage(`${res.data.inserted} added, ${res.data.duplicates} duplicates skipped`);
      fetchScholarships(); // Refresh list after upload
    } catch (err) {
      console.error("Upload error", err);
      if (err.response && err.response.data && err.response.data.message) {
        setUploadMessage("Error: " + err.response.data.message);
      } else {
        setUploadMessage("Error uploading file");
      }
      setLoading(false);
    } finally {
      e.target.value = ""; // Clear file input
      setTimeout(() => setUploadMessage(""), 5000); // Clear message after 5s
    }
  };

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
      <FiltersRow>
        <SearchInput placeholder="🔍 Search scholarships..." />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
          {uploadMessage && <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '14px' }}>{uploadMessage}</span>}
          <input 
            type="file" 
            accept=".csv, .xlsx" 
            id="csv-upload" 
            style={{ display: 'none' }} 
            onChange={handleFileUpload} 
          />
          <PrimaryBtn onClick={() => document.getElementById('csv-upload').click()}>
            Upload CSV/Excel
          </PrimaryBtn>
          <PrimaryBtn onClick={() => setModal(true)}>+ Add Scholarship</PrimaryBtn>
        </div>
      </FiltersRow>

      <Card>
        {loading ? (
          <p style={{ padding: 20 }}>Loading scholarships...</p>
        ) : (
          <DataTable
            columns={['Scholarship Name', 'Provider', 'Eligibility', 'Amount', 'Action']}
            data={scholarships}
            renderRow={(s) => (
              <TR key={s._id}>
                <TD style={{ fontWeight: 600, color: 'var(--text)' }}>{s.scholarshipName || 'N/A'}</TD>
                <TD>{s.provider || 'N/A'}</TD>
                <TD style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.eligibility || 'N/A'}
                </TD>
                <TD style={{ color: 'var(--text3)' }}>{s.amount || 'N/A'}</TD>
                <TD>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {s.applicationLink ? (
                      <ActionBtn onClick={() => window.open(s.applicationLink, '_blank')}>🔗 Apply Here</ActionBtn>
                    ) : (
                      <ActionBtn>No Link</ActionBtn>
                    )}
                  </div>
                </TD>
              </TR>
            )}
          />
        )}
      </Card>

      {modal && (
        <Modal title="Add New Scholarship" onClose={() => setModal(false)}>
          <FormGrid>
            <FormGroup label="Scholarship Name" full><FormInput placeholder="e.g. NSP Pre-Matric" /></FormGroup>
            <FormGroup label="Provider"><FormInput placeholder="e.g. TN Govt" /></FormGroup>
            <FormGroup label="Amount"><FormInput placeholder="e.g. ₹1L/yr" /></FormGroup>
            <FormGroup label="Eligibility"><FormInput placeholder="e.g. Above 80%" /></FormGroup>
            <FormGroup label="Application Link" full><FormInput placeholder="https://" /></FormGroup>
          </FormGrid>
          <FormActions onClose={() => setModal(false)} />
        </Modal>
      )}
    </div>
  );
}
