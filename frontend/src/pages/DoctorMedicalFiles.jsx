import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    FileText, Plus, X, RefreshCw, Search, Pill,
    FlaskConical, ScanLine, File, Trash2, ChevronDown, ChevronUp, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost:5000/api';

const TYPE_CFG = {
    prescription: { label: 'Prescription', color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: Pill },
    lab_report:   { label: 'Lab Report',   color: '#3b82f6', bg: 'rgba(59,130,246,0.15)',  icon: FlaskConical },
    imaging:      { label: 'Imaging',      color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)',  icon: ScanLine },
    other:        { label: 'Other',        color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',  icon: File },
};

const TYPES = ['prescription', 'lab_report', 'imaging', 'other'];
const CATEGORIES = ['General', 'Cardiology', 'Neurology', 'Radiology', 'Haematology', 'Pediatrics', 'Orthopedics', 'Dermatology'];

const emptyForm = {
    patient: '', title: '', type: 'prescription', category: 'General', description: '',
    medicines: [{ name: '', dosage: '', duration: '' }],
    labResults: { testName: '', resultValue: '', normalRange: '', unit: '' },
    imagingDetails: { bodyPart: '', imaging: '', findings: '' },
};

export default function DoctorMedicalFiles() {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [expanded, setExpanded] = useState(null);
    const [toast, setToast] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const [recRes, apptRes] = await Promise.all([
                axios.get(`${API}/medical-records`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API}/appointments?limit=200`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            setRecords(recRes.data.data || []);
            // Build unique patient list
            const pm = {};
            (apptRes.data.data || []).forEach(a => {
                const pid = a.patient?._id;
                if (pid && !pm[pid]) pm[pid] = { _id: pid, name: a.patient?.name || a.patientName, email: a.patient?.email };
            });
            setPatients(Object.values(pm));
        } catch (_) {}
        finally { setLoading(false); }
    };

    useEffect(() => { fetchRecords(); }, []);

    const filteredRecords = records.filter(r => {
        const matchType = filterType === 'all' || r.type === filterType;
        const matchSearch = !search || r.title?.toLowerCase().includes(search.toLowerCase()) ||
            r.patient?.name?.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
    });

    const handleSave = async () => {
        if (!form.patient || !form.title) { showToast('Patient and title are required', 'error'); return; }
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API}/medical-records`, form, { headers: { Authorization: `Bearer ${token}` } });
            setShowForm(false);
            setForm(emptyForm);
            await fetchRecords();
            showToast('Medical record created!');
        } catch (e) {
            showToast(e.response?.data?.message || 'Failed to create record', 'error');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        setDeleting(id);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API}/medical-records/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            await fetchRecords();
            showToast('Record deleted');
        } catch (_) { showToast('Failed to delete', 'error'); }
        finally { setDeleting(null); }
    };

    const updateMed = (idx, key, val) => {
        const meds = [...form.medicines];
        meds[idx] = { ...meds[idx], [key]: val };
        setForm(f => ({ ...f, medicines: meds }));
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <div style={{ height: 8, width: 8, borderRadius: '50%', background: '#8b5cf6', boxShadow: '0 0 8px #8b5cf6' }} />
                        <span style={{ color: '#8b5cf6', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Medical Files</span>
                    </div>
                    <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, margin: 0 }}>Medical Records</h1>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginTop: 4 }}>Issue and manage patient medical records & prescriptions</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={fetchRecords} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        <RefreshCw size={14} />
                    </button>
                    <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.35)', borderRadius: 12, color: '#c4b5fd', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                        <Plus size={16} /> New Record
                    </button>
                </div>
            </div>

            {/* Type filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                {[{ key: 'all', label: 'All Records', count: records.length }, ...TYPES.map(t => ({ key: t, label: TYPE_CFG[t].label, count: records.filter(r => r.type === t).length }))].map(f => (
                    <button key={f.key} onClick={() => setFilterType(f.key)} style={{
                        padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: '1px solid',
                        borderColor: filterType === f.key ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)',
                        background: filterType === f.key ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                        color: filterType === f.key ? '#c4b5fd' : 'rgba(255,255,255,0.45)',
                    }}>
                        {f.label} <span style={{ opacity: 0.6 }}>({f.count})</span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 16px', marginBottom: 20 }}>
                <Search size={15} style={{ color: 'rgba(255,255,255,0.25)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search records by title or patient..." 
                    style={{ background: 'none', border: 'none', outline: 'none', color: 'white', fontSize: 13, width: '100%' }} />
            </div>

            {/* Records List */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                    <RefreshCw size={30} style={{ color: '#8b5cf6', animation: 'spin 1s linear infinite' }} />
                </div>
            ) : filteredRecords.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <FileText size={40} style={{ color: 'rgba(255,255,255,0.08)', margin: '0 auto 12px', display: 'block' }} />
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>No medical records yet.</p>
                    <button onClick={() => setShowForm(true)} style={{ marginTop: 12, padding: '8px 20px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 10, color: '#c4b5fd', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                        + Create First Record
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {filteredRecords.map((rec, i) => {
                        const cfg = TYPE_CFG[rec.type] || TYPE_CFG.other;
                        const IconComp = cfg.icon;
                        const isExp = expanded === rec._id;
                        return (
                            <motion.div key={rec._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
                                {/* Row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', cursor: 'pointer' }}
                                    onClick={() => setExpanded(isExp ? null : rec._id)}>
                                    <div style={{ height: 44, width: 44, borderRadius: 12, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cfg.color, flexShrink: 0 }}>
                                        <IconComp size={20} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                            <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0 }}>{rec.title}</p>
                                            <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                                        </div>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>
                                            Patient: {rec.patient?.name || '—'} · {rec.category || 'General'} · {new Date(rec.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <button onClick={e => { e.stopPropagation(); handleDelete(rec._id); }}
                                            disabled={deleting === rec._id}
                                            style={{ height: 32, width: 32, borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', cursor: 'pointer' }}>
                                            <Trash2 size={13} />
                                        </button>
                                        {isExp ? <ChevronUp size={16} style={{ color: '#8b5cf6' }} /> : <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />}
                                    </div>
                                </div>
                                {/* Expanded Details */}
                                <AnimatePresence>
                                    {isExp && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                            style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ padding: '16px 20px' }}>
                                                {rec.description && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 14 }}>{rec.description}</p>}
                                                {rec.type === 'prescription' && rec.medicines?.length > 0 && (
                                                    <div>
                                                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Medicines</p>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                            {rec.medicines.map((m, j) => (
                                                                <div key={j} style={{ display: 'flex', gap: 16, padding: '8px 14px', background: 'rgba(16,185,129,0.08)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.15)' }}>
                                                                    <p style={{ color: '#6ee7b7', fontSize: 13, fontWeight: 700, margin: 0, flex: 1 }}>{m.name || '—'}</p>
                                                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{m.dosage || '—'}</p>
                                                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{m.duration || '—'}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {rec.type === 'lab_report' && rec.labResults?.testName && (
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                                                        {[['Test Name', rec.labResults.testName], ['Result', rec.labResults.resultValue], ['Normal Range', rec.labResults.normalRange], ['Unit', rec.labResults.unit]].map(([k, v]) => (
                                                            <div key={k} style={{ background: 'rgba(59,130,246,0.08)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(59,130,246,0.15)' }}>
                                                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', margin: '0 0 4px' }}>{k}</p>
                                                                <p style={{ color: '#93c5fd', fontSize: 14, fontWeight: 700, margin: 0 }}>{v || '—'}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {rec.type === 'imaging' && rec.imagingDetails?.bodyPart && (
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                                                        {[['Body Part', rec.imagingDetails.bodyPart], ['Imaging Type', rec.imagingDetails.imaging], ['Findings', rec.imagingDetails.findings]].map(([k, v]) => (
                                                            <div key={k} style={{ background: 'rgba(139,92,246,0.08)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(139,92,246,0.15)' }}>
                                                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', margin: '0 0 4px' }}>{k}</p>
                                                                <p style={{ color: '#c4b5fd', fontSize: 13, fontWeight: 700, margin: 0 }}>{v || '—'}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* ── New Record Modal ── */}
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
                        onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
                        <motion.div initial={{ scale: 0.93, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.93, opacity: 0, y: 30 }}
                            style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                <div>
                                    <h2 style={{ color: 'white', fontSize: 18, fontWeight: 800, margin: 0 }}>New Medical Record</h2>
                                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: '4px 0 0' }}>Issue a record for a patient</p>
                                </div>
                                <button onClick={() => setShowForm(false)} style={{ height: 34, width: 34, borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Fields */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {/* Patient Dropdown */}
                                <div>
                                    <label style={labelStyle}>Patient *</label>
                                    <select value={form.patient} onChange={e => setForm(f => ({ ...f, patient: e.target.value }))} style={inputStyle}>
                                        <option value="">Select patient...</option>
                                        {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div>
                                        <label style={labelStyle}>Record Type *</label>
                                        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
                                            {TYPES.map(t => <option key={t} value={t}>{TYPE_CFG[t].label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Category</label>
                                        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>Title *</label>
                                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Follow-up prescription" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Notes / Description</label>
                                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Additional notes..." style={{ ...inputStyle, resize: 'vertical' }} />
                                </div>

                                {/* Type-specific sub-forms */}
                                {form.type === 'prescription' && (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                            <label style={labelStyle}>Medicines</label>
                                            <button onClick={() => setForm(f => ({ ...f, medicines: [...f.medicines, { name: '', dosage: '', duration: '' }] }))}
                                                style={{ fontSize: 12, color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>+ Add Medicine</button>
                                        </div>
                                        {form.medicines.map((m, idx) => (
                                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 30px', gap: 8, marginBottom: 8 }}>
                                                <input placeholder="Medicine name" value={m.name} onChange={e => updateMed(idx, 'name', e.target.value)} style={inputStyle} />
                                                <input placeholder="Dosage" value={m.dosage} onChange={e => updateMed(idx, 'dosage', e.target.value)} style={inputStyle} />
                                                <input placeholder="Duration" value={m.duration} onChange={e => updateMed(idx, 'duration', e.target.value)} style={inputStyle} />
                                                <button onClick={() => setForm(f => ({ ...f, medicines: f.medicines.filter((_, j) => j !== idx) }))}
                                                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#f87171', cursor: 'pointer' }}>
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {form.type === 'lab_report' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                        {[['testName', 'Test Name'], ['resultValue', 'Result Value'], ['normalRange', 'Normal Range'], ['unit', 'Unit']].map(([k, lbl]) => (
                                            <div key={k}>
                                                <label style={labelStyle}>{lbl}</label>
                                                <input value={form.labResults[k]} onChange={e => setForm(f => ({ ...f, labResults: { ...f.labResults, [k]: e.target.value } }))} placeholder={lbl} style={inputStyle} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {form.type === 'imaging' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                        {[['bodyPart', 'Body Part'], ['imaging', 'Imaging Type'], ['findings', 'Findings']].map(([k, lbl]) => (
                                            <div key={k}>
                                                <label style={labelStyle}>{lbl}</label>
                                                <input value={form.imagingDetails[k]} onChange={e => setForm(f => ({ ...f, imagingDetails: { ...f.imagingDetails, [k]: e.target.value } }))} placeholder={lbl} style={inputStyle} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                                <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: '12px', background: 'rgba(139,92,246,0.25)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: 12, color: '#c4b5fd', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    {saving ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={16} />}
                                    {saving ? 'Saving...' : 'Create Record'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 14, fontWeight: 700, fontSize: 13, color: 'white', background: toast.type === 'success' ? '#059669' : '#dc2626', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                        {toast.type === 'success' ? <CheckCircle size={16} /> : <X size={16} />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </DashboardLayout>
    );
}

const inputStyle = {
    width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white',
    fontSize: 13, outline: 'none', boxSizing: 'border-box',
};

const labelStyle = {
    color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6,
};
