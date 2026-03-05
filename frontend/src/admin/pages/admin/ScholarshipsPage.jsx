import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, DataTable, TR, TD, ActionBtn, FiltersRow, SearchInput, PrimaryBtn, Modal, FormGrid, FormGroup, FormInput, FormActions } from '../../components/UI';

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

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

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
      <FiltersRow>
        <SearchInput placeholder="🔍 Search scholarships..." />
        <PrimaryBtn style={{ marginLeft: 'auto' }} onClick={() => setModal(true)}>+ Add Scholarship</PrimaryBtn>
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
