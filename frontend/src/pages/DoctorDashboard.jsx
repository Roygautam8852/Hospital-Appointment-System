import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Users,
    Calendar,
    Clock,
    ClipboardList,
    Check,
    X,
    ChevronRight,
    TrendingUp,
    UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/appointments', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAppointments(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const stats = [
        { label: 'Today\'s Patients', value: appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-500/10', trend: '+4 new' },
        { label: 'Pending Requests', value: appointments.filter(a => a.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-500/10', trend: 'Needs action' },
        { label: 'Avg. Rating', value: '4.9', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-500/10', trend: 'Top 1%' },
        { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: UserCheck, color: 'text-primary-600', bg: 'bg-primary-500/10', trend: 'Lifetime' },
    ];

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/appointments/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(appointments.map(a => a._id === id ? { ...a, status } : a));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-10 pb-20">
                {/* Modern Header Section */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-[2] relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 text-white group shadow-2xl shadow-slate-900/20"
                    >
                        {/* Animated Mesh Gradients */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[120%] bg-primary-600/30 rounded-full blur-[140px] animate-pulse"></div>
                            <div className="absolute -bottom-[20%] right-[0%] w-[50%] h-[100%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-12 w-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center">
                                    <ClipboardList className="text-primary-400" size={24} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Clinician Portal</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-none">
                                Welcome, <span className="text-primary-400">Dr. {user?.name.split(' ')[0]}</span>
                            </h1>
                            <p className="text-slate-400 font-medium max-w-md text-lg leading-relaxed">
                                You have <span className="text-white font-black underline decoration-primary-500 decoration-4 underline-offset-4">{stats[1].value} patient requests</span> that require your authorization today.
                            </p>
                        </div>

                        <div className="absolute top-10 right-10 flex gap-3">
                            <button className="h-12 w-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90">
                                <Calendar size={20} />
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex-1 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group border-b-4 border-b-indigo-500"
                    >
                        <div className="flex justify-between items-start mb-10">
                            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:rotate-6 transition-all duration-500">
                                <TrendingUp size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">LIVE PULSE</span>
                        </div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Service Efficiency</p>
                        <h3 className="text-5xl font-black text-slate-900 mb-6">98.2%</h3>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '98.2%' }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                            className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group"
                        >
                            <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-lg shadow-black/5`}>
                                <stat.icon size={26} />
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</h5>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                                    <span className={`text-[10px] font-bold ${stat.color} py-0.5 px-2 rounded-full bg-slate-50 border border-slate-100`}>{stat.trend}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bento Grid Content */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Appointments Section (8/12) */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <Users className="text-primary-600" />
                                Appointment Ledger
                            </h2>
                            <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
                                <button className="px-6 py-2 rounded-xl bg-white text-slate-900 text-xs font-black shadow-sm uppercase tracking-widest">All</button>
                                <button className="px-6 py-2 rounded-xl text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-900 transition-all">Today</button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                [1, 2, 3].map(i => <div key={i} className="h-32 bg-white/50 rounded-[2.5rem] animate-pulse border border-slate-100"></div>)
                            ) : appointments.length > 0 ? (
                                appointments.map((apt, idx) => (
                                    <motion.div
                                        key={apt._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:shadow-2xl hover:shadow-black/[0.04] transition-all relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <img
                                                    src={apt.patient && apt.patient.profileImage && apt.patient.profileImage !== 'default-avatar.png'
                                                        ? (apt.patient.profileImage.startsWith('http') ? apt.patient.profileImage : `http://localhost:5000/${apt.patient.profileImage}`)
                                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patientName || apt.patient?.name || 'Patient')}&background=4f46e5&color=fff&bold=true`}
                                                    alt={apt.patientName || apt.patient?.name || 'Patient'}
                                                    className="h-20 w-20 rounded-3xl object-cover ring-4 ring-slate-50 shadow-lg group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patientName || apt.patient?.name || 'Patient')}&background=4f46e5&color=fff&bold=true`;
                                                    }}
                                                />
                                                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center">
                                                    <Users size={14} className="text-primary-600" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="font-extrabold text-xl text-slate-900 tracking-tight">{apt.patientName || apt.patient?.name || 'Unknown Patient'}</h4>
                                                    <StatusBadge status={apt.status} />
                                                </div>
                                                <p className="text-[13px] text-slate-500 font-bold flex items-center gap-4 mb-3">
                                                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                                        <Clock size={14} className="text-slate-400" /> {apt.time}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                                        <Calendar size={14} className="text-slate-400" /> {new Date(apt.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                    </span>
                                                </p>
                                                <p className="text-sm text-slate-400 font-medium">Reason: <span className="text-slate-900 font-bold tracking-tight">{apt.reason}</span></p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 relative z-10">
                                            {apt.status === 'pending' ? (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleStatusUpdate(apt._id, 'confirmed')}
                                                        className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm border border-emerald-100 active:scale-90"
                                                        title="Confirm Appointment"
                                                    >
                                                        <Check size={24} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(apt._id, 'cancelled')}
                                                        className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100 active:scale-90"
                                                        title="Decline Request"
                                                    >
                                                        <X size={24} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    {apt.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(apt._id, 'completed')}
                                                            className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl hover:-translate-y-0.5 active:scale-95"
                                                        >
                                                            Finalize Visit
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="bg-white py-24 rounded-[3.5rem] border border-slate-100 text-center shadow-sm">
                                    <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
                                        <ClipboardList className="text-slate-300" size={48} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">Clean Clinical Record</h3>
                                    <p className="text-slate-400 font-medium max-w-xs mx-auto">Patient bookings and scheduling requests will synchronize here automatically.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Bento (4/12) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Weekly Goal Card */}
                        <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/10">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                <TrendingUp size={120} />
                            </div>
                            <h3 className="text-xl font-black mb-10 relative z-10 flex items-center gap-2">
                                <span className="h-2 w-2 bg-primary-500 rounded-full animate-ping"></span>
                                Schedule Dynamics
                            </h3>
                            <div className="space-y-8 relative z-10">
                                <div>
                                    <div className="flex justify-between items-end mb-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consultation Cap</p>
                                        <span className="text-2xl font-black">128/150</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '85%' }}
                                            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Growth</p>
                                        <p className="text-xl font-black text-emerald-400">+18%</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Reviews</p>
                                        <p className="text-xl font-black text-indigo-400">4.92</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Card */}
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Rapid Terminal</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Issue Digital Prescription', icon: ClipboardList, bg: 'bg-emerald-50 text-emerald-600' },
                                    { label: 'Update Availability Grid', icon: Clock, bg: 'bg-indigo-50 text-indigo-600' },
                                    { label: 'Access Medical Repository', icon: Users, bg: 'bg-amber-50 text-amber-600' },
                                ].map((action, i) => (
                                    <button
                                        key={i}
                                        className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-white border-2 border-transparent hover:border-slate-100 transition-all text-left flex items-center justify-between group shadow-sm hover:shadow-xl hover:-translate-y-1"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-xl ${action.bg} flex items-center justify-center shadow-sm`}>
                                                <action.icon size={18} />
                                            </div>
                                            <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{action.label}</span>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Schedule Pulsar Card */}
                        <div className="p-10 rounded-[3rem] bg-indigo-600 text-white relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent"></div>
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 animate-bounce">
                                    <UserCheck size={32} />
                                </div>
                                <h4 className="text-2xl font-black mb-2">Ready for Visit?</h4>
                                <p className="text-indigo-100 text-sm font-medium mb-8">Synchronize your local schedule with the global network.</p>
                                <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-900/20 hover:bg-indigo-50 transition-all active:scale-95">
                                    Connect Network
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-amber-500/10 text-amber-600 border-amber-200',
        confirmed: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
        completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
        cancelled: 'bg-rose-500/10 text-rose-600 border-rose-200',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
            {status}
        </span>
    );
};

export default DoctorDashboard;
