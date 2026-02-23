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
        { label: 'Today\'s Patients', value: appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length, icon: Users, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Pending Requests', value: appointments.filter(a => a.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
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
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {user?.name}</h1>
                    <p className="text-slate-500 font-medium tracking-tight">You have {stats[1].value} new appointment requests for review.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    Set Availability <Clock size={18} />
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6"
                    >
                        <div className={`h-16 w-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                            <stat.icon size={32} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Appointment Board */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Appointments</h2>
                        <div className="flex gap-2">
                            <button className="px-4 py-1.5 rounded-full bg-primary-600 text-white text-xs font-bold">All</button>
                            <button className="px-4 py-1.5 rounded-full bg-white text-slate-500 text-xs font-bold border border-slate-100 shadow-sm">Today</button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="h-28 bg-white rounded-3xl animate-pulse shadow-sm"></div>)
                        ) : appointments.length > 0 ? (
                            appointments.map((apt) => (
                                <div key={apt._id} className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:shadow-lg transition-all border-l-4 border-l-primary-500">
                                    <div className="flex items-center gap-5">
                                        <img
                                            src={apt.patient.profileImage || `https://ui-avatars.com/api/?name=${apt.patient.name}&background=random`}
                                            alt={apt.patient.name}
                                            className="h-14 w-14 rounded-2xl object-cover ring-4 ring-slate-50"
                                        />
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-900">{apt.patient.name}</h4>
                                            <p className="text-sm text-slate-500 font-medium">Reason: <span className="text-slate-700">{apt.reason}</span></p>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="flex items-center gap-1 text-xs text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-md">
                                                    <Clock size={12} /> {apt.time}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-md">
                                                    <Calendar size={12} /> {new Date(apt.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {apt.status === 'pending' ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(apt._id, 'confirmed')}
                                                    className="h-10 w-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Check size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(apt._id, 'cancelled')}
                                                    className="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-4">
                                                <StatusBadge status={apt.status} />
                                                {apt.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(apt._id, 'completed')}
                                                        className="btn-primary py-2 text-xs font-bold"
                                                    >
                                                        Mark Complete
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white py-20 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                                <ClipboardList className="mx-auto text-slate-200 mb-6" size={64} />
                                <h3 className="text-xl font-bold text-slate-700 mb-1">No appointments yet</h3>
                                <p className="text-slate-400 max-w-xs mx-auto">Once patients book appointments with you, they will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-primary-600" />
                            Service Overview
                        </h2>
                        <div className="bg-slate-900 rounded-3xl p-8 text-white">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Weekly Growth</p>
                                    <h3 className="text-4xl font-bold">+24%</h3>
                                </div>
                                <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-primary-400">
                                    <TrendingUp size={24} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Total Consultation</span>
                                    <span className="font-bold">142</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Satisfaction Rate</span>
                                    <span className="font-bold">98%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full mt-4">
                                    <div className="bg-primary-500 h-full rounded-full w-[80%]"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-lg mb-6 tracking-tight">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full py-4 text-left px-5 rounded-2xl bg-slate-50 hover:bg-primary-50 transition-all font-bold text-slate-700 flex items-center justify-between group">
                                Add New Prescription
                                <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 group-hover:text-primary-600 transition-all" />
                            </button>
                            <button className="w-full py-4 text-left px-5 rounded-2xl bg-slate-50 hover:bg-primary-50 transition-all font-bold text-slate-700 flex items-center justify-between group">
                                Update Profile
                                <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 group-hover:text-primary-600 transition-all" />
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-amber-100 text-amber-700',
        confirmed: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${styles[status]}`}>
            {status}
        </span>
    );
};

export default DoctorDashboard;
