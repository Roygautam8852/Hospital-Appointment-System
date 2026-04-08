import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Calendar, Clock, CheckCircle, XCircle, AlertCircle,
    TrendingUp, TrendingDown, Users, Activity,
    ArrowRight, RefreshCw, Star, Award, Heart,
    Stethoscope, FileText, Video, Phone, UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, BarElement, Title, Tooltip, Legend, Filler, ArcElement
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, Title, Tooltip, Legend, Filler, ArcElement
);

const API = 'http://localhost:5000/api';

/* ── Reusable Stat Card (dark theme, matches Admin) ── */
const StatCard = ({ label, value, icon: Icon, color, bg, trend, trendVal, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20,
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}
    >
        <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: `radial-gradient(circle at 100% 0%, ${bg}20 0%, transparent 70%)`, borderRadius: '0 20px 0 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ height: 48, width: 48, borderRadius: 14, background: `${bg}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                <Icon size={22} />
            </div>
            {trendVal && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: trend === 'up' ? '#10b981' : '#ef4444' }}>
                    {trend === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    {trendVal}
                </span>
            )}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
        <p style={{ color: 'white', fontSize: 28, fontWeight: 800, letterSpacing: '-1px' }}>{value ?? '—'}</p>
    </motion.div>
);

/* ── Status badge ── */
const StatusBadge = ({ status }) => {
    const cfg = {
        completed: { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
        confirmed: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
        accepted:  { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
        pending:   { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
        cancelled: { bg: 'rgba(239,68,68,0.15)',  color: '#ef4444' },
        rejected:  { bg: 'rgba(239,68,68,0.15)',  color: '#ef4444' },
    }[status] || { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' };
    return (
        <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: cfg.bg, color: cfg.color, textTransform: 'capitalize' }}>
            {status}
        </span>
    );
};

/* ── Main Component ── */
const DoctorDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [actionLoading, setActionLoading] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API}/appointments?limit=100`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const appts = res.data?.data || [];
            setAppointments(appts);
            calcStats(appts);
        } catch (_) {
            setAppointments([]);
            setStats({ total: 0, completed: 0, pending: 0, confirmed: 0, cancelled: 0, completionRate: 0 });
        } finally {
            setLoading(false);
        }
    };

    const calcStats = (appts) => {
        const total     = appts.length;
        const completed = appts.filter(a => a.status === 'completed').length;
        const pending   = appts.filter(a => a.status === 'pending').length;
        const confirmed = appts.filter(a => ['confirmed', 'accepted'].includes(a.status)).length;
        const cancelled = appts.filter(a => ['cancelled', 'rejected'].includes(a.status)).length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        setStats({ total, completed, pending, confirmed, cancelled, completionRate });
    };

    useEffect(() => { fetchData(); }, []);

    /* ── Appointment action ── */
    const handleAction = async (action, id) => {
        setActionLoading(id + action);
        try {
            const token = localStorage.getItem('token');
            const statusMap = { confirm: 'confirmed', reject: 'cancelled', complete: 'completed' };
            if (statusMap[action]) {
                await axios.put(`${API}/appointments/${id}`, { status: statusMap[action] }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                await fetchData();
            }
        } catch (_) {}
        finally { setActionLoading(null); }
    };

    /* ── Filter appointments ── */
    const filteredAppts = appointments.filter(a => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'confirmed') return ['confirmed', 'accepted'].includes(a.status);
        return a.status === activeFilter;
    });

    /* ── Weekly trend chart data ── */
    const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyData = (() => {
        const counts = [0, 0, 0, 0, 0, 0, 0];
        appointments.forEach(a => {
            const d = new Date(a.date || a.appointmentDate);
            if (!isNaN(d)) {
                const day = (d.getDay() + 6) % 7; // Mon=0
                counts[day]++;
            }
        });
        return counts;
    })();

    const lineData = {
        labels: weeklyLabels,
        datasets: [{
            fill: true,
            label: 'Appointments',
            data: weeklyData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.08)',
            tension: 0.4,
            pointBackgroundColor: '#3b82f6',
            pointRadius: 5,
            pointHoverRadius: 8,
        }]
    };

    const donutData = {
        labels: ['Completed', 'Pending', 'Confirmed', 'Cancelled'],
        datasets: [{
            data: [
                stats?.completed || 0,
                stats?.pending || 0,
                stats?.confirmed || 0,
                stats?.cancelled || 0,
            ],
            backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
            borderWidth: 0,
            hoverOffset: 6,
        }]
    };

    /* Monthly breakdown (last 6 months) */
    const monthlyLabels = (() => {
        const labels = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            labels.push(d.toLocaleString('default', { month: 'short' }));
        }
        return labels;
    })();

    const monthlyData = (() => {
        const counts = new Array(6).fill(0);
        appointments.forEach(a => {
            const d = new Date(a.date || a.appointmentDate);
            if (!isNaN(d)) {
                const monthsAgo = (new Date().getFullYear() - d.getFullYear()) * 12 + (new Date().getMonth() - d.getMonth());
                const idx = 5 - monthsAgo;
                if (idx >= 0 && idx < 6) counts[idx]++;
            }
        });
        return counts;
    })();

    const barData = {
        labels: monthlyLabels,
        datasets: [{
            label: 'Appointments',
            data: monthlyData,
            backgroundColor: monthlyLabels.map((_, i) =>
                ['rgba(59,130,246,0.7)', 'rgba(16,185,129,0.7)', 'rgba(6,182,212,0.7)',
                    'rgba(139,92,246,0.7)', 'rgba(245,158,11,0.7)', 'rgba(236,72,153,0.7)'][i % 6]
            ),
            borderRadius: 6,
            borderSkipped: false,
        }]
    };

    const chartOptions = {
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } } }
        }
    };

    const quickLinks = [
        { label: 'Appointments', to: '/doctor/dashboard', icon: Calendar, color: '#3b82f6' },
        { label: 'My Patients', to: '/doctor/dashboard', icon: Users, color: '#10b981' },
        { label: 'Medical Files', to: '/doctor/dashboard', icon: FileText, color: '#8b5cf6' },
        { label: 'Video Call', to: '/doctor/dashboard', icon: Video, color: '#06b6d4' },
        { label: 'Heart Rate', to: '/doctor/dashboard', icon: Heart, color: '#ec4899' },
        { label: 'Performance', to: '/doctor/dashboard', icon: Award, color: '#f59e0b' },
    ];

    if (loading) return (
        <DashboardLayout>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
                <div style={{ textAlign: 'center' }}>
                    <RefreshCw size={36} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                    <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading dashboard...</p>
                </div>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

            {/* ── Header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <div style={{ height: 8, width: 8, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px #3b82f6' }} />
                        <span style={{ color: '#3b82f6', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live Dashboard</span>
                    </div>
                    <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Doctor Command Center</h1>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginTop: 4 }}>
                        Welcome back, <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{user?.name || 'Doctor'}</strong> · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <button onClick={fetchData} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                    background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
                    borderRadius: 12, color: '#93c5fd', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                }}>
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {/* ── Stat Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                <StatCard label="Total Appointments" value={stats?.total}       icon={Calendar}   color="#3b82f6" bg="#3b82f6" trend="up"   trendVal="+12.4%" delay={0}    />
                <StatCard label="Completed"          value={stats?.completed}   icon={CheckCircle} color="#10b981" bg="#10b981" trend="up"   trendVal="+8.1%"  delay={0.05} />
                <StatCard label="Pending"            value={stats?.pending}     icon={Clock}       color="#f59e0b" bg="#f59e0b" trend="down" trendVal="-2.3%"  delay={0.1}  />
                <StatCard label="Completion Rate"    value={`${stats?.completionRate}%`} icon={Activity} color="#8b5cf6" bg="#8b5cf6" trend="up" trendVal="+5.2%" delay={0.15} />
            </div>

            {/* ── Sub-stats row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
                {[
                    { label: 'Confirmed',  value: stats?.confirmed, icon: UserCheck,    color: '#3b82f6' },
                    { label: 'Cancelled',  value: stats?.cancelled, icon: XCircle,      color: '#ef4444' },
                    { label: 'Rating',     value: '4.8 ★',          icon: Star,         color: '#f59e0b' },
                    { label: 'Reviews',    value: '128',             icon: Stethoscope,  color: '#10b981' },
                ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.05 }}
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <item.icon size={18} style={{ color: item.color, flexShrink: 0 }} />
                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                            <p style={{ color: 'white', fontSize: 20, fontWeight: 800 }}>{item.value ?? '—'}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── Charts Row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px 280px', gap: 20, marginBottom: 28 }}>
                {/* Weekly Line Chart */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div>
                            <h3 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0 }}>Weekly Appointments</h3>
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: '4px 0 0' }}>Day-by-day appointment volume</p>
                        </div>
                    </div>
                    <div style={{ height: 220 }}>
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </div>

                {/* Donut */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
                    <h3 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>Status Split</h3>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: '0 0 16px' }}>Appointment breakdown</p>
                    <div style={{ height: 160 }}>
                        <Doughnut data={donutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.5)', font: { size: 10 }, boxWidth: 10, padding: 8 } } } }} />
                    </div>
                </div>

                {/* Monthly Bar */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
                    <h3 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>Monthly Trend</h3>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: '0 0 16px' }}>Last 6 months</p>
                    <div style={{ height: 160 }}>
                        <Bar data={barData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} />
                    </div>
                </div>
            </div>

            {/* ── Quick Actions ── */}
            <div style={{ marginBottom: 28 }}>
                <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
                    {quickLinks.map((ql, i) => (
                        <Link key={i} to={ql.to} style={{ textDecoration: 'none' }}>
                            <motion.div whileHover={{ scale: 1.03, y: -2 }} style={{
                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: 16, padding: '18px 12px', textAlign: 'center', cursor: 'pointer'
                            }}>
                                <div style={{ height: 44, width: 44, borderRadius: 12, background: `${ql.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: ql.color }}>
                                    <ql.icon size={20} />
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, margin: 0 }}>{ql.label}</p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── Appointments Table ── */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
                {/* Table Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                        <h3 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0 }}>Your Appointments</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', boxShadow: '0 0 6px #f59e0b' }} />
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{stats?.pending} pending</span>
                        </div>
                    </div>
                    {/* Filter Tabs */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
                            <button key={f} onClick={() => setActiveFilter(f)} style={{
                                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                                border: 'none', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s',
                                background: activeFilter === f ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.05)',
                                color: activeFilter === f ? '#93c5fd' : 'rgba(255,255,255,0.4)'
                            }}>{f}</button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                {filteredAppts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Calendar size={36} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 12px', display: 'block' }} />
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No {activeFilter !== 'all' ? activeFilter : ''} appointments found.</p>
                    </div>
                ) : (
                    <>
                        {/* Thead */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.2fr', gap: 12, padding: '10px 16px', marginBottom: 8 }}>
                            {['Patient', 'Date & Time', 'Reason', 'Status', 'Actions'].map(h => (
                                <p key={h} style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{h}</p>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {filteredAppts.map((appt, i) => {
                                const apptDate = new Date(appt.date || appt.appointmentDate);
                                const isPast   = apptDate < new Date();
                                const initials = (appt.patient?.name || 'P')[0].toUpperCase();
                                return (
                                    <motion.div key={appt._id || i}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        style={{
                                            display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.2fr', gap: 12,
                                            alignItems: 'center', padding: '14px 16px',
                                            background: 'rgba(255,255,255,0.025)', borderRadius: 12,
                                            border: '1px solid rgba(255,255,255,0.05)'
                                        }}
                                    >
                                        {/* Patient */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ height: 38, width: 38, borderRadius: 10, background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93c5fd', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                                                {initials}
                                            </div>
                                            <div>
                                                <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: 0 }}>{appt.patient?.name || 'Patient'}</p>
                                                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '2px 0 0' }}>{appt.patient?.email || appt.patient?.phone || ''}</p>
                                            </div>
                                        </div>

                                        {/* Date & Time */}
                                        <div>
                                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, margin: 0 }}>
                                                {isNaN(apptDate) ? '—' : apptDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '2px 0 0' }}>
                                                {appt.time || (isNaN(apptDate) ? '' : apptDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))}
                                            </p>
                                        </div>

                                        {/* Reason */}
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {appt.reason || appt.department || '—'}
                                        </p>

                                        {/* Status */}
                                        <StatusBadge status={appt.status} />

                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {appt.status === 'pending' && !isPast && (
                                                <>
                                                    <button onClick={() => handleAction('confirm', appt._id)}
                                                        disabled={actionLoading === appt._id + 'confirm'}
                                                        style={{ flex: 1, padding: '6px 10px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, color: '#6ee7b7', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                                                        Confirm
                                                    </button>
                                                    <button onClick={() => handleAction('reject', appt._id)}
                                                        disabled={actionLoading === appt._id + 'reject'}
                                                        style={{ flex: 1, padding: '6px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#f87171', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                                                        Decline
                                                    </button>
                                                </>
                                            )}
                                            {['confirmed', 'accepted'].includes(appt.status) && !isPast && (
                                                <button onClick={() => handleAction('complete', appt._id)}
                                                    disabled={actionLoading === appt._id + 'complete'}
                                                    style={{ flex: 1, padding: '6px 10px', background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, color: '#93c5fd', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                                                    Complete
                                                </button>
                                            )}
                                            {appt.status === 'completed' && (
                                                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 600 }}>Done</span>
                                            )}
                                            {['cancelled', 'rejected'].includes(appt.status) && (
                                                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 600 }}>Closed</span>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default DoctorDashboard;
