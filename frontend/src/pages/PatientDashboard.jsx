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
    Filter
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
        { label: 'Upcoming', value: appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: History, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Total Visits', value: appointments.length, icon: User, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Pending Payments', value: '₹ 1,200', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <DashboardLayout>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hello, {user?.name} 👋</h1>
                    </div>
                    <p className="text-slate-500 font-medium mb-6">Welcome to your health dashboard. Stay updated with your appointments.</p>

                    {/* Quick Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate('/patient/book')}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md shadow-primary-100 hover:bg-primary-700 transition-all"
                        >
                            <Plus size={14} /> Book Appointment
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:border-primary-200 hover:text-primary-600 transition-all">
                            <Upload size={14} /> Upload Report
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:border-primary-200 hover:text-primary-600 transition-all">
                            <MessageSquare size={14} /> Chat with Doctor
                        </button>
                    </div>
                </div>

                {/* Notification Bell */}
                <div className="relative self-start md:self-center">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="h-12 w-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-100 transition-all shadow-sm relative group"
                    >
                        <Bell size={22} className="group-hover:rotate-12 transition-transform" />
                        <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-50 z-50 p-2 overflow-hidden"
                            >
                                <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Notifications</h3>
                                    <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">3 New</span>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map((n) => (
                                        <div key={n.id} className="p-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors cursor-pointer group">
                                            <p className="text-xs font-bold text-slate-700 mb-1 group-hover:text-primary-600 transition-colors">{n.text}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{n.time}</p>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-3 text-center text-[10px] font-black text-primary-600 uppercase tracking-widest hover:bg-primary-50 transition-colors">
                                    View All Notifications
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-xl hover:border-primary-100 transition-all group"
                    >
                        <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <stat.icon size={26} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Appointments List */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Recent Appointments</h2>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3 py-1.5 shadow-sm">
                                <Filter size={14} className="text-slate-400" />
                                <select className="text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none bg-transparent cursor-pointer">
                                    <option>All</option>
                                    <option>Upcoming</option>
                                    <option>Completed</option>
                                </select>
                            </div>
                            <button className="text-primary-600 font-black text-[10px] uppercase tracking-widest hover:underline">View All</button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-[2.5rem] animate-pulse shadow-sm border border-slate-50"></div>)
                        ) : appointments.length > 0 ? (
                            appointments.map((apt) => (
                                <div key={apt._id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl hover:border-primary-100 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl overflow-hidden shadow-inner border border-slate-50">
                                            <img
                                                src={apt.doctor.profileImage || `https://i.pravatar.cc/150?u=${apt.doctor.name}`}
                                                alt={apt.doctor.name}
                                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 text-sm tracking-tight">{apt.doctor.name}</h4>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{apt.doctor.specialization} • {apt.department}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-10">
                                        <div className="hidden md:block text-right">
                                            <p className="text-sm font-black text-slate-800 tracking-tight">{new Date(apt.date).toLocaleDateString()}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{apt.time}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <StatusBadge status={apt.status} />
                                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-12 rounded-[3rem] border-2 border-dashed border-slate-100 text-center shadow-sm">
                                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Calendar className="text-slate-200" size={32} />
                                </div>
                                <h4 className="text-lg font-black text-slate-800 mb-2">No Appointments Yet</h4>
                                <p className="text-xs text-slate-400 font-medium mb-8 max-w-[240px] mx-auto italic">
                                    “Book your first consultation to start tracking your health journey.”
                                </p>
                                <button
                                    onClick={() => navigate('/patient/book')}
                                    className="px-8 py-3 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-100 hover:bg-primary-700 transition-all hover:scale-105"
                                >
                                    Schedule Now
                                </button>
                            </div>
                        )}
                    </div>

                    {/* New Medical Reports Section */}
                    <div className="pt-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Recent Medical Reports</h2>
                            <button className="text-primary-600 font-black text-[10px] uppercase tracking-widest hover:underline">View Archive</button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { name: 'Blood Test Result', type: 'Laboratory', date: '21 Feb 2026', icon: FileText },
                                { name: 'X-Ray Chest PA', type: 'Radiology', date: '15 Feb 2026', icon: FileText },
                                { name: 'EGC Report', type: 'Cardiology', date: '10 Feb 2026', icon: FileText },
                                { name: 'General Prescription', type: 'Consultation', date: '05 Feb 2026', icon: FileText },
                            ].map((report, i) => (
                                <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group group-hover:border-primary-100">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                                            <report.icon size={18} />
                                        </div>
                                        <div>
                                            <h5 className="text-[11px] font-black text-slate-800 tracking-tight">{report.name}</h5>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{report.date} • {report.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors" title="Download PDF">
                                            <Download size={14} />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors" title="View Report">
                                            <Eye size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Medical Summary */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Health Overview</h2>
                    <div className="bg-primary-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                        <p className="text-primary-100 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Upcoming Milestone</p>
                        <h3 className="text-3xl font-black mb-6 leading-tight">Annual Checkup</h3>

                        <div className="space-y-6 mb-8">
                            <div className="flex items-center gap-4 p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                                <div className="h-10 w-10 flex-shrink-0 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-lg">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-primary-100 uppercase tracking-widest">Next visit in</p>
                                    <p className="text-sm font-bold">12 Days 04:22:10</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl overflow-hidden border-2 border-white/20 shadow-md">
                                    <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400" alt="Doctor" className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-primary-100 uppercase tracking-widest">Assigned Doctor</p>
                                    <p className="text-sm font-bold">Dr. Sharma</p>
                                    <p className="text-[10px] font-medium text-primary-100 opacity-80 italic">Cardiology Specialist</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-white text-primary-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-primary-50 transition-all hover:scale-[1.02] active:scale-95">
                            Manage Appointment
                        </button>
                    </div>

                    {/* Daily Health Tip Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-4 right-4 text-amber-400 group-hover:rotate-12 transition-transform">
                            <Lightbulb size={24} />
                        </div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Daily Health Tip</h4>
                        <p className="text-sm font-black text-slate-800 leading-relaxed pr-6">
                            "Drink at least 2L of water daily to maintain optimal kidney function and skin hydration."
                        </p>
                        <div className="mt-6 flex items-center gap-2 text-primary-600 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:gap-3 transition-all">
                            View More Tips <ChevronRight size={12} />
                        </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-dashed border-slate-200">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <FileText size={16} />
                            Quick Access Links
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Prescription_Feb_20.pdf', size: '1.2 MB' },
                                { name: 'Lab_Report_Jan_15.pdf', size: '0.8 MB' }
                            ].map((doc, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer bg-white p-3 rounded-2xl border border-slate-50 hover:border-primary-100 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 truncate w-32">{doc.name}</p>
                                            <p className="text-[9px] font-medium text-slate-400">{doc.size}</p>
                                        </div>
                                    </div>
                                    <button className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all">
                                        <Download size={14} />
                                    </button>
                                </div>
                            ))}
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
        confirmed: 'bg-blue-100/50 text-blue-600 border-blue-200/50',
        completed: 'bg-emerald-100/50 text-emerald-600 border-emerald-200/50',
        cancelled: 'bg-rose-100/50 text-rose-600 border-rose-200/50',
    };

    return (
        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
            {status}
        </span>
    );
};

export default PatientDashboard;
