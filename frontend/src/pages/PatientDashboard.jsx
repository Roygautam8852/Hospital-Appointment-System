import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Calendar, Clock, CheckCircle, XCircle, RefreshCw, Plus,
    Activity, CreditCard, Pill, ArrowRight, TrendingUp,
    HeartPulse, Droplets, Thermometer, Wind, Phone,
    FileText, Download, AlertTriangle, Zap, Star,
    Shield, Award, Users, Lock, User, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const API = 'http://localhost:5000/api';

// ── helpers ──────────────────────────────────────────────────────────────────
const tok = () => localStorage.getItem('token');
const hdr = () => ({ Authorization: `Bearer ${tok()}` });

const STATUS_CFG = {
    completed: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', label: 'Completed' },
    confirmed:  { bg: 'rgba(59,130,246,0.15)',  color: '#3b82f6', label: 'Confirmed' },
    accepted:   { bg: 'rgba(59,130,246,0.15)',  color: '#3b82f6', label: 'Confirmed' },
    pending:    { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b', label: 'Pending'   },
    cancelled:  { bg: 'rgba(239,68,68,0.15)',   color: '#ef4444', label: 'Cancelled' },
    expired:    { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8', label: 'Expired'   },
};

const Badge = ({ status }) => {
    const cfg = STATUS_CFG[status] || STATUS_CFG.pending;
    return (
        <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
            background: cfg.bg, color: cfg.color }}>
            {cfg.label}
        </span>
    );
};

// ── chart configs ─────────────────────────────────────────────────────────────
const chartDefaults = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 }, stepSize: 1 }, beginAtZero: true },
    },
};

// ── small stat card ───────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, delay, trend, glow }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '22px 24px', position: 'relative', overflow: 'hidden', cursor: 'default' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: `radial-gradient(circle at 100% 0%, ${glow || color}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ height: 42, width: 42, borderRadius: 13, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={19} style={{ color }} />
            </div>
            {trend !== undefined && (
                <span style={{ fontSize: 11, fontWeight: 700, color: trend >= 0 ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <TrendingUp size={12} /> {trend >= 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <p style={{ color: 'white', fontSize: 28, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.5px' }}>{value}</p>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
    </motion.div>
);

// ── Card wrapper ──────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, ...style }}>
        {children}
    </div>
);

const CardHead = ({ title, sub, children }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
            <p style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0 }}>{title}</p>
            {sub && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: '3px 0 0' }}>{sub}</p>}
        </div>
        {children}
    </div>
);

// ═════════════════════════════════════════════════════════════════════════════
export default function PatientDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(t);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API}/appointments`, {
                headers: hdr(), params: { limit: 200 }
            });
            setAppointments(data.data || []);
        } catch (_) { setAppointments([]); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    // ── derivations ────────────────────────────────────────────────────────
    const isExpired = (a) => new Date(a.date) < now && !['completed','cancelled'].includes(a.status);
    const getStatus = (a) => isExpired(a) ? 'expired' : a.status;

    const upcoming  = appointments.filter(a => ['confirmed','accepted','pending'].includes(getStatus(a)) && new Date(a.date) >= now);
    const completed = appointments.filter(a => a.status === 'completed');
    const cancelled = appointments.filter(a => a.status === 'cancelled');
    const totalSpent = appointments.filter(a => a.paymentStatus === 'paid').reduce((s, a) => s + (a.amount || 0), 0);

    const greeting = () => {
        const h = now.getHours();
        return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    };

    const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    // Monthly activity bar chart (last 6 months)
    const monthlyData = (() => {
        const labels = [];
        const counts = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            labels.push(d.toLocaleString('default', { month: 'short' }));
            const cnt = appointments.filter(a => {
                const ad = new Date(a.date);
                return ad.getMonth() === d.getMonth() && ad.getFullYear() === d.getFullYear();
            }).length;
            counts.push(cnt);
        }
        return { labels, counts };
    })();

    const statusData = {
        labels: ['Completed', 'Upcoming', 'Cancelled'],
        datasets: [{ data: [completed.length, upcoming.length, cancelled.length], backgroundColor: ['#10b981', '#3b82f6', '#ef4444'], borderWidth: 0, hoverOffset: 6 }],
    };

    const lineData = {
        labels: monthlyData.labels,
        datasets: [{
            data: monthlyData.counts,
            borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)',
            borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: '#10b981', fill: true, tension: 0.4,
        }],
    };

    const barData = {
        labels: monthlyData.labels,
        datasets: [{
            data: monthlyData.counts,
            backgroundColor: monthlyData.counts.map((_, i) => i === monthlyData.counts.length - 1 ? '#10b981' : 'rgba(16,185,129,0.25)'),
            borderRadius: 6, borderSkipped: false,
        }],
    };

    // filtered appointments table
    const tabMap = { upcoming, completed, cancelled };
    const filteredApts = (tabMap[activeTab] || upcoming).sort((a, b) => new Date(b.date) - new Date(a.date));

    const nextAppt = upcoming.sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    const vitals = [
        { label: 'Heart Rate', value: '72', unit: 'bpm', icon: HeartPulse, color: '#ef4444' },
        { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity, color: '#3b82f6' },
        { label: 'Blood Sugar', value: '98', unit: 'mg/dL', icon: Droplets, color: '#f59e0b' },
        { label: 'Temperature', value: '98.6', unit: '°F', icon: Thermometer, color: '#8b5cf6' },
    ];

    // ── render ─────────────────────────────────────────────────────────────
    return (
        <DashboardLayout>
            {/* ── Page Header ───────────────────────────────────────────────── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <div style={{ height: 8, width: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulse 2s ease-in-out infinite' }} />
                        <span style={{ color: '#10b981', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Patient Portal · Live</span>
                    </div>
                    <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                        {greeting()}, <span style={{ color: '#6ee7b7' }}>{user?.name?.split(' ')[0] || 'there'} 👋</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginTop: 4 }}>
                        {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        {upcoming.length > 0 && <span style={{ color: '#6ee7b7', fontWeight: 600 }}> · {upcoming.length} upcoming appointment{upcoming.length > 1 ? 's' : ''}</span>}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <button onClick={() => navigate('/patient/book')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 12, color: '#6ee7b7', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                        <Plus size={15} /> Book Appointment
                    </button>
                </div>
            </div>

            {/* ── Emergency Banner ──────────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Phone size={14} style={{ color: '#f87171' }} />
                    <span style={{ color: '#f87171', fontSize: 13, fontWeight: 700 }}>Emergency Helpline: +91-911-CARE</span>
                    <span style={{ color: 'rgba(239,68,68,0.5)', fontSize: 12 }}>· Available 24/7</span>
                </div>
                <span style={{ color: 'rgba(239,68,68,0.5)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Immediate Response</span>
            </div>

            {/* ── Stat Cards ────────────────────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                <StatCard icon={Calendar}     label="Upcoming"     value={upcoming.length}  color="#10b981" delay={0}    trend={12.4} glow="#10b981" />
                <StatCard icon={CheckCircle}  label="Completed"    value={completed.length} color="#3b82f6" delay={0.06} trend={8.1}  glow="#3b82f6" />
                <StatCard icon={CreditCard}   label="Total Spent"  value={`₹${totalSpent.toLocaleString('en-IN')}`} color="#8b5cf6" delay={0.12} />
                <StatCard icon={XCircle}      label="Cancelled"    value={cancelled.length} color="#ef4444" delay={0.18} />
            </div>

            {/* ── Main Grid ─────────────────────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
                {/* Monthly Activity Line */}
                <Card style={{ gridColumn: 'span 2' }}>
                    <CardHead title="Monthly Activity" sub="Appointments over the last 6 months" />
                    <div style={{ padding: '20px 24px', height: 200 }}>
                        <Line data={lineData} options={{ ...chartDefaults, plugins: { ...chartDefaults.plugins, legend: { display: false } } }} />
                    </div>
                </Card>

                {/* Status Doughnut */}
                <Card>
                    <CardHead title="Visit Status" sub="Appointment breakdown" />
                    <div style={{ padding: '20px 24px', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {appointments.length > 0 ? (
                            <Doughnut data={statusData} options={{ ...chartDefaults, cutout: '70%', scales: undefined, plugins: { legend: { display: true, position: 'bottom', labels: { color: 'rgba(255,255,255,0.4)', font: { size: 11 }, boxWidth: 10, padding: 12 } } } }} />
                        ) : (
                            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>No data yet</p>
                        )}
                    </div>
                </Card>
            </div>

            {/* ── Second Row: Appointments + Side ───────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>
                {/* Appointments Card */}
                <Card>
                    <CardHead title="My Appointments" sub={`${appointments.length} total records`}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            {/* Tab switcher */}
                            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 3, gap: 3 }}>
                                {['upcoming', 'completed', 'cancelled'].map(t => (
                                    <button key={t} onClick={() => setActiveTab(t)} style={{
                                        padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none',
                                        background: activeTab === t ? 'rgba(16,185,129,0.2)' : 'transparent',
                                        color: activeTab === t ? '#6ee7b7' : 'rgba(255,255,255,0.3)',
                                        textTransform: 'capitalize',
                                    }}>{t}</button>
                                ))}
                            </div>
                            <button onClick={() => navigate('/patient/book')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 9, color: '#6ee7b7', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                <Plus size={13} /> New
                            </button>
                        </div>
                    </CardHead>

                    {/* Table head */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr', gap: 12, padding: '10px 22px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        {['Doctor', 'Date & Time', 'Dept.', 'Status'].map(h => (
                            <p key={h} style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{h}</p>
                        ))}
                    </div>

                    <div style={{ padding: '8px 0' }}>
                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                                <RefreshCw size={24} style={{ color: '#10b981', animation: 'spin 1s linear infinite' }} />
                            </div>
                        ) : filteredApts.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <Calendar size={32} style={{ color: 'rgba(255,255,255,0.08)', margin: '0 auto 10px', display: 'block' }} />
                                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, marginBottom: 14 }}>No {activeTab} appointments</p>
                                {activeTab === 'upcoming' && (
                                    <button onClick={() => navigate('/patient/book')} style={{ padding: '8px 20px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, color: '#6ee7b7', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                        Book Appointment
                                    </button>
                                )}
                            </div>
                        ) : filteredApts.slice(0, 6).map((apt, i) => {
                            const d = new Date(apt.date);
                            const docImg = apt.doctor?.profileImage && apt.doctor.profileImage !== 'default-avatar.png'
                                ? (apt.doctor.profileImage.startsWith('http') ? apt.doctor.profileImage : `http://localhost:5000/${apt.doctor.profileImage}`)
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor?.name || 'D')}&background=10b981&color=fff&bold=true&size=80`;
                            return (
                                <motion.div key={apt._id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                                    style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr', gap: 12, alignItems: 'center', padding: '12px 22px', borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.15s', cursor: 'default' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    {/* Doctor */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <img src={docImg} alt="" style={{ height: 34, width: 34, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} onError={e => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=D&background=10b981&color=fff&bold=true`; }} />
                                        <div>
                                            <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: 0 }}>{apt.doctor?.name || 'Doctor'}</p>
                                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '2px 0 0' }}>{apt.doctor?.specialization || '—'}</p>
                                        </div>
                                    </div>
                                    {/* Date */}
                                    <div>
                                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, margin: 0 }}>{isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '2px 0 0' }}>{apt.time || '—'}</p>
                                    </div>
                                    {/* Dept */}
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>{apt.department || '—'}</p>
                                    {/* Status */}
                                    <Badge status={getStatus(apt)} />
                                </motion.div>
                            );
                        })}
                    </div>

                    {appointments.length > 6 && (
                        <div style={{ padding: '12px 22px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => navigate('/patient/history')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6ee7b7', fontSize: 12, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                                View all history <ArrowRight size={13} />
                            </button>
                        </div>
                    )}
                </Card>

                {/* Right column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Next Appointment */}
                    {nextAppt ? (
                        <Card>
                            <div style={{ padding: '16px 20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                                    <div style={{ height: 7, width: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                                    <p style={{ color: '#6ee7b7', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Next Appointment</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                                    <img src={nextAppt.doctor?.profileImage && nextAppt.doctor.profileImage !== 'default-avatar.png'
                                        ? (nextAppt.doctor.profileImage.startsWith('http') ? nextAppt.doctor.profileImage : `http://localhost:5000/${nextAppt.doctor.profileImage}`)
                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(nextAppt.doctor?.name || 'D')}&background=10b981&color=fff&bold=true`}
                                        alt="" style={{ height: 46, width: 46, borderRadius: 14, objectFit: 'cover', border: '2px solid rgba(16,185,129,0.3)' }} />
                                    <div>
                                        <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0 }}>{nextAppt.doctor?.name || 'Doctor'}</p>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '3px 0 0' }}>{nextAppt.doctor?.specialization || '—'}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                    <div style={{ padding: '10px 12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 11 }}>
                                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Date</p>
                                        <p style={{ color: '#6ee7b7', fontSize: 12, fontWeight: 700, margin: 0 }}>{fmt(nextAppt.date)}</p>
                                    </div>
                                    <div style={{ padding: '10px 12px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 11 }}>
                                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Time</p>
                                        <p style={{ color: '#93c5fd', fontSize: 12, fontWeight: 700, margin: 0 }}>{nextAppt.time || '—'}</p>
                                    </div>
                                </div>
                                <div style={{ marginTop: 10 }}>
                                    <Badge status={getStatus(nextAppt)} />
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Card>
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                <Calendar size={28} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 10px', display: 'block' }} />
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginBottom: 12 }}>No upcoming appointments</p>
                                <button onClick={() => navigate('/patient/book')} style={{ padding: '8px 18px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, color: '#6ee7b7', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                    Book Now
                                </button>
                            </div>
                        </Card>
                    )}

                    {/* Health Score Card */}
                    <Card style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(59,130,246,0.08) 100%)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                <div style={{ height: 38, width: 38, borderRadius: 12, background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Activity size={17} style={{ color: '#6ee7b7' }} />
                                </div>
                                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: 20 }}>Weekly</span>
                            </div>
                            <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>Health Pulse</p>
                            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '0 0 14px' }}>Vitality and wellness score</p>
                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 48 }}>
                                    {[40, 65, 45, 95, 60, 80, 55].map((h, i) => (
                                        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }}
                                            transition={{ delay: i * 0.1, duration: 0.7 }}
                                            style={{ width: 10, borderRadius: 4, background: i === 3 ? '#10b981' : 'rgba(255,255,255,0.12)' }} />
                                    ))}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ color: '#6ee7b7', fontSize: 30, fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>92%</p>
                                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Optimal</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHead title="Quick Actions" />
                        <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[
                                { label: 'Book Appt.', icon: Calendar, color: '#10b981', action: () => navigate('/patient/book') },
                                { label: 'My Records', icon: FileText, color: '#3b82f6', action: () => navigate('/patient/records') },
                                { label: 'Prescriptions', icon: Pill, color: '#8b5cf6', action: () => navigate('/patient/history') },
                                { label: 'Emergency', icon: Phone, color: '#ef4444', action: () => {} },
                            ].map((q, i) => (
                                <button key={i} onClick={q.action} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 8px', background: `${q.color}12`, border: `1px solid ${q.color}25`, borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = `${q.color}20`; e.currentTarget.style.borderColor = `${q.color}40`; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = `${q.color}12`; e.currentTarget.style.borderColor = `${q.color}25`; }}>
                                    <q.icon size={18} style={{ color: q.color }} />
                                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 700 }}>{q.label}</span>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* ── Third Row: Vitals + Bar Chart + Daily Tip ─────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
                {/* Vitals */}
                <Card>
                    <CardHead title="Health Vitals" sub="Latest readings">
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#6ee7b7', background: 'rgba(16,185,129,0.12)', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)' }}>Normal</span>
                    </CardHead>
                    <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {vitals.map((v, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                                style={{ padding: '14px', background: `${v.color}10`, border: `1px solid ${v.color}20`, borderRadius: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <v.icon size={15} style={{ color: v.color }} />
                                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{v.label}</p>
                                </div>
                                <p style={{ color: 'white', fontSize: 18, fontWeight: 800, margin: '0 0 2px', letterSpacing: '-0.3px' }}>{v.value}</p>
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, margin: 0 }}>{v.unit}</p>
                            </motion.div>
                        ))}
                    </div>
                </Card>

                {/* Bar Chart */}
                <Card>
                    <CardHead title="Monthly Trend" sub="Last 6 months" />
                    <div style={{ padding: '16px 20px', height: 180 }}>
                        <Bar data={barData} options={chartDefaults} />
                    </div>
                </Card>

                {/* Daily Health Tip */}
                <Card>
                    <CardHead title="Daily Health Tip">
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#fcd34d', background: 'rgba(245,158,11,0.12)', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Zap size={11} /> Today
                        </span>
                    </CardHead>
                    <div style={{ padding: '16px 20px' }}>
                        <div style={{ padding: '14px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 12, marginBottom: 14 }}>
                            <p style={{ color: '#6ee7b7', fontSize: 13, fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                                Drink at least 2.5L of water today to improve focus, boost metabolism, and support kidney health.
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { icon: '🏃', text: '30 min walk recommended', color: '#3b82f6' },
                                { icon: '🥗', text: 'Eat more leafy greens', color: '#10b981' },
                                { icon: '😴', text: 'Sleep 7-8 hours tonight', color: '#8b5cf6' },
                            ].map((t, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: `${t.color}0d`, borderRadius: 10, border: `1px solid ${t.color}20` }}>
                                    <span style={{ fontSize: 14 }}>{t.icon}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600 }}>{t.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* ── Bottom Row: Activity Timeline + Certifications ────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
                {/* Activity Timeline */}
                <Card>
                    <CardHead title="Activity Timeline" sub="Your recent appointment history">
                        <button onClick={() => navigate('/patient/history')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6ee7b7', fontSize: 12, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                            View all <ArrowRight size={13} />
                        </button>
                    </CardHead>
                    <div style={{ padding: '20px 24px' }}>
                        {loading ? (
                            [1,2,3].map(i => <div key={i} style={{ height: 54, background: 'rgba(255,255,255,0.03)', borderRadius: 12, marginBottom: 10, animation: 'pulse 1.5s ease-in-out infinite' }} />)
                        ) : appointments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '30px 0' }}>
                                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>No appointment history yet.</p>
                            </div>
                        ) : (
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 19, top: 6, bottom: 6, width: 1, background: 'linear-gradient(to bottom, rgba(16,185,129,0.4), rgba(255,255,255,0.04))' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {appointments.slice(0, 5).map((apt, i) => {
                                        const sc = STATUS_CFG[getStatus(apt)]?.color || '#94a3b8';
                                        return (
                                            <motion.div key={apt._id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                                                style={{ display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 44, position: 'relative' }}>
                                                <div style={{ position: 'absolute', left: 12, height: 16, width: 16, borderRadius: '50%', background: sc, boxShadow: `0 0 6px ${sc}60`, flexShrink: 0 }} />
                                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, transition: 'background 0.15s' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                                                    <div>
                                                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, margin: 0 }}>
                                                            {apt.doctor?.name || 'Doctor'} <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>· {apt.doctor?.specialization || '—'}</span>
                                                        </p>
                                                        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: '2px 0 0' }}>
                                                            {fmt(apt.date)} at {apt.time || '—'}
                                                        </p>
                                                    </div>
                                                    <Badge status={getStatus(apt)} />
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Trust / Certifications */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Card>
                        <CardHead title="Hospital Certifications" />
                        <div style={{ padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[
                                { icon: Shield, label: 'NABH Accredited', color: '#10b981' },
                                { icon: Award,  label: 'ISO 9001:2026',   color: '#3b82f6' },
                                { icon: Users,  label: '500+ Doctors',    color: '#8b5cf6' },
                                { icon: CheckCircle, label: 'HIPAA Secure', color: '#f59e0b' },
                            ].map((b, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: `${b.color}0e`, borderRadius: 11, border: `1px solid ${b.color}20` }}>
                                    <b.icon size={13} style={{ color: b.color, flexShrink: 0 }} />
                                    <span style={{ color: b.color, fontSize: 11, fontWeight: 700 }}>{b.label}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Profile Completion */}
                    <Card>
                        <CardHead title="Profile Score" />
                        <div style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                                <div style={{ position: 'relative', height: 60, width: 60, flexShrink: 0 }}>
                                    <svg style={{ height: '100%', width: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
                                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="70 100" strokeLinecap="round" />
                                    </svg>
                                    <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 800 }}>70%</span>
                                </div>
                                <div>
                                    <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: 0 }}>Profile Score</p>
                                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '3px 0 0' }}>Complete to unlock features</p>
                                </div>
                            </div>
                            {[
                                { label: 'Basic Information', done: true },
                                { label: 'Contact Details', done: true },
                                { label: 'Blood Group', done: false },
                                { label: 'Medical History', done: false },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ height: 16, width: 16, borderRadius: '50%', background: item.done ? '#10b981' : 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            {item.done && <CheckCircle size={10} style={{ color: 'white' }} />}
                                        </div>
                                        <span style={{ color: item.done ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)', fontSize: 12, fontWeight: 600 }}>{item.label}</span>
                                    </div>
                                    {!item.done && <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: 8 }}>Pending</span>}
                                </div>
                            ))}
                            <button onClick={() => navigate('/patient/profile')} style={{ marginTop: 14, width: '100%', padding: '10px', background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 11, color: '#6ee7b7', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                Complete Profile <ArrowRight size={13} />
                            </button>
                        </div>
                    </Card>
                </div>
            </div>

            <style>{`
                @keyframes spin  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.5; } }
            `}</style>
        </DashboardLayout>
    );
}
