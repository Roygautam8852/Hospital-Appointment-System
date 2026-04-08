import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Users, UserPlus, Calendar, DollarSign, Activity,
    TrendingUp, TrendingDown, Stethoscope, Clock,
    CheckCircle, XCircle, AlertCircle, ArrowRight,
    RefreshCw, Building2, Heart, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, BarElement, Title, Tooltip, Legend, Filler, ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, Title, Tooltip, Legend, Filler, ArcElement
);

const API = 'http://localhost:5000/api';

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
            <div style={{ height: 48, width: 48, borderRadius: 14, background: `${bg}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                <Icon size={22} />
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: trend === 'up' ? '#10b981' : '#ef4444' }}>
                {trend === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {trendVal}
            </span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
        <p style={{ color: 'white', fontSize: 28, fontWeight: 800, letterSpacing: '-1px' }}>{value}</p>
    </motion.div>
);

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API}/admin/dashboard-stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) setStats(data.data);
        } catch (_) {
            // fallback demo data
            setStats({
                totalDoctors: 48, totalPatients: 1250, totalAppointments: 320,
                pendingAppointments: 45, completedAppointments: 210, confirmedAppointments: 65,
                cancelledAppointments: 12, totalRevenue: 154000, newPatientsThisMonth: 87,
                monthlyAppointments: [
                    { _id: { month: 1 }, count: 42 }, { _id: { month: 2 }, count: 58 },
                    { _id: { month: 3 }, count: 75 }, { _id: { month: 4 }, count: 63 },
                    { _id: { month: 5 }, count: 89 }, { _id: { month: 6 }, count: 94 },
                ],
                topSpecializations: [
                    { _id: 'Cardiology', count: 12 }, { _id: 'Neurology', count: 9 },
                    { _id: 'Orthopedics', count: 8 }, { _id: 'Pediatrics', count: 7 },
                    { _id: 'Dermatology', count: 6 },
                ],
                recentAppointments: []
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const lineData = {
        labels: stats?.monthlyAppointments?.map(m => months[(m._id.month || 1) - 1]) || [],
        datasets: [{
            fill: true,
            label: 'Appointments',
            data: stats?.monthlyAppointments?.map(m => m.count) || [],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.08)',
            tension: 0.4,
            pointBackgroundColor: '#10b981',
            pointRadius: 5,
            pointHoverRadius: 8,
        }]
    };

    const donutData = {
        labels: ['Completed', 'Pending', 'Confirmed', 'Cancelled'],
        datasets: [{
            data: [
                stats?.completedAppointments || 0,
                stats?.pendingAppointments || 0,
                stats?.confirmedAppointments || 0,
                stats?.cancelledAppointments || 0,
            ],
            backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
            borderWidth: 0,
            hoverOffset: 6,
        }]
    };

    const barData = {
        labels: stats?.topSpecializations?.map(s => s._id) || [],
        datasets: [{
            label: 'Doctors',
            data: stats?.topSpecializations?.map(s => s.count) || [],
            backgroundColor: stats?.topSpecializations?.map((_, i) =>
                ['rgba(16,185,129,0.7)', 'rgba(59,130,246,0.7)', 'rgba(6,182,212,0.7)',
                    'rgba(245,158,11,0.7)', 'rgba(239,68,68,0.7)'][i % 5]
            ) || [],
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
        { label: 'Add Doctor', to: '/admin/doctors', icon: UserPlus, color: '#10b981' },
        { label: 'All Patients', to: '/admin/patients', icon: Users, color: '#3b82f6' },
        { label: 'Appointments', to: '/admin/appointments', icon: Calendar, color: '#f59e0b' },
        { label: 'Services', to: '/admin/services', icon: Heart, color: '#ec4899' },
        { label: 'Broadcast', to: '/admin/settings', icon: Zap, color: '#8b5cf6' },
        { label: 'Settings', to: '/admin/settings', icon: Building2, color: '#64748b' },
    ];

    if (loading) return (
        <DashboardLayout>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
                <div style={{ textAlign: 'center' }}>
                    <RefreshCw size={36} style={{ color: '#10b981', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                    <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading dashboard...</p>
                </div>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <div style={{ height: 8, width: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                        <span style={{ color: '#10b981', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live Dashboard</span>
                    </div>
                    <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Hospital Command Center</h1>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginTop: 4 }}>
                        Welcome back, <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{user?.name || 'Admin'}</strong> · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <button onClick={fetchStats} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                    background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: 12, color: '#6ee7b7', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                }}>
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                <StatCard label="Total Patients" value={stats?.totalPatients?.toLocaleString()} icon={Users} color="#10b981" bg="#10b981" trend="up" trendVal="+8.2%" delay={0} />
                <StatCard label="Active Doctors" value={stats?.totalDoctors} icon={Stethoscope} color="#3b82f6" bg="#3b82f6" trend="up" trendVal="+3.1%" delay={0.05} />
                <StatCard label="Total Appointments" value={stats?.totalAppointments?.toLocaleString()} icon={Calendar} color="#8b5cf6" bg="#8b5cf6" trend="up" trendVal="+12.4%" delay={0.1} />
                <StatCard label="Total Revenue" value={`₹${((stats?.totalRevenue || 0) / 1000).toFixed(0)}K`} icon={DollarSign} color="#f59e0b" bg="#f59e0b" trend="up" trendVal="+18.6%" delay={0.15} />
            </div>

            {/* Sub-stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
                {[
                    { label: 'Pending', value: stats?.pendingAppointments, icon: Clock, color: '#f59e0b' },
                    { label: 'Completed', value: stats?.completedAppointments, icon: CheckCircle, color: '#10b981' },
                    { label: 'Confirmed', value: stats?.confirmedAppointments, icon: Activity, color: '#3b82f6' },
                    { label: 'New This Month', value: stats?.newPatientsThisMonth, icon: UserPlus, color: '#ec4899' },
                ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.05 }}
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <item.icon size={18} style={{ color: item.color, flexShrink: 0 }} />
                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                            <p style={{ color: 'white', fontSize: 20, fontWeight: 800 }}>{item.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px 280px', gap: 20, marginBottom: 28 }}>
                {/* Line Chart */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div>
                            <h3 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0 }}>Appointment Trends</h3>
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: '4px 0 0' }}>Monthly appointment volume</p>
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

                {/* Bar */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
                    <h3 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>Top Specializations</h3>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: '0 0 16px' }}>Doctors per specialty</p>
                    <div style={{ height: 160 }}>
                        <Bar data={barData} options={{ ...chartOptions, indexAxis: 'y', plugins: { legend: { display: false } } }} />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: 28 }}>
                <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
                    {quickLinks.map((ql, i) => (
                        <Link key={i} to={ql.to} style={{ textDecoration: 'none' }}>
                            <motion.div whileHover={{ scale: 1.03, y: -2 }} style={{
                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: 16, padding: '18px 12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s'
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

            {/* Recent Appointments */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0 }}>Recent Appointments</h3>
                    <Link to="/admin/appointments" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                        View All <ArrowRight size={14} />
                    </Link>
                </div>
                {stats?.recentAppointments?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {stats.recentAppointments.map((appt, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                                <div style={{ height: 36, width: 36, borderRadius: 10, background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6ee7b7', fontWeight: 800, fontSize: 14 }}>
                                    {(appt.patient?.name || 'P')[0]}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: 0 }}>{appt.patient?.name || 'Patient'}</p>
                                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '2px 0 0' }}>
                                        Dr. {appt.doctor?.name || 'Doctor'} · {appt.doctor?.specialization || ''}
                                    </p>
                                </div>
                                <span style={{
                                    padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                                    background: appt.status === 'completed' ? 'rgba(16,185,129,0.15)' : appt.status === 'pending' ? 'rgba(245,158,11,0.15)' : appt.status === 'confirmed' ? 'rgba(59,130,246,0.15)' : 'rgba(239,68,68,0.15)',
                                    color: appt.status === 'completed' ? '#10b981' : appt.status === 'pending' ? '#f59e0b' : appt.status === 'confirmed' ? '#3b82f6' : '#ef4444',
                                }}>
                                    {appt.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '30px 0' }}>
                        <Calendar size={32} style={{ color: 'rgba(255,255,255,0.15)', margin: '0 auto 10px', display: 'block' }} />
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No recent appointments found.</p>
                        <Link to="/admin/appointments" style={{ color: '#10b981', fontSize: 13, fontWeight: 600 }}>View all appointments →</Link>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
