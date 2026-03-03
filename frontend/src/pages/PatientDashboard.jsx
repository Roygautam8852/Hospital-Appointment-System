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
    XCircle,
    Clock3,
    ChevronRight,
    TrendingUp,
    History,
    FileText,
    Bell,
    MessageSquare,
    Plus,
    Upload,
    CreditCard,
    Download,
    Eye,
    DollarSign,
    Lightbulb,
    ChevronDown,
    Filter,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PatientDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        { id: 1, text: 'Appointment reminder: Dr. Sharma today at 4:00 PM', time: '2h ago', type: 'reminder' },
        { id: 2, text: 'Your Blood Test report is now ready to download', time: '5h ago', type: 'report' },
        { id: 3, text: 'Payment confirmed for Invoice #4421', time: '1d ago', type: 'payment' },
    ];

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
        { label: 'Upcoming', value: appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+2 this week' },
        { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: History, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Total checks' },
        { label: 'Visits', value: appointments.length, icon: User, color: 'text-rose-600', bg: 'bg-rose-50', trend: '12% Increase' },
        { label: 'Payments', value: '₹1.2k', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Pending' },
    ];

    return (
        <DashboardLayout>
            {/* Header Section with Bento Style */}
            <div className="flex flex-col xl:flex-row gap-8 mb-12">
                {/* Welcome Card */}
                <div className="flex-[2] bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600/5 rounded-full -mr-40 -mt-40 blur-[80px] group-hover:bg-primary-600/10 transition-colors"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-primary-100">Patient Dashboard</span>
                            <div className="h-1.5 w-1.5 bg-slate-200 rounded-full"></div>
                            <span className="text-slate-400 text-xs font-semibold">Updated 2m ago</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3 flex items-center gap-3">
                            Hello, {user?.name.split(' ')[0]} <span className="animate-bounce">👋</span>
                        </h1>
                        <p className="text-base text-slate-500 font-medium max-w-lg leading-relaxed mb-8">
                            Your health records are up to date. You have <span className="text-primary-600 font-bold">{appointments.filter(a => a.status === 'confirmed').length} confirmed appointments</span> scheduled for this week.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate('/patient/book')}
                                className="px-6 py-3 bg-primary-600 text-white rounded-[1.2rem] text-sm font-bold shadow-2xl shadow-primary-200 hover:bg-primary-700 transition-all hover:scale-[1.05] active:scale-95 flex items-center gap-2"
                            >
                                <Plus size={18} /> New Appointment
                            </button>
                            <button
                                onClick={() => navigate('/patient/records')}
                                className="px-6 py-3 bg-white border-2 border-slate-100 text-slate-700 rounded-[1.2rem] text-sm font-bold hover:border-primary-200 hover:text-primary-600 transition-all shadow-sm flex items-center gap-2"
                            >
                                <Upload size={18} /> Add Record
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Health Status Card */}
                <div className="flex-1 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-8 group-hover:rotate-12 transition-transform">
                                <Activity className="text-primary-400" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Health Pulse</h3>
                            <p className="text-slate-400 text-sm font-medium">Weekly vitality and wellness status.</p>
                        </div>

                        <div className="mt-8 flex items-end justify-between">
                            <div className="flex items-end gap-1.5 h-24">
                                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ delay: i * 0.1, duration: 1 }}
                                        className={`w-3.5 rounded-full ${i === 3 ? 'bg-primary-500' : 'bg-white/20 hover:bg-white/40'} transition-colors cursor-pointer`}
                                    ></motion.div>
                                ))}
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-black text-primary-400 tracking-tighter leading-none mb-1">92%</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Optimal Score</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all group cursor-pointer"
                    >
                        <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/5`}>
                            <stat.icon size={26} />
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                            <span className={`text-[9px] font-bold ${stat.color} opacity-80 uppercase tracking-tighter`}>{stat.trend}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Main Activities (8/12) */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Timeline</h2>
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">Recent Events</span>
                        </div>
                        <button
                            onClick={() => navigate('/patient/history')}
                            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-primary-600 hover:border-primary-100 transition-all shadow-sm flex items-center gap-2 group"
                        >
                            <span className="text-[11px] font-bold">View Archive</span>
                            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="h-28 bg-white rounded-[3rem] animate-pulse shadow-sm border border-slate-50"></div>)
                        ) : appointments.length > 0 ? (
                            appointments.slice(0, 3).map((apt) => (
                                <motion.div
                                    key={apt._id}
                                    whileHover={{ x: 10 }}
                                    className="bg-white p-8 rounded-[3.5rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl hover:border-primary-100 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className="h-20 w-20 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white flex-shrink-0 bg-slate-50 relative group-hover:scale-110 transition-transform duration-700">
                                            <img
                                                src={apt.doctor && apt.doctor.profileImage && apt.doctor.profileImage !== 'default-avatar.png'
                                                    ? (apt.doctor.profileImage.startsWith('http') ? apt.doctor.profileImage : `http://localhost:5000/${apt.doctor.profileImage}`)
                                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor?.name || 'Doctor')}&background=10b981&color=fff&bold=true&size=128`}
                                                alt={apt.doctor?.name}
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-extrabold text-slate-900 tracking-tight text-lg">{apt.doctor?.name}</h4>
                                                <div className="h-1.5 w-1.5 bg-slate-200 rounded-full"></div>
                                                <span className="text-xs font-bold text-slate-400">{apt.doctor?.specialization}</span>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Calendar size={14} className="text-primary-500" />
                                                    <span className="text-[12px] font-bold">{new Date(apt.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Clock size={14} className="text-primary-500" />
                                                    <span className="text-[12px] font-bold">{apt.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className="hidden sm:flex flex-col items-end">
                                            <StatusBadge status={apt.status} />
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">Verified Slot</p>
                                        </div>
                                        <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary-600 group-hover:text-white group-hover:rotate-90 transition-all duration-500 shadow-sm shadow-black/5">
                                            <ChevronRight size={24} />
                                        </div>
                                    </div>

                                    <div className="absolute top-0 right-0 h-full w-1.5 bg-primary-600/0 group-hover:bg-primary-600 transition-all"></div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="bg-white p-20 rounded-[4rem] border-2 border-dashed border-slate-100 text-center shadow-sm">
                                <div className="h-24 w-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-slate-100">
                                    <Calendar className="text-slate-200" size={40} />
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 mb-2">Zero Appointments</h4>
                                <p className="text-slate-400 font-medium mb-10 max-w-[280px] mx-auto text-sm leading-relaxed">
                                    “Your wellness journey starts with a single consultation.”
                                </p>
                                <button
                                    onClick={() => navigate('/patient/book')}
                                    className="px-10 py-5 bg-primary-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-200 hover:bg-primary-700 transition-all hover:scale-105"
                                >
                                    Book Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar Bento (4/12) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Insights Card */}
                    <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-100/50 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Insight Hub</h3>
                            <button className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-all">
                                <Lightbulb size={20} />
                            </button>
                        </div>

                        <div className="bg-primary-50 rounded-[2.5rem] p-8 border border-primary-100 relative mb-8">
                            <p className="text-primary-600 font-black text-[10px] uppercase tracking-widest mb-4">Daily Health Tip</p>
                            <p className="text-primary-900 font-bold leading-relaxed mb-6">
                                "Drink 2.5L of water today to improve focus and metabolic rate."
                            </p>
                            <div className="flex items-center gap-2 text-primary-600 text-[11px] font-black uppercase tracking-tighter cursor-pointer hover:gap-3 transition-all">
                                Read Full Evidence <ChevronRight size={14} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest px-4">Upcoming Milestone</p>
                            <div className="flex items-center gap-5 p-6 bg-slate-900 rounded-[2.5rem] text-white shadow-xl shadow-slate-900/20 group/dark">
                                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center shadow-lg group-hover/dark:rotate-12 transition-transform">
                                    <Clock size={28} className="text-primary-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold tracking-tight">Annual Checkup</p>
                                    <p className="text-xs text-slate-500 font-bold">12 Days Reming</p>
                                </div>
                                <ChevronRight className="ml-auto text-slate-700" size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Report Archive Section */}
                    <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-100/50">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Vault</h3>
                            <button
                                onClick={() => navigate('/patient/records')}
                                className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline"
                            >
                                All Files
                            </button>
                        </div>

                        <div className="space-y-4">
                            {[
                                { name: 'Blood_Test_Feb.pdf', date: 'Feb 21', color: 'text-rose-500', bg: 'bg-rose-50' },
                                { name: 'Cardio_Rep_2026.pdf', date: 'Feb 12', color: 'text-indigo-500', bg: 'bg-indigo-50' },
                            ].map((doc, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-11 w-11 rounded-xl ${doc.bg} ${doc.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 tracking-tight">{doc.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">{doc.date}</p>
                                        </div>
                                    </div>
                                    <Download size={16} className="text-slate-300 group-hover:text-primary-600 transition-colors" />
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                            <button className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:text-slate-600 transition-colors">
                                <Plus size={16} /> Request New Service
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-amber-100/50 text-amber-600 border-amber-200/50',
        confirmed: 'bg-indigo-100/50 text-indigo-600 border-indigo-200/50',
        completed: 'bg-emerald-100/50 text-emerald-600 border-emerald-200/50',
        cancelled: 'bg-rose-100/50 text-rose-600 border-rose-200/50',
    };

    return (
        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
            {status}
        </span>
    );
};

export default PatientDashboard;
