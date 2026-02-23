import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    User,
    FileText,
    Bell,
    Settings,
    LogOut,
    ChevronRight,
    ArrowLeft,
    Clock,
    Users,
    DollarSign,
    Stethoscope
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = ({ role }) => {
    const location = useLocation();
    const { logout, user } = useAuth();

    const links = {
        patient: [
            { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
            { name: 'Book Appointment', path: '/patient/book', icon: Calendar },
            { name: 'My History', path: '/patient/history', icon: FileText },
            { name: 'Medical Records', path: '/patient/records', icon: FileText },
            { name: 'Notifications', path: '/patient/notifications', icon: Bell },
            { name: 'Profile', path: '/patient/profile', icon: User },
        ],
        doctor: [
            { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
            { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
            { name: 'Patient History', path: '/doctor/history', icon: FileText },
            { name: 'Availability', path: '/doctor/availability', icon: Clock },
            { name: 'Profile', path: '/doctor/profile', icon: User },
        ],
        admin: [
            { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
            { name: 'Doctors', path: '/admin/doctors', icon: User },
            { name: 'Patients', path: '/admin/patients', icon: Users },
            { name: 'Revenue', path: '/admin/revenue', icon: DollarSign },
            { name: 'Settings', path: '/admin/settings', icon: Settings },
        ]
    };

    const activeLinks = links[role] || [];

    return (
        <div className="w-56 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 pt-6 px-4 flex flex-col">
            <div className="mb-10 px-1 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="h-9 w-9 border-2 border-emerald-500 rounded-2xl flex items-center justify-center p-0.5 group-hover:rotate-6 transition-transform shadow-sm shadow-emerald-50">
                        <div className="h-full w-full bg-emerald-50 rounded-[10px] flex items-center justify-center">
                            <Stethoscope className="h-4 w-4 text-emerald-600" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-black text-slate-800 leading-none tracking-tight">MediCare</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Healthcare</span>
                    </div>
                </Link>

                <Link
                    to="/"
                    className="flex items-center justify-center w-8 h-8 text-slate-400 hover:text-primary-600 transition-all border border-slate-50 rounded-lg hover:bg-slate-50/50"
                    title="Back to Home"
                >
                    <ArrowLeft size={14} />
                </Link>
            </div>

            <div className="flex-1 space-y-2">
                {activeLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${isActive
                                ? 'bg-primary-50 text-primary-600 font-black'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <span className={isActive ? 'text-primary-600' : 'text-slate-400'}><Icon size={18} /></span>
                                <span className="text-[10px] uppercase font-black tracking-widest">{link.name}</span>
                            </div>
                            {isActive && <ChevronRight size={14} />}
                        </Link>
                    );
                })}
            </div>

            <div className="px-2 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Completion</span>
                    <span className="text-[10px] font-black text-emerald-600">70%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '70%' }}
                        className="h-full bg-emerald-500 rounded-full"
                    ></motion.div>
                </div>
            </div>

            <div className="mb-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-2xl border border-slate-50 group hover:border-emerald-100 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-black text-slate-800 leading-none mb-1 truncate ">{user?.name}</span>
                            <span className="text-[9px] font-bold text-slate-400 truncate max-w-[120px] uppercase tracking-tighter" title={user?.email}>
                                {user?.email}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Logout"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
