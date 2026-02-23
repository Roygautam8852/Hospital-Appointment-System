import { useState, useEffect } from 'react';
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
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

const PatientDashboard = () => {
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
        { label: 'Upcoming', value: appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: History, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Total Visits', value: appointments.length, icon: User, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <DashboardLayout>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Hello, {user?.name} 👋</h1>
                <p className="text-slate-500">Welcome to your health dashboard. Stay updated with your appointments.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5"
                    >
                        <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Appointments List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Recent Appointments</h2>
                        <button className="text-primary-600 font-bold text-sm hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-3xl animate-pulse shadow-sm"></div>)
                        ) : appointments.length > 0 ? (
                            appointments.map((apt) => (
                                <div key={apt._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={apt.doctor.profileImage || 'https://via.placeholder.com/100'}
                                            alt={apt.doctor.name}
                                            className="h-12 w-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="font-bold text-slate-900">{apt.doctor.name}</h4>
                                            <p className="text-xs text-slate-500 font-medium">{apt.doctor.specialization} • {apt.department}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12">
                                        <div className="hidden md:block">
                                            <p className="text-sm font-bold text-slate-900">{new Date(apt.date).toLocaleDateString()}</p>
                                            <p className="text-xs text-slate-500">{apt.time}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <StatusBadge status={apt.status} />
                                            <button className="p-2 rounded-full hover:bg-slate-50 text-slate-400 group-hover:text-primary-600 transition-colors">
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                                <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
                                <p className="text-slate-500 font-medium tracking-tight">No appointments found.</p>
                                <button className="btn-primary mt-6 text-sm">Book Your First Appointment</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Medical Summary */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">Health Overview</h2>
                    <div className="bg-primary-600 rounded-3xl p-8 text-white shadow-lg shadow-primary-200">
                        <p className="text-primary-100 text-sm font-medium mb-1">Upcoming Milestone</p>
                        <h3 className="text-2xl font-bold mb-6">Annual Checkup</h3>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-10 w-10 flex-shrink-0 bg-white/20 rounded-full flex items-center justify-center">
                                <Clock3 size={20} />
                            </div>
                            <p className="text-sm">Scheduled in 12 days</p>
                        </div>
                        <button className="w-full py-3 bg-white text-primary-600 rounded-xl font-bold text-sm hover:bg-primary-50 transition-colors">
                            Manage Appointments
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold mb-6 flex items-center gap-2">
                            <FileText size={20} className="text-primary-600" />
                            Recent Documents
                        </h3>
                        <div className="space-y-4">
                            {['Prescription_Feb_20.pdf', 'Lab_Report_Jan_15.pdf'].map((doc, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                            <FileText size={16} />
                                        </div>
                                        <span className="text-sm text-slate-600 group-hover:text-primary-600 font-medium truncate max-w-[150px]">{doc}</span>
                                    </div>
                                    <button className="text-xs font-bold text-slate-400 group-hover:text-primary-600">Download</button>
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
        pending: 'bg-amber-50 text-amber-600',
        confirmed: 'bg-blue-50 text-blue-600',
        completed: 'bg-green-50 text-green-600',
        cancelled: 'bg-red-50 text-red-600',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${styles[status]}`}>
            {status}
        </span>
    );
};

export default PatientDashboard;
