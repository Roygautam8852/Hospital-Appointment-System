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
    Stethoscope,
    Shield
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
            { name: 'My History', path: '/patient/history', icon: Clock },
            { name: 'Medical Records', path: '/patient/records', icon: Shield },
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
        <div className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-100/80 pt-8 pb-10 px-6 flex flex-col z-50">
            <div className="mb-10 px-2 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center p-0.5 group-hover:rotate-6 transition-transform shadow-lg shadow-primary-200/50">
                        <div className="h-full w-full bg-white/10 rounded-[10px] flex items-center justify-center backdrop-blur-sm">
                            <Stethoscope className="h-4 w-4 text-white" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-black text-slate-900 leading-none tracking-tighter">MediCare</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Health Eco</span>
                    </div>
                </Link>

                <Link
                    to="/"
                    className="flex items-center justify-center w-8 h-8 text-slate-300 hover:text-primary-600 transition-all border border-transparent hover:border-slate-100 rounded-xl hover:bg-slate-50"
                    title="Back to Home"
                >
                    <ArrowLeft size={16} />
                </Link>
            </div>

            <div className="flex-1 space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-3 mb-4">Main Menu</p>
                {activeLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all relative group ${isActive
                                ? 'bg-primary-50 text-primary-600 font-bold shadow-sm shadow-primary-100/50'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <div className="flex items-center gap-3.5 relative z-10">
                                <span className={`${isActive ? 'text-primary-600 scale-110' : 'text-slate-400 group-hover:text-slate-600'} transition-all`}><Icon size={18} /></span>
                                <span className={`text-[15px] tracking-tight ${isActive ? 'font-extrabold' : 'font-semibold'}`}>{link.name}</span>
                            </div>
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="h-6 w-1 bg-primary-600 rounded-full absolute left-0"
                                />
                            )}
                            {isActive && <ChevronRight size={14} className="opacity-50" />}
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto pb-8 border-t border-slate-50 pt-8">
                <div className="px-2 mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Score</span>
                        <span className="text-[11px] font-black text-emerald-600">70%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '70%' }}
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                        ></motion.div>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[.8rem] p-3 flex items-center justify-between group hover:shadow-2xl hover:shadow-slate-900/20 transition-all border border-white/5">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg overflow-hidden shadow-lg flex-shrink-0 bg-white p-0.5 border border-white/10 group-hover:scale-105 transition-transform">
                            <img
                                src={user?.profileImage && user?.profileImage !== 'default-avatar.png'
                                    ? (user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000/${user.profileImage}`)
                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=10b981&color=fff&bold=true`}
                                alt={user?.name}
                                className="h-full w-full object-cover rounded-md"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=10b981&color=fff&bold=true`;
                                }}
                            />
                        </div>
                        <div className="flex flex-col min-w-0 pr-1">
                            <span className="text-[10px] font-black text-white leading-none mb-0.5 truncate">{user?.name}</span>
                            <span className="text-[8px] font-bold text-slate-500 truncate max-w-[100px]">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="h-9 w-9 flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-white/5 rounded-xl transition-all active:scale-90"
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
