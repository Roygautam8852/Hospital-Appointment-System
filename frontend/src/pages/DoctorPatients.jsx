import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import axios from 'axios';
import { Search, RefreshCw, Users, Calendar, Clock, Activity, Phone, Mail, ChevronDown, ChevronUp, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost:5000/api';

const STATUS_COLOR = {
    completed: '#10b981', confirmed: '#3b82f6', accepted: '#3b82f6',
    pending: '#f59e0b', cancelled: '#ef4444',
};

export default function DoctorPatients() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState(null);

    const fetchData = async () => {
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

    useEffect(() => { fetchData(); }, []);

    // Build unique patient list from appointments
    const patientMap = {};
    appointments.forEach(a => {
        const pid = a.patient?._id || a.patientName;
        if (!pid) return;
        if (!patientMap[pid]) {
            patientMap[pid] = {
                id: pid,
                name: a.patient?.name || a.patientName || 'Unknown',
                email: a.patient?.email || '—',
                phone: a.patient?.phone || '—',
                gender: a.patientGender || '—',
                age: a.patientAge || '—',
                appointments: [],
            };
        }
        patientMap[pid].appointments.push(a);
    });

    const patients = Object.values(patientMap).filter(p =>
        !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));

    const getLastVisit = (appts) => {
        const completed = appts.filter(a => a.status === 'completed')
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        if (completed.length === 0) return '—';
        return new Date(completed[0].date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getNextAppt = (appts) => {
        const upcoming = appts
            .filter(a => ['confirmed', 'accepted', 'pending'].includes(a.status) && new Date(a.date) > new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        if (upcoming.length === 0) return null;
        return upcoming[0];
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <div style={{ height: 8, width: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                        <span style={{ color: '#10b981', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Patient Registry</span>
                    </div>
                    <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>My Patients</h1>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginTop: 4 }}>
                        {patients.length} unique patient{patients.length !== 1 ? 's' : ''} from your appointments
                    </p>
                </div>
                <button onClick={fetchData} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                    background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: 12, color: '#6ee7b7', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                }}>
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Total Patients', value: patients.length, color: '#10b981', bg: '#10b981' },
                    { label: 'With Upcoming Appointments', value: patients.filter(p => getNextAppt(p.appointments)).length, color: '#3b82f6', bg: '#3b82f6' },
                    { label: 'Completed Visits', value: appointments.filter(a => a.status === 'completed').length, color: '#8b5cf6', bg: '#8b5cf6' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: `radial-gradient(circle at 100% 0%, ${s.bg}20 0%, transparent 70%)` }} />
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{s.label}</p>
                        <p style={{ color: 'white', fontSize: 30, fontWeight: 800 }}>{s.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Search + Table */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
                {/* Search bar */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 14px' }}>
                        <Search size={15} style={{ color: 'rgba(255,255,255,0.25)' }} />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search patients by name or email..."
                            style={{ background: 'none', border: 'none', outline: 'none', color: 'white', fontSize: 13, width: '100%' }} />
                    </div>
                </div>

                {/* Table Head */}
                <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr 1fr 1.2fr 1fr 40px', gap: 12, padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {['Patient', 'Contact', 'Gender / Age', 'Last Visit', 'Next Appt.', ''].map(h => (
                        <p key={h} style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{h}</p>
                    ))}
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                        <RefreshCw size={28} style={{ color: '#10b981', animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : patients.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <Users size={36} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 12px', display: 'block' }} />
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No patients found.</p>
                    </div>
                ) : (
                    <div>
                        {patients.map((p, i) => {
                            const nextAppt = getNextAppt(p.appointments);
                            const isExpanded = expanded === p.id;
                            return (
                                <div key={p.id}>
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                        style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr 1fr 1.2fr 1fr 40px', gap: 12,
                                            alignItems: 'center', padding: '14px 24px',
                                            borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        onClick={() => setExpanded(isExpanded ? null : p.id)}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ height: 38, width: 38, borderRadius: 11, background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6ee7b7', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                                                {p.name[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: 0 }}>{p.name}</p>
                                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '2px 0 0' }}>{p.appointments.length} appointment{p.appointments.length !== 1 ? 's' : ''}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0, display: 'flex', alignItems: 'center', gap: 5 }}><Mail size={11} /> {p.email}</p>
                                            {p.phone !== '—' && <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: 5 }}><Phone size={11} /> {p.phone}</p>}
                                        </div>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>{p.gender} / {p.age}y</p>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>{getLastVisit(p.appointments)}</p>
                                        <div>
                                            {nextAppt ? (
                                                <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'rgba(59,130,246,0.15)', color: '#93c5fd' }}>
                                                    {new Date(nextAppt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                </span>
                                            ) : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>—</span>}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            {isExpanded ? <ChevronUp size={16} style={{ color: '#3b82f6' }} /> : <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />}
                                        </div>
                                    </motion.div>

                                    {/* Expanded appointment history */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                style={{ overflow: 'hidden', background: 'rgba(59,130,246,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div style={{ padding: '16px 24px 16px 72px' }}>
                                                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Appointment History</p>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                        {p.appointments.sort((a, b) => new Date(b.date) - new Date(a.date)).map((appt, j) => {
                                                            const d = new Date(appt.date);
                                                            const sc = STATUS_COLOR[appt.status] || '#94a3b8';
                                                            return (
                                                                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
                                                                    <div style={{ width: 4, height: 28, borderRadius: 4, background: sc, flexShrink: 0 }} />
                                                                    <div style={{ flex: 1 }}>
                                                                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, margin: 0 }}>{appt.reason || '—'}</p>
                                                                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '2px 0 0' }}>{appt.department || '—'}</p>
                                                                    </div>
                                                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${sc}20`, color: sc, textTransform: 'capitalize' }}>{appt.status}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </DashboardLayout>
    );
}
