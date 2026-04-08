import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import axios from 'axios';
import {
    Users, Search, Trash2, X, AlertTriangle, Loader2,
    ChevronLeft, ChevronRight, Mail, Phone, Calendar, Check,
    Eye, UserX, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost:5000/api';

export default function AdminPatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [success, setSuccess] = useState('');
    const [viewPatient, setViewPatient] = useState(null);

    const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10, ...(search && { search }) };
            const { data } = await axios.get(`${API}/admin/patients`, { headers: getHeaders(), params });
            if (data.success) {
                setPatients(data.data);
                setTotalPages(data.pages);
                setTotal(data.total);
            }
        } catch (_) {}
        setLoading(false);
    };

    useEffect(() => { fetchPatients(); }, [page, search]);

    const handleDelete = async (id) => {
        setDeleting(true);
        try {
            await axios.delete(`${API}/admin/patients/${id}`, { headers: getHeaders() });
            setSuccess('Patient record removed successfully!');
            setDeleteConfirm(null);
            fetchPatients();
            setTimeout(() => setSuccess(''), 3000);
        } catch (_) {}
        setDeleting(false);
    };

    const inputStyle = { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px', color: 'white', fontSize: 13, fontFamily: 'inherit', outline: 'none' };

    const formatDate = (str) => str ? new Date(str).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    return (
        <DashboardLayout>
            <style>{`input::placeholder { color: rgba(255,255,255,0.2); } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, margin: 0 }}>Patient Management</h1>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: '6px 0 0' }}>{total} patients registered</p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, color: '#10b981', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    <Download size={15} /> Export CSV
                </button>
            </div>

            <AnimatePresence>
                {success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: '12px 18px', marginBottom: 20 }}>
                        <Check size={16} color="#10b981" />
                        <span style={{ color: '#6ee7b7', fontSize: 13, fontWeight: 600 }}>{success}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }}>
                {[
                    { label: 'Total Patients', value: total, color: '#10b981' },
                    { label: 'This Page', value: patients.length, color: '#3b82f6' },
                    { label: 'Page', value: `${page} / ${totalPages}`, color: '#10b981' },
                ].map((s, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 18px' }}>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>{s.label}</p>
                        <p style={{ color: s.color, fontSize: 22, fontWeight: 800, margin: 0 }}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 20 }}>
                <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input placeholder="Search by name or email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                    style={{ ...inputStyle, paddingLeft: 42 }} />
            </div>

            {/* Table */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                            {['Patient', 'Contact', 'Blood Group', 'Gender', 'Joined', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
                                <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 10px', display: 'block' }} />
                                Loading patients...
                            </td></tr>
                        ) : patients.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '60px 0' }}>
                                <Users size={36} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 12px', display: 'block' }} />
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No patients found.</p>
                            </td></tr>
                        ) : patients.map((pat, i) => (
                            <motion.tr key={pat._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <td style={{ padding: '14px 20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ height: 38, width: 38, borderRadius: 11, background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                                            {pat.name?.[0] || 'P'}
                                        </div>
                                        <div>
                                            <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0 }}>{pat.name}</p>
                                            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '2px 0 0' }}>{pat.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                                    {pat.phone || <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                                </td>
                                <td style={{ padding: '14px 20px' }}>
                                    {pat.bloodGroup ? (
                                        <span style={{ padding: '3px 10px', background: 'rgba(239,68,68,0.15)', borderRadius: 20, color: '#f87171', fontSize: 12, fontWeight: 700 }}>
                                            {pat.bloodGroup}
                                        </span>
                                    ) : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>—</span>}
                                </td>
                                <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.5)', fontSize: 13, textTransform: 'capitalize' }}>
                                    {pat.gender || '—'}
                                </td>
                                <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                                    {formatDate(pat.createdAt)}
                                </td>
                                <td style={{ padding: '14px 20px' }}>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => setViewPatient(pat)} style={{ height: 34, width: 34, borderRadius: 9, background: 'rgba(59,130,246,0.15)', border: 'none', color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Eye size={14} />
                                        </button>
                                        <button onClick={() => setDeleteConfirm(pat)} style={{ height: 34, width: 34, borderRadius: 9, background: 'rgba(239,68,68,0.15)', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <UserX size={14} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Page {page} of {totalPages} · {total} total</p>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                style={{ padding: '8px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: 'none', color: page === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                                <ChevronLeft size={14} /> Prev
                            </button>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                style={{ padding: '8px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: 'none', color: page === totalPages ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)', cursor: page === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                                Next <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* View Patient Modal */}
            <AnimatePresence>
                {viewPatient && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            style={{ background: '#131722', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '32px', width: '100%', maxWidth: 480 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ height: 56, width: 56, borderRadius: 16, background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: 800, fontSize: 22 }}>
                                        {viewPatient.name?.[0]}
                                    </div>
                                    <div>
                                        <h2 style={{ color: 'white', fontSize: 18, fontWeight: 800, margin: 0 }}>{viewPatient.name}</h2>
                                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: '3px 0 0' }}>{viewPatient.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => setViewPatient(null)} style={{ height: 36, width: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={16} />
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                {[
                                    { label: 'Phone', value: viewPatient.phone },
                                    { label: 'Gender', value: viewPatient.gender },
                                    { label: 'Blood Group', value: viewPatient.bloodGroup },
                                    { label: 'Date of Birth', value: viewPatient.dob },
                                    { label: 'Address', value: viewPatient.address },
                                    { label: 'Insurance', value: viewPatient.insurance },
                                    { label: 'Allergies', value: viewPatient.allergies },
                                    { label: 'Emergency Contact', value: viewPatient.emergencyContact },
                                ].map((item, i) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '12px 14px' }}>
                                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>{item.label}</p>
                                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, margin: 0 }}>{item.value || '—'}</p>
                                    </div>
                                ))}
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, textAlign: 'center', marginTop: 20 }}>
                                Joined: {formatDate(viewPatient.createdAt)}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirm */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            style={{ background: '#131722', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: '32px', width: '100%', maxWidth: 400, textAlign: 'center' }}>
                            <div style={{ height: 56, width: 56, borderRadius: 16, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: '#f87171' }}>
                                <AlertTriangle size={26} />
                            </div>
                            <h3 style={{ color: 'white', fontSize: 18, fontWeight: 800, margin: '0 0 10px' }}>Remove Patient?</h3>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 28px' }}>
                                Remove <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{deleteConfirm.name}</strong>'s record permanently?
                            </p>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                <button onClick={() => handleDelete(deleteConfirm._id)} disabled={deleting}
                                    style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'linear-gradient(135deg, #dc2626, #ef4444)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    {deleting ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={15} />}
                                    Remove
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
