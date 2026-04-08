import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import axios from 'axios';
import {
    Calendar, Search, Filter, ChevronLeft, ChevronRight,
    Loader2, Clock, CheckCircle, XCircle, AlertCircle,
    User, Stethoscope, DollarSign, RefreshCw, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost:5000/api';

const STATUS_CONFIG = {
    pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', icon: Clock },
    confirmed: { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', icon: CheckCircle },
    completed: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: CheckCircle },
    cancelled: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', icon: XCircle },
};

export default function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [updatingId, setUpdatingId] = useState(null);

    const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10, status: filterStatus, ...(search && { search }) };
            const { data } = await axios.get(`${API}/admin/appointments`, { headers: getHeaders(), params });
            if (data.success) {
                setAppointments(data.data);
                setTotalPages(data.pages || 1);
                setTotal(data.total);
            }
        } catch (_) {}
        setLoading(false);
    };

    useEffect(() => { fetchAppointments(); }, [page, filterStatus, search]);

    const updateStatus = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            await axios.put(`${API}/admin/appointments/${id}/status`, { status: newStatus }, { headers: getHeaders() });
            setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
        } catch (_) {}
        setUpdatingId(null);
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
    const formatTime = (d) => d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '';

    const statusCounts = appointments.reduce((acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
    }, {});

    const inputStyle = { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px', color: 'white', fontSize: 13, fontFamily: 'inherit', outline: 'none' };

    return (
        <DashboardLayout>
            <style>{`input::placeholder, select option { color: rgba(255,255,255,0.2); } select option { background: #1a1d27; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, margin: 0 }}>Appointment Management</h1>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: '6px 0 0' }}>{total} total appointments</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={fetchAppointments} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 18px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, color: '#10b981', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Status filter pills */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => {
                    const cfg = STATUS_CONFIG[s] || { color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.05)' };
                    const isActive = filterStatus === s;
                    return (
                        <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
                            style={{
                                padding: '8px 18px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize',
                                background: isActive ? cfg.bg : 'rgba(255,255,255,0.04)',
                                border: isActive ? `1px solid ${cfg.color}50` : '1px solid rgba(255,255,255,0.08)',
                                color: isActive ? cfg.color : 'rgba(255,255,255,0.4)',
                                transition: 'all 0.2s'
                            }}>
                            {s === 'all' ? `All (${total})` : `${s} ${statusCounts[s] ? `(${statusCounts[s]})` : ''}`}
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 20 }}>
                <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input placeholder="Search by patient or doctor name..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                    style={{ ...inputStyle, paddingLeft: 42 }} />
            </div>

            {/* Table */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                {['Patient', 'Doctor', 'Date & Time', 'Status', 'Fee', 'Change Status'].map(h => (
                                    <th key={h} style={{ padding: '14px 18px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
                                    <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 10px', display: 'block' }} />
                                    Loading appointments...
                                </td></tr>
                            ) : appointments.length === 0 ? (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '60px 0' }}>
                                    <Calendar size={36} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 12px', display: 'block' }} />
                                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No appointments found.</p>
                                </td></tr>
                            ) : appointments.map((appt, i) => {
                                const cfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG.pending;
                                return (
                                    <motion.tr key={appt._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '14px 18px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ height: 36, width: 36, borderRadius: 10, background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                                                    {(appt.patient?.name || 'P')[0]}
                                                </div>
                                                <div>
                                                    <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: 0 }}>{appt.patient?.name || 'Unknown'}</p>
                                                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '1px 0 0' }}>{appt.patient?.email || ''}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 18px' }}>
                                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, margin: 0 }}>Dr. {appt.doctor?.name || 'Unknown'}</p>
                                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '2px 0 0' }}>{appt.doctor?.specialization || ''}</p>
                                        </td>
                                        <td style={{ padding: '14px 18px' }}>
                                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, margin: 0 }}>{formatDate(appt.date)}</p>
                                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '2px 0 0' }}>{appt.slot || appt.time || '—'}</p>
                                        </td>
                                        <td style={{ padding: '14px 18px' }}>
                                            <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: cfg.bg, color: cfg.color, textTransform: 'capitalize' }}>
                                                {appt.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 18px', color: '#10b981', fontSize: 13, fontWeight: 700 }}>
                                            {appt.fee ? `₹${appt.fee}` : '—'}
                                        </td>
                                        <td style={{ padding: '14px 18px' }}>
                                            {updatingId === appt._id ? (
                                                <Loader2 size={16} style={{ color: '#10b981', animation: 'spin 1s linear infinite' }} />
                                            ) : (
                                                <select value={appt.status}
                                                    onChange={e => updateStatus(appt._id, e.target.value)}
                                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, padding: '6px 12px', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}>
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            )}
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Page {page} of {totalPages}</p>
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
        </DashboardLayout>
    );
}
