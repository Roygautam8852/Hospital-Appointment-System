import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Search,
    Filter,
    Download,
    Calendar,
    ChevronRight,
    MapPin,
    Clock,
    User,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Clock3,
    AlertCircle,
    ArrowUpRight,
    FileText,
    Activity,
    History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyHistory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState('all');

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

    const filteredAppointments = appointments.filter(apt => {
        const matchesSearch =
            apt.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.reason?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;

        // Date range filtering logic (simple implementation)
        let matchesDate = true;
        if (dateRange !== 'all') {
            const aptDate = new Date(apt.date);
            const today = new Date();
            if (dateRange === 'last7days') {
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(today.getDate() - 7);
                matchesDate = aptDate >= sevenDaysAgo;
            } else if (dateRange === 'last30days') {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(today.getDate() - 30);
                matchesDate = aptDate >= thirtyDaysAgo;
            }
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    const stats = [
        { label: 'Total Visits', value: appointments.length, icon: Activity, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Doctors Met', value: [...new Set(appointments.map(a => a.doctor?._id))].length, icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    const exportToCSV = () => {
        const headers = ['Doctor', 'Specialty', 'Date', 'Time', 'Status', 'Reason'];
        const data = filteredAppointments.map(apt => [
            apt.doctor?.name || 'N/A',
            apt.doctor?.specialization || apt.department || 'N/A',
            new Date(apt.date).toLocaleDateString(),
            apt.time,
            apt.status,
            apt.reason
        ]);

        const csvContent = [headers, ...data].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `medicare_history_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Medical History</h1>
                        <p className="text-slate-500 font-medium">View and manage your past consultations and medical records.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:border-primary-600 hover:text-primary-600 transition-all group"
                        >
                            <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                            Export CSV
                        </button>
                        <button
                            onClick={() => navigate('/patient/book')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-200 hover:bg-primary-700 transition-all"
                        >
                            New Appointment
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:rotate-6 transition-transform`}>
                                    <stat.icon size={24} />
                                </div>
                                <div className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:text-primary-400 transition-colors">
                                    <ArrowUpRight size={16} />
                                </div>
                            </div>
                            <p className="text-slate-400 text-xs font-bold capitalize mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{stat.value}</h3>
                        </motion.div>
                    ))}
                </div>

                {/* Filters Section */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* SaaS Command Bar */}
                        <div className="flex-1 relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <Search className="text-slate-400 group-focus-within:text-primary-600 transition-all duration-300" size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search your medical history..."
                                className="w-full pl-14 pr-32 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600/10 focus:ring-4 focus:ring-primary-600/5 transition-all font-medium text-slate-800 outline-none placeholder:text-slate-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute inset-y-2 right-2 flex items-center gap-2">
                                <AnimatePresence>
                                    {searchTerm && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            onClick={() => setSearchTerm('')}
                                            className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                        >
                                            <AlertCircle size={16} className="rotate-45" />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                                <div className="hidden sm:flex items-center gap-1 px-2 py-1.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">⌘K</span>
                                </div>
                            </div>
                        </div>

                        {/* Dropdowns */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl">
                                <Filter size={16} className="text-slate-400" />
                                <select
                                    className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 outline-none cursor-pointer"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl">
                                <Calendar size={16} className="text-slate-400" />
                                <select
                                    className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 outline-none cursor-pointer"
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                >
                                    <option value="all">All Time</option>
                                    <option value="last7days">Last 7 Days</option>
                                    <option value="last30days">Last 30 Days</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="space-y-4">
                    {loading ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-white rounded-[2.5rem] animate-pulse shadow-sm border border-slate-50"></div>
                        ))
                    ) : filteredAppointments.length > 0 ? (
                        <AnimatePresence>
                            {filteredAppointments.map((apt, idx) => (
                                <motion.div
                                    key={apt._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
                                >
                                    <div className="flex items-start md:items-center gap-5">
                                        {/* Doctor Avatar */}
                                        <div className="relative shrink-0">
                                            <div className="h-16 w-16 rounded-3xl overflow-hidden border border-slate-100 shadow-inner group-hover:scale-110 transition-transform duration-500 bg-slate-50">
                                                <img
                                                    src={apt.doctor?.profileImage && apt.doctor.profileImage !== 'default-avatar.png'
                                                        ? (apt.doctor.profileImage.startsWith('http') ? apt.doctor.profileImage : `http://localhost:5000/${apt.doctor.profileImage}`)
                                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor?.name || 'Doctor')}&background=10b981&color=fff&bold=true`}
                                                    alt={apt.doctor?.name}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor?.name || 'Doctor')}&background=10b981&color=fff&bold=true`;
                                                    }}
                                                />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-50">
                                                <Activity size={12} className="text-primary-600" />
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-800 text-lg tracking-tight group-hover:text-primary-600 transition-colors capitalize">{apt.doctor?.name}</h4>
                                                <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                                                <span className="text-[10px] font-bold text-primary-500 capitalize tracking-wide">{apt.department || apt.doctor?.specialization}</span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-500 mb-3 line-clamp-1 italic pr-4">
                                                "{apt.reason}"
                                            </p>
                                            <div className="flex flex-wrap items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl">
                                                    <Calendar size={14} className="text-primary-400" />
                                                    {new Date(apt.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl">
                                                    <Clock size={14} className="text-primary-400" />
                                                    {apt.time}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions & Status */}
                                    <div className="flex items-center justify-between md:justify-end gap-10 pl-2 md:pl-0 border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0 border-slate-50">
                                        <div className="text-right">
                                            <StatusBadge status={apt.status} />
                                            <p className="text-[10px] font-bold text-slate-400 mt-2 capitalize">ID: #{apt._id?.slice(-8)}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-all shadow-sm group-hover:shadow-md">
                                                <FileText size={20} />
                                            </button>
                                            <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 cursor-pointer">
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-slate-100 text-center shadow-sm">
                            <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <History className="text-slate-200" size={48} />
                            </div>
                            <h4 className="text-2xl font-bold text-slate-800 mb-2">No Records Found</h4>
                            <p className="text-slate-400 font-medium mb-10 max-w-sm mx-auto">
                                We couldn't find any medical history matching your current filters. Try adjusting your search criteria.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                    setDateRange('all');
                                }}
                                className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Patient Records Sidebar Area (Mockup of what else could be here) */}
                {filteredAppointments.length > 0 && (
                    <div className="mt-16 grid lg:grid-cols-3 gap-8 pb-10">
                        <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100 flex flex-col justify-between">
                            <div>
                                <CheckCircle2 className="mb-6 opacity-40" size={32} />
                                <h3 className="text-2xl font-bold mb-3">Health Analytics</h3>
                                <p className="text-emerald-100 text-sm font-medium leading-relaxed mb-8">
                                    Your consistency in medical checkups has improved by 40% compared to last year. Maintain this pace for better wellness.
                                </p>
                            </div>
                            <button className="w-full py-4 bg-white/20 backdrop-blur-md rounded-2xl font-bold text-sm hover:bg-white/30 transition-all">
                                View Full Analytics
                            </button>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                            <div>
                                <Activity className="mb-6 text-primary-600" size={32} />
                                <h3 className="text-2xl font-bold text-slate-800 mb-3">Medical Documents</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                                    Access your 14 digital prescriptions and lab results stored securely in your vault.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="text-xs font-bold text-slate-600">Prescriptions</span>
                                    <span className="text-xs font-black text-primary-600">14 Files</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="text-xs font-bold text-slate-600">Lab Reports</span>
                                    <span className="text-xs font-black text-primary-600">8 Files</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <User className="mb-6 text-primary-400" size={32} />
                                    <h3 className="text-2xl font-bold mb-3">Top Specialist</h3>
                                    <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                                        You frequently visit {filteredAppointments[0]?.doctor?.name || 'your specialist'} ({filteredAppointments[0]?.department || 'General Medicine'}) for your wellness routine.
                                    </p>
                                </div>
                                <button className="w-full py-4 bg-primary-600 rounded-2xl font-bold text-sm hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/40">
                                    Quick Consult
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 h-40 w-40 bg-primary-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-amber-50 text-amber-600 border-amber-100',
        confirmed: 'bg-blue-50 text-blue-600 border-blue-100',
        completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        cancelled: 'bg-rose-50 text-rose-600 border-rose-100',
    };

    const icons = {
        pending: Clock3,
        confirmed: CheckCircle2,
        completed: CheckCircle2,
        cancelled: XCircle,
    };

    const Icon = icons[status] || Clock3;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold capitalize border ${styles[status]}`}>
            <Icon size={14} />
            {status}
        </span>
    );
};

export default MyHistory;
