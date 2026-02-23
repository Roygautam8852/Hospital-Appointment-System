import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    User,
    FileText,
    Bell,
    Settings,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ role }) => {
    const location = useLocation();
    const { logout } = useAuth();

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
        <div className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 pt-20 px-4 flex flex-col">
            <div className="flex-1 space-y-2">
                {activeLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all ${isActive
                                    ? 'bg-primary-50 text-primary-600 font-bold'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={20} />
                                <span>{link.name}</span>
                            </div>
                            {isActive && <ChevronRight size={16} />}
                        </Link>
                    );
                })}
            </div>

            <div className="mb-6 pt-6 border-t border-slate-100">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

// Supporting icons not in main imports
const Clock = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const Users = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const DollarSign = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;

export default Sidebar;
