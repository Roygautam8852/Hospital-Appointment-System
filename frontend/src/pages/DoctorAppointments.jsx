import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Calendar, Clock, CheckCircle, XCircle, Search,
    RefreshCw, Filter, ChevronDown, AlertCircle, UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost:5000/api';

const STATUS_CFG = {
    completed: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', label: 'Completed' },
    confirmed:  { bg: 'rgba(59,130,246,0.15)',  color: '#3b82f6', label: 'Confirmed' },
    accepted:   { bg: 'rgba(59,130,246,0.15)',  color: '#3b82f6', label: 'Confirmed' },
    pending:    { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b', label: 'Pending'   },
    cancelled:  { bg: 'rgba(239,68,68,0.15)',   color: '#ef4444', label: 'Cancelled' },
};

const Badge = ({ status }) => {
    const cfg = STATUS_CFG[status] || STATUS_CFG.pending;
    return (
        <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
            background: cfg.bg, color: cfg.color, textTransform: 'capitalize' }}>
            {cfg.label}
        </span>
    );
};

const FILTERS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

export default function DoctorAppointments() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actioning, setActioning] = useState(null);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    const fetch = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API}/appointments?limit=200`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(data.data || []);
        } catch (_) { setAppointments([]); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetch(); }, []);

    const action = async (id, status) => {
        setActioning(id + status);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API}/appointments/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetch();
        } catch (_) {}
        finally { setActioning(null); }
    };

    const filtered = appointments.filter(a => {
        const matchFilter = filter === 'All' || a.status === filter.toLowerCase() ||
            (filter === 'Confirmed' && a.status === 'accepted');
        const matchSearch = !search || (a.patient?.name || a.patientName || '').toLowerCase().includes(search.toLowerCase()) ||
            (a.reason || '').toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const counts = {
        All: appointments.length,
        Pending: appointments.filter(a => a.status === 'pending').length,
        Confirmed: appointments.filter(a => ['confirmed','accepted'].includes(a.status)).length,
        Completed: appointments.filter(a => a.status === 'completed').length,
        Cancelled: appointments.filter(a => a.status === 'cancelled').length,
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <div style={{ height: 8, width: 8, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px #3b82f6' }} />
                        <span style={{ color: '#3b82f6', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>My Schedule</span>
                    </div>
                    <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Appointments</h1>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginTop: 4 }}>
                        Manage and track all your patient appointments
                    </p>
                </div>
                <button onClick={fetch} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                    background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
                    borderRadius: 12, color: '#93c5fd', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                }}>
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {/* Summary Chips */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
                {FILTERS.map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        padding: '14px 16px', borderRadius: 14, border: '1px solid',
                        borderColor: filter === f ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.06)',
                        background: filter === f ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer', textAlign: 'left'
                    }}>
                        <p style={{ color: filter === f ? '#93c5fd' : 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>{f}</p>
                        <p style={{ color: filter === f ? 'white' : 'rgba(255,255,255,0.6)', fontSize: 22, fontWeight: 800, margin: 0 }}>{counts[f]}</p>
                    </button>
                ))}
            </div>

            {/* Table Card */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
                {/* Search Bar */}
                <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 14px' }}>
                        <Search size={15} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search by patient name or reason..."
                            style={{ background: 'none', border: 'none', outline: 'none', color: 'white', fontSize: 13, width: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.5 }}>
                        <Filter size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{filtered.length} results</span>
                    </div>
                </div>

                {/* Table Head */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1.4fr', gap: 12, padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {['Patient', 'Date & Time', 'Reason', 'Dept.', 'Status', 'Actions'].map(h => (
                        <p key={h} style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{h}</p>
                    ))}
                </div>

                {/* Rows */}
                <div style={{ padding: '12px 0' }}>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                            <RefreshCw size={28} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <Calendar size={36} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 12px', display: 'block' }} />
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No appointments found.</p>
                        </div>
                    ) : filtered.map((appt, i) => {
                        const apptDate = new Date(appt.date || appt.appointmentDate);
                        const isPast = apptDate < new Date();
                        const initials = (appt.patient?.name || appt.patientName || 'P')[0].toUpperCase();
                        return (
                            <motion.div key={appt._id || i}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                                style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1.4fr', gap: 12,
                                    alignItems: 'center', padding: '12px 24px',
                                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                                    transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                {/* Patient */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ height: 36, width: 36, borderRadius: 10, background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93c5fd', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                                        {initials}
                                    </div>
                                    <div>
                                        <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: 0 }}>{appt.patient?.name || appt.patientName || 'Patient'}</p>
                                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '2px 0 0' }}>Age: {appt.patientAge || '—'} · {appt.patientGender || ''}</p>
                                    </div>
                                </div>
                                {/* Date */}
                                <div>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600, margin: 0 }}>
                                        {isNaN(apptDate) ? '—' : apptDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '2px 0 0' }}>{appt.time || '—'}</p>
                                </div>
                                {/* Reason */}
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {appt.reason || '—'}
                                </p>
                                {/* Dept */}
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>{appt.department || '—'}</p>
                                {/* Status */}
                                <Badge status={appt.status} />
                                {/* Actions */}
                                <div style={{ display: 'flex', gap: 6 }}>
                                    {appt.status === 'pending' && !isPast && (
                                        <>
                                            <button onClick={() => action(appt._id, 'confirmed')}
                                                disabled={actioning === appt._id + 'confirmed'}
                                                style={{ flex: 1, padding: '6px 8px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 8, color: '#6ee7b7', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                                                Confirm
                                            </button>
                                            <button onClick={() => action(appt._id, 'cancelled')}
                                                disabled={actioning === appt._id + 'cancelled'}
                                                style={{ flex: 1, padding: '6px 8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#f87171', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                                                Decline
                                            </button>
                                        </>
                                    )}
                                    {['confirmed', 'accepted'].includes(appt.status) && !isPast && (
                                        <button onClick={() => action(appt._id, 'completed')}
                                            disabled={actioning === appt._id + 'completed'}
                                            style={{ flex: 1, padding: '6px 8px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 8, color: '#93c5fd', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                                            Complete
                                        </button>
                                    )}
                                    {appt.status === 'completed' && (
                                        <span style={{ color: 'rgba(16,185,129,0.5)', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <CheckCircle size={13} /> Done
                                        </span>
                                    )}
                                    {appt.status === 'cancelled' && (
                                        <span style={{ color: 'rgba(239,68,68,0.4)', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <XCircle size={13} /> Closed
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </DashboardLayout>
    );
}
