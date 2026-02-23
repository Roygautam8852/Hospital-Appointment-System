import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Users,
    UserPlus,
    Calendar,
    DollarSign,
    Activity,
    TrendingUp,
    MapPin,
    Stethoscope
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        patients: 1250,
        doctors: 48,
        appointments: 320,
        revenue: 15400
    });

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                fill: true,
                label: 'Revenue ($)',
                data: [12000, 19000, 15000, 22000, 18000, 25000],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const cards = [
        { label: 'Total Patients', value: stats.patients, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Doctors', value: stats.doctors, icon: Stethoscope, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Appointments', value: stats.appointments, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Monthly Revenue', value: `$${stats.revenue}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    return (
        <DashboardLayout>
            <div className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Hospital Overview</h1>
                    <p className="text-slate-500">System-wide monitoring and analytics.</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn-secondary text-sm font-bold flex items-center gap-2">
                        <Activity size={18} /> Export Reports
                    </button>
                    <button className="btn-primary text-sm font-bold flex items-center gap-2">
                        <UserPlus size={18} /> Add Doctor
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {cards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`h-12 w-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center`}>
                                <card.icon size={24} />
                            </div>
                            <span className="text-green-500 text-xs font-bold flex items-center">+12% <TrendingUp size={12} className="ml-1" /></span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium mb-1">{card.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-lg">Revenue Analytics</h3>
                        <select className="bg-slate-50 border-none rounded-lg text-sm font-bold px-4 py-2 outline-none">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-[300px]">
                        <Line data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-lg mb-6">Recent Activities</h3>
                    <div className="space-y-6">
                        {[
                            { text: 'Dr. James added to Cardiology', time: '2 mins ago', icon: UserPlus, color: 'text-blue-500' },
                            { text: 'Appointment #423 cancelled', time: '1 hour ago', icon: Calendar, color: 'text-red-500' },
                            { text: 'Monthly revenue report ready', time: '3 hours ago', icon: DollarSign, color: 'text-green-500' },
                            { text: 'New patient registered', time: '5 hours ago', icon: Users, color: 'text-purple-500' },
                        ].map((activity, i) => (
                            <div key={i} className="flex gap-4">
                                <div className={`h-10 w-10 flex-shrink-0 rounded-full bg-slate-50 flex items-center justify-center ${activity.color}`}>
                                    <activity.icon size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{activity.text}</p>
                                    <p className="text-xs text-slate-400">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 text-sm font-bold text-primary-600 hover:bg-primary-50 rounded-xl transition-colors">
                        View System Logs
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
