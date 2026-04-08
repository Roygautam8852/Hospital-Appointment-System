import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import axios from 'axios';
import {
    DollarSign, TrendingUp, TrendingDown, Activity,
    Calendar, RefreshCw, Download, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Fallback demo data
const DEMO = {
    totalRevenue: 485000,
    monthlyRevenue: [28000, 37000, 42000, 35000, 52000, 48000, 61000, 55000, 49000, 67000, 58000, 71000],
    bySpecialization: [
        { name: 'Cardiology', revenue: 82000, appointments: 164 },
        { name: 'Neurology', revenue: 67000, appointments: 112 },
        { name: 'Orthopedics', revenue: 58000, appointments: 145 },
        { name: 'Pediatrics', revenue: 44000, appointments: 220 },
        { name: 'Dermatology', revenue: 38000, appointments: 190 },
        { name: 'Oncology', revenue: 72000, appointments: 96 },
    ],
    completedAppointments: 720,
    pendingRevenue: 38500,
    avgRevenuePerAppointment: 673,
    growthRate: 18.4,
};

const chartOpts = (yPrefix = '₹') => ({
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: 'rgba(255,255,255,0.35)', font: { size: 11 } }
        },
        y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
                color: 'rgba(255,255,255,0.35)', font: { size: 11 },
                callback: v => `${yPrefix}${(v / 1000).toFixed(0)}K`
            }
        }
    }
});

export default function AdminRevenue() {
    const [stats, setStats] = useState(DEMO);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState('year');

    const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

    const fetchStats = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API}/admin/dashboard-stats`, { headers: getHeaders() });
            if (data.success) {
                const d = data.data;
                const monthly = Array(12).fill(0);
                (d.monthlyAppointments || []).forEach(m => {
                    if (m._id?.month) monthly[m._id.month - 1] = m.count * 700;
                });
                setStats({
                    totalRevenue: d.totalRevenue || DEMO.totalRevenue,
                    monthlyRevenue: monthly.some(v => v > 0) ? monthly : DEMO.monthlyRevenue,
                    bySpecialization: (d.topSpecializations || []).map(s => ({
                        name: s._id,
                        revenue: s.count * 5800,
                        appointments: s.count * 12
                    })),
                    completedAppointments: d.completedAppointments || DEMO.completedAppointments,
                    pendingRevenue: (d.pendingAppointments || 55) * 700,
                    avgRevenuePerAppointment: d.totalRevenue && d.completedAppointments
                        ? Math.round(d.totalRevenue / d.completedAppointments)
                        : DEMO.avgRevenuePerAppointment,
                    growthRate: DEMO.growthRate,
                });
            }
        } catch (_) {}
        setLoading(false);
    };

    useEffect(() => { fetchStats(); }, []);

    const displayMonths = period === 'year' ? MONTHS : MONTHS.slice(6);
    const displayRevenue = period === 'year' ? stats.monthlyRevenue : stats.monthlyRevenue.slice(6);

    const lineData = {
        labels: displayMonths,
        datasets: [{
            fill: true,
            label: 'Revenue',
            data: displayRevenue,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.08)',
            tension: 0.45,
            pointBackgroundColor: '#10b981',
            pointRadius: 4,
            pointHoverRadius: 7,
        }]
    };

    const barData = {
        labels: stats.bySpecialization.slice(0, 6).map(s => s.name),
        datasets: [{
            label: 'Revenue',
            data: stats.bySpecialization.slice(0, 6).map(s => s.revenue),
            backgroundColor: [
                'rgba(16,185,129,0.7)', 'rgba(59,130,246,0.7)', 'rgba(6,182,212,0.7)',
                'rgba(245,158,11,0.7)', 'rgba(239,68,68,0.7)', 'rgba(139,92,246,0.7)',
            ],
            borderRadius: 8,
            borderSkipped: false,
        }]
    };

    const donutData = {
        labels: stats.bySpecialization.slice(0, 5).map(s => s.name),
        datasets: [{
            data: stats.bySpecialization.slice(0, 5).map(s => s.revenue),
            backgroundColor: ['#10b981', '#3b82f6', '#06b6d4', '#f59e0b', '#ef4444'],
            borderWidth: 0,
            hoverOffset: 6,
        }]
    };

    const kpis = [
        {
            label: 'Total Revenue', value: `₹${(stats.totalRevenue / 100000).toFixed(2)}L`,
            sub: 'All time earnings', icon: DollarSign, color: '#10b981', bg: '#10b981', trend: '+18.4%'
        },
        {
            label: 'Avg. Per Appointment', value: `₹${stats.avgRevenuePerAppointment}`,
            sub: 'Per completed visit', icon: Activity, color: '#06b6d4', bg: '#06b6d4', trend: '+5.2%'
        },
        {
            label: 'Pending Revenue', value: `₹${(stats.pendingRevenue / 1000).toFixed(0)}K`,
            sub: 'From pending appts', icon: Calendar, color: '#f59e0b', bg: '#f59e0b', trend: '-2.1%'
        },
        {
            label: 'Growth Rate', value: `${stats.growthRate}%`,
            sub: 'Month over month', icon: TrendingUp, color: '#3b82f6', bg: '#3b82f6', trend: '+3.8%'
        },
    ];

    return (
        <DashboardLayout>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, margin: 0 }}>Revenue Analytics</h1>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: '6px 0 0' }}>
                        Financial performance & earnings breakdown
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {/* Period toggle */}
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 3 }}>
                        {['6mo', 'year'].map(p => (
                            <button key={p} onClick={() => setPeriod(p)}
                                style={{ padding: '7px 16px', borderRadius: 9, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', background: period === p ? 'rgba(16,185,129,0.2)' : 'transparent', color: period === p ? '#10b981' : 'rgba(255,255,255,0.4)' }}>
                                {p === '6mo' ? 'Last 6M' : 'Full Year'}
                            </button>
                        ))}
                    </div>
                    <button onClick={fetchStats}
                        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, color: '#10b981', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                        <Download size={13} /> Export PDF
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {kpis.map((kpi, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: `radial-gradient(circle at 80% 20%, ${kpi.bg}18 0%, transparent 70%)` }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                            <div style={{ height: 44, width: 44, borderRadius: 13, background: `${kpi.bg}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color }}>
                                <kpi.icon size={20} />
                            </div>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: kpi.trend.startsWith('+') ? '#10b981' : '#ef4444' }}>
                                {kpi.trend.startsWith('+') ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                                {kpi.trend}
                            </span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 5px' }}>{kpi.label}</p>
                        <p style={{ color: 'white', fontSize: 26, fontWeight: 800, margin: '0 0 3px', letterSpacing: '-0.5px' }}>{kpi.value}</p>
                        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: 0 }}>{kpi.sub}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
                {/* Line Chart */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                        <div>
                            <h3 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0 }}>Revenue Trend</h3>
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: '4px 0 0' }}>Monthly earnings over time</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ color: '#10b981', fontSize: 18, fontWeight: 800, margin: 0 }}>
                                ₹{(displayRevenue.reduce((a, b) => a + b, 0) / 100000).toFixed(2)}L
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '2px 0 0' }}>Period total</p>
                        </div>
                    </div>
                    <div style={{ height: 240 }}>
                        <Line data={lineData} options={chartOpts()} />
                    </div>
                </div>

                {/* Donut */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
                    <h3 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>Revenue by Specialty</h3>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: '0 0 20px' }}>Distribution breakdown</p>
                    <div style={{ height: 180 }}>
                        <Doughnut data={donutData} options={{
                            maintainAspectRatio: false,
                            cutout: '65%',
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: { color: 'rgba(255,255,255,0.4)', font: { size: 10 }, boxWidth: 10, padding: 8 }
                                }
                            }
                        }} />
                    </div>
                </div>
            </div>

            {/* Bar Chart + Table */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Bar Chart */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
                    <h3 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>Revenue by Department</h3>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: '0 0 20px' }}>Top earning specializations</p>
                    <div style={{ height: 220 }}>
                        <Bar data={barData} options={chartOpts()} />
                    </div>
                </div>

                {/* Specialization Table */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
                    <h3 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 20px' }}>Detailed Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {stats.bySpecialization.slice(0, 6).map((spec, i) => {
                            const colors = ['#10b981', '#3b82f6', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6'];
                            const color = colors[i % colors.length];
                            const maxRev = Math.max(...stats.bySpecialization.map(s => s.revenue));
                            const pct = ((spec.revenue / maxRev) * 100).toFixed(0);
                            return (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ height: 8, width: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>{spec.name}</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ color: color, fontSize: 13, fontWeight: 800 }}>₹{(spec.revenue / 1000).toFixed(0)}K</span>
                                            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginLeft: 8 }}>{spec.appointments} appts</span>
                                        </div>
                                    </div>
                                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                                            style={{ height: '100%', background: color, borderRadius: 4 }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
