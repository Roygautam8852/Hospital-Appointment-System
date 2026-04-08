import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Calendar,
    Clock,
    User,
    CheckCircle2,
    ChevronRight,
    FileText,
    Bell,
    Plus,
    CreditCard,
    Download,
    Activity,
    Stethoscope,
    Heart,
    Shield,
    AlertTriangle,
    Phone,
    ArrowRight,
    TrendingUp,
    Pill,
    ClipboardList,
    Star,
    MapPin,
    RefreshCw,
    Eye,
    MoreHorizontal,
    Zap,
    Award,
    Lock,
    Users,
    BarChart3,
    HeartPulse,
    Droplets,
    Thermometer,
    Wind,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PatientDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appointmentsLoading, setAppointmentsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Fetch appointments and prescriptions
    const fetchData = async () => {
        try {
            setAppointmentsLoading(true);
            const token = localStorage.getItem('token');
            
            // Fetch appointments
            const appointmentsRes = await axios.get('http://localhost:5000/api/appointments', {
                headers: { Authorization: `Bearer ${token}` },
                params: { limit: 100 } // Fetch all appointments
            });
            
            if (appointmentsRes.data.success) {
                setAppointments(appointmentsRes.data.data || []);
            }

            // Fetch prescriptions
            const prescriptionsRes = await axios.get('http://localhost:5000/api/prescriptions', {
                headers: { Authorization: `Bearer ${token}` },
                params: { limit: 100 }
            });
            
            if (prescriptionsRes.data.success) {
                setPrescriptions(prescriptionsRes.data.data || []);
            }

            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setAppointmentsLoading(false);
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchData();
    }, []);

    // Real-time auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchData();
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    // Helper function to check if appointment is expired
    const isAppointmentExpired = (appointmentDate) => {
        const now = new Date();
        const apptDate = new Date(appointmentDate);
        return apptDate < now;
    };

    // Helper function to get appointment status including expired
    const getAppointmentStatus = (apt) => {
        if (isAppointmentExpired(apt.date) && apt.status !== 'completed' && apt.status !== 'cancelled') {
            return 'expired';
        }
        return apt.status;
    };

    const upcoming = appointments.filter(a => {
        const status = getAppointmentStatus(a);
        return status === 'confirmed' || status === 'pending';
    });
    const completed = appointments.filter(a => a.status === 'completed');
    const cancelled = appointments.filter(a => a.status === 'cancelled');
    const expired = appointments.filter(a => getAppointmentStatus(a) === 'expired');
    const totalSpent = appointments
        .filter(a => a.paymentStatus === 'paid' && a.amount)
        .reduce((sum, a) => sum + (a.amount || 0), 0);

    const getGreeting = () => {
        const h = currentTime.getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const quickActions = [
        { label: 'Book Appointment', icon: Calendar, color: 'bg-emerald-600 text-white shadow-md shadow-emerald-200', action: () => navigate('/patient/book') },
        { label: 'My Records', icon: FileText, color: 'bg-blue-50 text-blue-600 border border-blue-100', action: () => navigate('/patient/records') },
        { label: 'Prescriptions', icon: Pill, color: 'bg-violet-50 text-violet-600 border border-violet-100', action: () => navigate('/patient/history') },
        { label: 'Emergency', icon: Phone, color: 'bg-rose-50 text-rose-600 border border-rose-100', action: () => {} },
    ];

    const healthStats = [
        { label: 'Upcoming', value: upcoming.length, sub: 'appointments', icon: Calendar, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', accent: 'border-l-emerald-500' },
        { label: 'Completed', value: completed.length, sub: 'visits total', icon: CheckCircle2, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', accent: 'border-l-blue-500' },
        { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, sub: 'on consultations', icon: CreditCard, iconBg: 'bg-violet-50', iconColor: 'text-violet-600', accent: 'border-l-violet-500' },
        { label: 'Prescriptions', value: prescriptions.filter(p => p.status === 'active' || p.status === 'Active').length, sub: 'active rx', icon: Pill, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', accent: 'border-l-amber-500' },
    ];

    const documents = [
        { name: 'Blood_Test_Feb_2026.pdf', date: 'Feb 21, 2026', type: 'Lab Report', color: 'text-rose-600', bg: 'bg-rose-50', size: '1.2 MB' },
        { name: 'Cardio_Report_2026.pdf', date: 'Feb 12, 2026', type: 'Cardiology', color: 'text-blue-600', bg: 'bg-blue-50', size: '3.4 MB' },
        { name: 'Prescription_Jan.pdf', date: 'Jan 30, 2026', type: 'Prescription', color: 'text-emerald-600', bg: 'bg-emerald-50', size: '0.8 MB' },
        { name: 'X-Ray_Chest.pdf', date: 'Jan 10, 2026', type: 'Radiology', color: 'text-violet-600', bg: 'bg-violet-50', size: '5.6 MB' },
    ];

    // Use fetched prescriptions or show fallback data
    const displayPrescriptions = prescriptions.length > 0 ? prescriptions : [
        { name: 'Atorvastatin 10mg', dose: '1 tablet nightly', refills: 2, status: 'Active', doctor: 'Dr. Sharma' },
        { name: 'Metformin 500mg', dose: 'Twice daily with meals', refills: 5, status: 'Active', doctor: 'Dr. Kapoor' },
        { name: 'Aspirin 75mg', dose: '1 tablet morning', refills: 0, status: 'Refill needed', doctor: 'Dr. Verma' },
    ];

    const vitals = [
        { label: 'Heart Rate', value: '72', unit: 'bpm', icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-50', trend: 'Normal', trendColor: 'text-emerald-600' },
        { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50', trend: 'Normal', trendColor: 'text-emerald-600' },
        { label: 'Blood Sugar', value: '98', unit: 'mg/dL', icon: Droplets, color: 'text-amber-500', bg: 'bg-amber-50', trend: 'Normal', trendColor: 'text-emerald-600' },
        { label: 'Temperature', value: '98.6', unit: 'F', icon: Thermometer, color: 'text-violet-500', bg: 'bg-violet-50', trend: 'Normal', trendColor: 'text-emerald-600' },
    ];

    const filteredApts = (activeTab === 'upcoming' ? upcoming : activeTab === 'completed' ? completed : cancelled)
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

    return (
        <DashboardLayout>
            <div className="font-sans space-y-6 pb-8">

                {/* Top Welcome Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                    <div className="relative px-8 py-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-emerald-50/30 to-emerald-50/60 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-72 h-full bg-emerald-50/40 rounded-l-[4rem] pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200 flex-shrink-0">
                                    <span className="text-xl font-black">{user?.name?.charAt(0)?.toUpperCase()}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">Patient Portal</span>
                                        <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                                        <span className="text-[11px] text-slate-400 font-medium">Live</span>
                                    </div>
                                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                                        {getGreeting()}, <span className="text-emerald-600">{user?.name?.split(' ')[0]}</span> <span className="animate-bounce inline-block">👋</span>
                                    </h1>
                                    <p className="text-sm text-slate-500 font-medium mt-0.5">
                                        {currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        {' · '}
                                        {upcoming.length > 0
                                            ? <span className="text-emerald-600 font-semibold">{upcoming.length} upcoming appointment{upcoming.length > 1 ? 's' : ''}</span>
                                            : <span className="text-slate-400">No upcoming appointments</span>
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2.5">
                                {quickActions.map((q, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={q.action}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${q.color}`}
                                    >
                                        <q.icon size={15} />
                                        {q.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-3 bg-rose-50 border-t border-rose-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-rose-600">
                            <AlertTriangle size={14} />
                            <span className="text-xs font-semibold">Emergency Helpline: </span>
                            <span className="text-xs font-bold">+91-911-CARE · Available 24/7</span>
                        </div>
                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Immediate Response</span>
                    </div>
                </motion.div>

                {/* Error State */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <AlertTriangle size={18} className="text-rose-600" />
                            <div>
                                <p className="text-sm font-bold text-rose-700">{error}</p>
                                <p className="text-xs text-rose-600 font-medium mt-0.5">Last updated: {lastUpdated.toLocaleTimeString()}</p>
                            </div>
                        </div>
                        <button
                            onClick={fetchData}
                            disabled={appointmentsLoading}
                            className="px-4 py-2 bg-rose-600 text-white rounded-lg font-bold text-xs hover:bg-rose-700 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            <RefreshCw size={14} className={appointmentsLoading ? 'animate-spin' : ''} />
                            Retry
                        </button>
                    </motion.div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {healthStats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-all border-l-4 ${s.accent} cursor-pointer group relative overflow-hidden`}
                        >
                            {appointmentsLoading && (
                                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center">
                                    <div className="h-5 w-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                                </div>
                            )}
                            <div className={`h-11 w-11 rounded-xl ${s.iconBg} ${s.iconColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                <s.icon size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">{s.value}</p>
                                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{s.label}</p>
                                <p className="text-[10px] text-slate-300 font-medium">{s.sub}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-12 gap-6">

                    {/* Left: Appointments + Vitals + Prescriptions (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Appointments Card */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                        <Calendar size={16} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800 tracking-tight">My Appointments</h2>
                                        <p className="text-[10px] text-slate-400 font-medium">Last updated: {lastUpdated.toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center bg-slate-50 rounded-xl p-1 gap-1">
                                        {['upcoming', 'completed', 'cancelled'].map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={fetchData}
                                        disabled={appointmentsLoading}
                                        className="px-2.5 py-2 bg-slate-50 text-slate-600 rounded-xl text-[11px] font-bold hover:bg-slate-100 transition-all border border-slate-200 disabled:opacity-50 flex items-center gap-1"
                                        title="Refresh appointments"
                                    >
                                        <RefreshCw size={13} className={appointmentsLoading ? 'animate-spin' : ''} />
                                    </button>
                                    <button
                                        onClick={() => navigate('/patient/book')}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-xl text-[11px] font-bold hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200"
                                    >
                                        <Plus size={13} /> New
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 space-y-3">
                                {loading ? (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="h-20 bg-slate-50 rounded-xl animate-pulse"></div>
                                    ))
                                ) : filteredApts.length > 0 ? (
                                    filteredApts.map((apt) => (
                                        <motion.div
                                            key={apt._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            whileHover={{ x: 4 }}
                                            className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-100 hover:shadow-sm transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                                                    <img
                                                        src={apt.doctor?.profileImage && apt.doctor.profileImage !== 'default-avatar.png'
                                                            ? (apt.doctor.profileImage.startsWith('http') ? apt.doctor.profileImage : `http://localhost:5000/${apt.doctor.profileImage}`)
                                                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor?.name || 'Doctor')}&background=10b981&color=fff&bold=true&size=128`}
                                                        alt={apt.doctor?.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 tracking-tight">{apt.doctor?.name || 'Doctor'}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium">{apt.doctor?.specialization || 'Specialist'}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                                                            <Calendar size={11} className="text-emerald-500" />
                                                            {formatDate(apt.date)}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                                                            <Clock size={11} className="text-emerald-500" />
                                                            {apt.time}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <StatusBadge status={getAppointmentStatus(apt)} />
                                                <div className="h-8 w-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all shadow-sm">
                                                    <ChevronRight size={15} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center">
                                        <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                            <Calendar size={24} className="text-slate-300" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-600 mb-1">No {activeTab} appointments</p>
                                        <p className="text-xs text-slate-400 font-medium mb-4">Book a consultation with a specialist</p>
                                        {activeTab === 'upcoming' && (
                                            <button
                                                onClick={() => navigate('/patient/book')}
                                                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200"
                                            >
                                                Book Appointment
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {appointments.length > 0 && (
                                <div className="px-6 py-3 border-t border-slate-50 flex justify-between items-center">
                                    <p className="text-[11px] text-slate-400 font-medium">{appointments.length} total appointment{appointments.length !== 1 ? 's' : ''}</p>
                                    <button
                                        onClick={() => navigate('/patient/history')}
                                        className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                                    >
                                        View all history <ArrowRight size={12} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Health Vitals */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-rose-50 rounded-lg flex items-center justify-center">
                                        <HeartPulse size={16} className="text-rose-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800 tracking-tight">Health Vitals</h2>
                                        <p className="text-[10px] text-slate-400 font-medium">Last updated: Today</p>
                                    </div>
                                </div>
                                <button className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-emerald-600 transition-colors">
                                    <RefreshCw size={12} /> Refresh
                                </button>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4">
                                {vitals.map((v, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.08 }}
                                        className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-100 hover:bg-white transition-all group"
                                    >
                                        <div className={`h-9 w-9 rounded-xl ${v.bg} ${v.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                            <v.icon size={17} />
                                        </div>
                                        <p className="text-lg font-black text-slate-800 tracking-tight leading-none">{v.value}</p>
                                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{v.unit}</p>
                                        <p className="text-[10px] font-bold text-slate-500 mt-1">{v.label}</p>
                                        <span className={`mt-1 text-[9px] font-black uppercase tracking-wide ${v.trendColor}`}>{v.trend}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Active Prescriptions */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-violet-50 rounded-lg flex items-center justify-center">
                                        <Pill size={16} className="text-violet-600" />
                                    </div>
                                    <h2 className="text-sm font-bold text-slate-800 tracking-tight">Active Prescriptions</h2>
                                </div>
                                <button
                                    onClick={() => navigate('/patient/history')}
                                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
                                >
                                    View all <ArrowRight size={12} />
                                </button>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {displayPrescriptions.map((rx, i) => (
                                    <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                <Pill size={17} className="text-violet-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 tracking-tight">{rx.name}</p>
                                                <p className="text-[11px] text-slate-400 font-medium">{rx.dose}</p>
                                                <p className="text-[10px] text-slate-300 font-medium mt-0.5">Prescribed by {rx.doctor}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-slate-400">{rx.refills} refill{rx.refills !== 1 ? 's' : ''} left</p>
                                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${rx.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    {rx.status}
                                                </span>
                                            </div>
                                            <Eye size={15} className="text-slate-200 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar (4 cols) */}
                    <div className="lg:col-span-4 space-y-5">

                        {/* Health Score */}
                        <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-slate-900/20">
                            <div className="absolute top-[-30%] right-[-20%] w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="absolute bottom-[-20%] left-[-10%] w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                        <Activity size={18} className="text-emerald-400" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-700 px-2 py-1 rounded-full">Weekly</span>
                                </div>
                                <h3 className="text-base font-bold text-white mb-0.5">Health Pulse</h3>
                                <p className="text-xs text-slate-400 font-medium mb-5">Vitality and wellness score</p>
                                <div className="flex items-end justify-between">
                                    <div className="flex items-end gap-1 h-16">
                                        {[40, 65, 45, 90, 60, 80, 55].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ delay: i * 0.08, duration: 0.8 }}
                                                className={`w-2.5 rounded-full transition-colors cursor-pointer ${i === 3 ? 'bg-emerald-500' : 'bg-white/15 hover:bg-white/30'}`}
                                            ></motion.div>
                                        ))}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-emerald-400 tracking-tighter leading-none">92%</p>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">Optimal</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Next Appointment */}
                        {upcoming.length > 0 && (
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
                                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <h3 className="text-xs font-bold text-slate-700 tracking-tight">Next Appointment</h3>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-11 w-11 rounded-xl overflow-hidden border-2 border-emerald-100 flex-shrink-0">
                                            <img
                                                src={upcoming[0].doctor?.profileImage && upcoming[0].doctor.profileImage !== 'default-avatar.png'
                                                    ? (upcoming[0].doctor.profileImage.startsWith('http') ? upcoming[0].doctor.profileImage : `http://localhost:5000/${upcoming[0].doctor.profileImage}`)
                                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(upcoming[0].doctor?.name || 'D')}&background=10b981&color=fff&bold=true&size=128`}
                                                alt="Doctor"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{upcoming[0].doctor?.name}</p>
                                            <p className="text-[11px] text-slate-400 font-medium">{upcoming[0].doctor?.specialization}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <Calendar size={11} className="text-emerald-600" />
                                                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide">Date</span>
                                            </div>
                                            <p className="text-xs font-bold text-slate-800">{formatDate(upcoming[0].date)}</p>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <Clock size={11} className="text-blue-600" />
                                                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wide">Time</span>
                                            </div>
                                            <p className="text-xs font-bold text-slate-800">{upcoming[0].time}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <StatusBadge status={getAppointmentStatus(upcoming[0])} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Daily Health Tip */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-7 w-7 bg-amber-50 rounded-lg flex items-center justify-center">
                                        <Zap size={13} className="text-amber-500" />
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-700">Daily Health Tip</h3>
                                </div>
                                <span className="text-[9px] font-black text-amber-500 uppercase tracking-wider bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">Today</span>
                            </div>
                            <div className="p-5">
                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-4">
                                    <p className="text-xs font-bold text-emerald-700 leading-relaxed">
                                        Drink at least 2.5L of water today to improve focus, boost metabolism, and support kidney health.
                                    </p>
                                </div>
                                <div className="space-y-2.5">
                                    {[
                                        { icon: '🏃', text: '30 min walk recommended', color: 'bg-blue-50 text-blue-700' },
                                        { icon: '🥗', text: 'Eat more leafy greens', color: 'bg-emerald-50 text-emerald-700' },
                                        { icon: '😴', text: 'Sleep 7-8 hours tonight', color: 'bg-violet-50 text-violet-700' },
                                    ].map((tip, i) => (
                                        <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-semibold ${tip.color}`}>
                                            <span>{tip.icon}</span>
                                            {tip.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Document Vault */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                                <div className="flex items-center gap-2">
                                    <div className="h-7 w-7 bg-slate-900 rounded-lg flex items-center justify-center">
                                        <Lock size={13} className="text-white" />
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-700">Document Vault</h3>
                                </div>
                                <button
                                    onClick={() => navigate('/patient/records')}
                                    className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                                >
                                    All Files <ArrowRight size={11} />
                                </button>
                            </div>
                            <div className="p-4 space-y-2">
                                {documents.map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-9 w-9 rounded-lg ${doc.bg} ${doc.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                                <FileText size={15} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-700 tracking-tight">{doc.name}</p>
                                                <p className="text-[9px] text-slate-400 font-medium">{doc.type} · {doc.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] text-slate-300 font-medium">{doc.size}</span>
                                            <Download size={13} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-5 py-3 border-t border-slate-50">
                                <button className="w-full py-2.5 border border-dashed border-slate-200 rounded-xl text-[11px] font-bold text-slate-400 hover:border-emerald-300 hover:text-emerald-600 transition-all flex items-center justify-center gap-2">
                                    <Plus size={13} /> Upload New Document
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Hospital Certifications</p>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { icon: Shield, label: 'NABH Accredited', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                    { icon: Award, label: 'ISO 9001:2026', color: 'text-blue-600', bg: 'bg-blue-50' },
                                    { icon: Users, label: '500+ Doctors', color: 'text-violet-600', bg: 'bg-violet-50' },
                                    { icon: CheckCircle2, label: 'HIPAA Secure', color: 'text-amber-600', bg: 'bg-amber-50' },
                                ].map((b, i) => (
                                    <div key={i} className={`flex items-center gap-2 p-2.5 rounded-xl ${b.bg}`}>
                                        <b.icon size={13} className={b.color} />
                                        <span className={`text-[9px] font-bold ${b.color}`}>{b.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Activity Timeline + Profile Completion */}
                <div className="grid lg:grid-cols-12 gap-6">
                    {/* Activity Timeline */}
                    <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <ClipboardList size={16} className="text-blue-600" />
                                </div>
                                <h2 className="text-sm font-bold text-slate-800 tracking-tight">Activity Timeline</h2>
                            </div>
                            <button
                                onClick={() => navigate('/patient/history')}
                                className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                                View full history <ArrowRight size={12} />
                            </button>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                [1, 2, 3].map(i => <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse mb-3"></div>)
                            ) : appointments.length > 0 ? (
                                <div className="relative">
                                    <div className="absolute left-[22px] top-2 bottom-2 w-px bg-gradient-to-b from-emerald-200 via-slate-100 to-transparent"></div>
                                    <div className="space-y-4">
                                        {appointments.slice(0, 5).map((apt, i) => (
                                            <motion.div
                                                key={apt._id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.06 }}
                                                className="flex items-center gap-4 pl-12 relative"
                                            >
                                                <div className={`absolute left-3.5 h-4 w-4 rounded-full border-2 flex-shrink-0 ${
                                                    apt.status === 'completed' ? 'bg-emerald-500 border-emerald-500' :
                                                    apt.status === 'confirmed' ? 'bg-blue-500 border-blue-500' :
                                                    apt.status === 'cancelled' ? 'bg-rose-400 border-rose-400' :
                                                    'bg-amber-400 border-amber-400'
                                                }`}></div>
                                                <div className="flex-1 flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100 hover:border-emerald-100 hover:bg-white transition-all">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700">{apt.doctor?.name || 'Doctor'} <span className="text-slate-400 font-medium">· {apt.doctor?.specialization}</span></p>
                                                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{formatDate(apt.date)} at {apt.time}</p>
                                                    </div>
                                                    <StatusBadge status={getAppointmentStatus(apt)} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-sm text-slate-400 font-medium">No appointment history yet.</p>
                                    <button onClick={() => navigate('/patient/book')} className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all">
                                        Book your first appointment
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile Completion */}
                    <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
                            <div className="h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                <User size={15} className="text-emerald-600" />
                            </div>
                            <h3 className="text-xs font-bold text-slate-700">Profile Completeness</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex items-center gap-5">
                                <div className="relative h-16 w-16 flex-shrink-0">
                                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#10b981" strokeWidth="3"
                                            strokeDasharray="70 100" strokeLinecap="round" />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-slate-800">70%</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Profile Score</p>
                                    <p className="text-[11px] text-slate-400 font-medium">Complete your profile to unlock all features</p>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                {[
                                    { label: 'Basic Information', done: true },
                                    { label: 'Contact Details', done: true },
                                    { label: 'Emergency Contact', done: true },
                                    { label: 'Blood Group', done: false },
                                    { label: 'Medical History', done: false },
                                    { label: 'Insurance Details', done: false },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-emerald-500' : 'bg-slate-100 border border-slate-200'}`}>
                                                {item.done && <CheckCircle2 size={10} className="text-white" strokeWidth={3} />}
                                            </div>
                                            <span className={`text-[11px] font-medium ${item.done ? 'text-slate-600' : 'text-slate-400'}`}>{item.label}</span>
                                        </div>
                                        {!item.done && <span className="text-[9px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-full">Pending</span>}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => navigate('/patient/profile')}
                                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200 flex items-center justify-center gap-2"
                            >
                                Complete Profile <ArrowRight size={13} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Trust Bar */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Shield size={14} className="text-emerald-600" />
                        Your data is encrypted and HIPAA compliant.
                    </div>
                    <div className="flex items-center gap-6">
                        {[
                            { icon: Shield, label: 'SSL Secured', color: 'text-emerald-600' },
                            { icon: Lock, label: 'AES-256', color: 'text-blue-600' },
                            { icon: CheckCircle2, label: 'NABH Certified', color: 'text-violet-600' },
                            { icon: Star, label: 'ISO 9001:2026', color: 'text-amber-500' },
                        ].map((b, i) => (
                            <div key={i} className={`flex items-center gap-1.5 text-[10px] font-bold ${b.color}`}>
                                <b.icon size={12} /> {b.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-amber-50 text-amber-600 border border-amber-200',
        confirmed: 'bg-blue-50 text-blue-600 border border-blue-200',
        completed: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
        cancelled: 'bg-rose-50 text-rose-600 border border-rose-200',
        expired: 'bg-slate-50 text-slate-600 border border-slate-200',
    };

    const displayText = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        completed: 'Completed',
        cancelled: 'Cancelled',
        expired: 'Expired'
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${styles[status] || styles.pending}`}>
            {displayText[status] || status}
        </span>
    );
};

export default PatientDashboard;
