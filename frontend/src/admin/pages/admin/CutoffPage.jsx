import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ActionBtn,
  Card,
  DataTable,
  FiltersRow,
  FilterSelect,
  Modal,
  PrimaryBtn,
  TD,
  TR,
  FormActions,
  FormGrid,
  FormGroup,
  FormInput,
} from "../../components/UI";

const TYPES = ["Engineering"];

function Mark({ v, color }) {
  const display = v === undefined || v === null || v === "" ? "—" : v;
  return <span style={{ fontWeight: 700, color, fontSize: 13 }}>{display}</span>;
}

const API_BASE = "http://localhost:5000";

function normalizeCategory(value) {
  const v = (value ?? "").toString().trim().toUpperCase();
  if (!v) return "";
  if (v === "GENERAL") return "OC";
  if (v === "OBC") return "BC";
  if (v === "BCM") return "MBC";
  return v; // OC/BC/MBC/SC/ST
}

function pick(obj, keys) {
  for (const k of keys) {
    const val = obj?.[k];
    if (val !== undefined && val !== null && String(val).trim() !== "") return val;
  }
  return "";
}

function toNumberMaybe(v) {
  if (v === "" || v === null || v === undefined) return "";
  const n = Number(v);
  return Number.isFinite(n) ? n : v;
}

// Transform API data into grouped rows:
// group by (collegeName + branch + year) and put OC/BC/MBC/SC/ST in one row.
function groupCutoffs(rawRows) {
  const map = new Map();

  for (const item of rawRows || []) {
    // Normalized backend shape:
    // { collegeCode, collegeName, branch, category: 'OC'|'BC'|'MBC'|'SC'|'ST', cutoff, year, type }
    const collegeCode = pick(item, ["collegeCode", "college_code"]);
    const collegeName = pick(item, ["collegeName", "college"]);
    const branch = pick(item, ["branch", "department"]);
    const year = Number(pick(item, ["year"])) || 0;

    if (!collegeName || !branch || !year) continue;

    const key = `${collegeName}||${branch}||${year}`;
    const current =
      map.get(key) || {
        _id: key,
        collegeCode,
        collegeName,
        branch,
        year,
        OC: "",
        BC: "",
        MBC: "",
        SC: "",
        ST: "",
      };

    // Normalized category+cutoff rows
    const cat = normalizeCategory(pick(item, ["category", "community", "quota", "caste"]));
    const cutoff = pick(item, ["cutoff", "value"]);
    if (cat && cutoff !== "") {
      if (cat === "OC") current.OC = toNumberMaybe(cutoff);
      if (cat === "BC") current.BC = toNumberMaybe(cutoff);
      if (cat === "MBC") current.MBC = toNumberMaybe(cutoff);
      if (cat === "SC") current.SC = toNumberMaybe(cutoff);
      if (cat === "ST") current.ST = toNumberMaybe(cutoff);
    }

    if (!current.collegeCode && collegeCode) current.collegeCode = collegeCode;
    map.set(key, current);
  }

  return Array.from(map.values());
}

export default function CutoffPage() {
  const [rawCutoffs, setRawCutoffs] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedType, setSelectedType] = useState("Engineering");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [sorting, setSorting] = useState({ field: "college", direction: "asc" });

  const pageSizeOptions = [10, 25, 50, 200];

  const fetchCutoffs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/cutoff`, {
        params: { type: selectedType, year: selectedYear },
      });
      setRawCutoffs(res.data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to load cutoffs", err);
      setRawCutoffs([]);
    } finally {
      setLoading(false);
    }
  };

  const importCutoffs = async () => {
    try {
      setImporting(true);
      await axios.get(`${API_BASE}/api/cutoff/import-csv`);
      await fetchCutoffs();
    } catch (err) {
      console.error("Import error", err);
      alert("Import failed: " + (err.response?.data?.error || err.message));
    } finally {
      setImporting(false);
    }
  };

  useEffect(() => {
    fetchCutoffs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, selectedYear]);

  const grouped = useMemo(() => groupCutoffs(rawCutoffs), [rawCutoffs]);

  const departments = useMemo(() => {
    return [...new Set(grouped.map((r) => r.branch).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }, [grouped]);

  const filtered = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    const dept = departmentFilter.trim().toLowerCase();
    return grouped.filter((r) => {
      const college = (r.collegeName || "").toString().toLowerCase();
      const branch = (r.branch || "").toString().toLowerCase();
      const matchesSearch = !search || college.includes(search);
      const matchesDept = !dept || branch === dept;
      return matchesSearch && matchesDept;
    });
  }, [grouped, searchTerm, departmentFilter]);

  const sorted = useMemo(() => {
    const { field, direction } = sorting;
    const dir = direction === "asc" ? 1 : -1;
    const getVal = (r) => {
      if (field === "college") return (r.collegeName || "").toString().toLowerCase();
      if (field === "college_code") return (r.collegeCode || "").toString().toLowerCase();
      if (field === "department") return (r.branch || "").toString().toLowerCase();
      if (field === "year") return Number(r.year || 0);
      return Number(r[field] || 0);
    };

    return [...filtered].sort((a, b) => {
      const v1 = getVal(a);
      const v2 = getVal(b);
      if (v1 < v2) return -1 * dir;
      if (v1 > v2) return 1 * dir;
      return 0;
    });
  }, [filtered, sorting]);

  const totalRows = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const tableRows = paginated.map((r, idx) => ({
    id: r._id || idx,
    college_code: r.collegeCode || "",
    college: r.collegeName || "",
    department: r.branch || "",
    year: r.year,
    oc_cutoff: r.OC,
    bc_cutoff: r.BC,
    mbc_cutoff: r.MBC,
    sc_cutoff: r.SC,
    st_cutoff: r.ST,
  }));

  return (
    <div style={{ animation: "fadeUp 0.4s ease both" }}>
      <FiltersRow>
        <FilterSelect value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          {TYPES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
          <option value={2022}>2022</option>
        </FilterSelect>

        <FilterSelect value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </FilterSelect>

        <input
          type="text"
          placeholder="Search college name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            color: "var(--text)",
            borderRadius: 10,
            padding: "9px 14px",
            fontSize: 13,
            fontFamily: "Outfit,sans-serif",
            outline: "none",
            width: 240,
          }}
        />

        <FilterSelect value={sorting.field} onChange={(e) => setSorting((p) => ({ ...p, field: e.target.value }))}>
          <option value="college">College</option>
          <option value="college_code">College Code</option>
          <option value="department">Department</option>
          <option value="year">Year</option>
          <option value="OC">OC</option>
          <option value="BC">BC</option>
          <option value="MBC">MBC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
        </FilterSelect>

        <FilterSelect value={sorting.direction} onChange={(e) => setSorting((p) => ({ ...p, direction: e.target.value }))}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </FilterSelect>

        <FilterSelect
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {pageSizeOptions.map((s) => (
            <option key={s} value={s}>
              {s} per page
            </option>
          ))}
        </FilterSelect>

        <PrimaryBtn style={{ marginLeft: "auto", marginRight: "0.5rem" }} onClick={importCutoffs} disabled={importing}>
          {importing ? "Importing..." : "Import Cutoff Data"}
        </PrimaryBtn>

        <PrimaryBtn onClick={() => setModal(true)}>+ Add Cutoff</PrimaryBtn>
      </FiltersRow>

      <Card>
        <DataTable
          columns={["College Code", "College Name", "Department", "Year", "OC", "BC", "MBC", "SC", "ST", "Actions"]}
          data={tableRows}
          renderRow={(r) => (
            <TR key={r.id}>
              <TD style={{ fontWeight: 600, color: "var(--text)" }}>{r.college_code}</TD>
              <TD style={{ color: "var(--text3)" }}>{r.college}</TD>
              <TD style={{ color: "var(--text3)" }}>{r.department}</TD>
              <TD style={{ color: "var(--text3)" }}>{r.year}</TD>
              <TD>
                <Mark v={r.oc_cutoff} color="var(--primary)" />
              </TD>
              <TD>
                <Mark v={r.bc_cutoff} color="#f59e0b" />
              </TD>
              <TD>
                <Mark v={r.mbc_cutoff} color="#8b5cf6" />
              </TD>
              <TD>
                <Mark v={r.sc_cutoff} color="#3b82f6" />
              </TD>
              <TD>
                <Mark v={r.st_cutoff} color="#ef4444" />
              </TD>
              <TD>
                <ActionBtn>✏️ Edit</ActionBtn>
              </TD>
            </TR>
          )}
        />

        {loading && <div style={{ padding: "1rem", textAlign: "center" }}>Loading...</div>}
        {!loading && !tableRows.length && <div style={{ padding: "1rem", textAlign: "center" }}>No data found.</div>}
      </Card>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "var(--surface2)",
          borderRadius: 12,
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ color: "var(--text2)", fontSize: 14 }}>
            {totalRows === 0
              ? "Showing 0 of 0 records"
              : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, totalRows)} of ${totalRows.toLocaleString()} records`}
          </div>
          <div style={{ display: "flex", gap: "0.25rem", alignItems: "center", flexWrap: "wrap" }}>
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(1)}
              style={{
                padding: "0.5rem 0.75rem",
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: "var(--surface)",
                cursor: currentPage <= 1 ? "not-allowed" : "pointer",
              }}
            >
              « First
            </button>
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{
                padding: "0.5rem 0.75rem",
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: "var(--surface)",
                cursor: currentPage <= 1 ? "not-allowed" : "pointer",
              }}
            >
              ‹ Prev
            </button>

            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              const pageNum =
                currentPage <= 4 ? i + 1 : currentPage >= totalPages - 3 ? totalPages - 6 + i : currentPage - 3 + i;
              if (pageNum < 1 || pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    padding: "0.5rem 0.75rem",
                    borderRadius: 6,
                    border: currentPage === pageNum ? "none" : "1px solid var(--border)",
                    background: currentPage === pageNum ? "var(--primary)" : "var(--surface)",
                    color: currentPage === pageNum ? "#fff" : "var(--text)",
                    fontWeight: currentPage === pageNum ? 700 : 500,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{
                padding: "0.5rem 0.75rem",
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: "var(--surface)",
                cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next ›
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              style={{
                padding: "0.5rem 0.75rem",
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: "var(--surface)",
                cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
              }}
            >
              Last »
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <Modal title="Add Cutoff Data" onClose={() => setModal(false)}>
          <FormGrid>
            <FormGroup label="College" full>
              <FormInput name="collegeName" placeholder="College name" />
            </FormGroup>
            <FormGroup label="Department (Branch)">
              <FormInput name="branch" placeholder="CSE / ECE / ..." />
            </FormGroup>
            <FormGroup label="Year">
              <FormInput name="year" type="number" placeholder="2024" />
            </FormGroup>
            <FormGroup label="OC">
              <FormInput name="OC" type="number" placeholder="OC cutoff" />
            </FormGroup>
            <FormGroup label="BC">
              <FormInput name="BC" type="number" placeholder="BC cutoff" />
            </FormGroup>
            <FormGroup label="MBC">
              <FormInput name="MBC" type="number" placeholder="MBC cutoff" />
            </FormGroup>
            <FormGroup label="SC">
              <FormInput name="SC" type="number" placeholder="SC cutoff" />
            </FormGroup>
            <FormGroup label="ST">
              <FormInput name="ST" type="number" placeholder="ST cutoff" />
            </FormGroup>
            <FormGroup label="College Code">
              <FormInput name="collegeCode" placeholder="Counselling code" />
            </FormGroup>
          </FormGrid>
          <FormActions onClose={() => setModal(false)} />
        </Modal>
      )}
    </div>
  );
}

