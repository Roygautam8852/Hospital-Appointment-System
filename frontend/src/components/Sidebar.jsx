import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    LayoutDashboard, Calendar, User, FileText, Bell,
    Settings, LogOut, Clock, Users, DollarSign, Stethoscope,
    Shield, History, ChevronRight, ArrowLeft, HeartPulse,
    UserPlus, Heart, Activity, Building2, Send
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";

const Sidebar = ({ role }) => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const isAdmin = role === 'admin';
    const isDoctor = role === 'doctor';
    const isPatient = role === 'patient';
    const isDark = isAdmin || isDoctor || isPatient;

    useEffect(() => {
        if (!user || isAdmin) return;
        const fetchUnread = async () => {
            try {
                const token = localStorage.getItem("token");
                const { data } = await axios.get("http://localhost:5000/api/notifications/unread-count", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (data.success) setUnreadCount(data.count);
            } catch (_) { }
        };
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000);
        return () => clearInterval(interval);
    }, [user, isAdmin]);

    const links = {
        patient: [
            { name: "Dashboard",        path: "/patient/dashboard",      icon: LayoutDashboard, section: null },
            { name: "Book Appointment",  path: "/patient/book",           icon: Calendar,        section: "My Care" },
            { name: "My History",        path: "/patient/history",        icon: History,         section: null },
            { name: "Medical Records",   path: "/patient/records",        icon: Shield,          section: null },
            { name: "Notifications",     path: "/patient/notifications",  icon: Bell,            section: null },
            { name: "Profile",           path: "/patient/profile",        icon: User,            section: "Account" },
        ],
        doctor: [
            { name: "Dashboard",     path: "/doctor/dashboard",     icon: LayoutDashboard, section: null },
            { name: "Appointments",  path: "/doctor/appointments",  icon: Calendar,        section: "Practice" },
            { name: "My Patients",   path: "/doctor/patients",      icon: Users,           section: null },
            { name: "Medical Files", path: "/doctor/medical-files", icon: FileText,        section: null },
            { name: "Profile",       path: "/doctor/profile",       icon: User,            section: "Account" },
            { name: "Settings",      path: "/doctor/settings",      icon: Settings,        section: null },
        ],


        admin: [
            { name: "Overview", path: "/admin/dashboard", icon: LayoutDashboard, section: null },
            { name: "Doctors", path: "/admin/doctors", icon: Stethoscope, section: "Management" },
            { name: "Patients", path: "/admin/patients", icon: Users, section: null },
            { name: "Appointments", path: "/admin/appointments", icon: Calendar, section: null },
            { name: "Services", path: "/admin/services", icon: Heart, section: null },
            { name: "Revenue", path: "/admin/revenue", icon: DollarSign, section: "Analytics" },
            { name: "Settings", path: "/admin/settings", icon: Settings, section: "System" },
        ],
    };

    const activeLinks = links[role] || [];
    const roleColor = { patient: "bg-emerald-500", doctor: "bg-blue-500", admin: "bg-emerald-500" }[role] || "bg-slate-500";
    const roleBadge = { patient: "Patient", doctor: "Doctor", admin: "Administrator" }[role] || "User";

    const sidebarBg = '#0e1120';
    const borderColor = 'rgba(255,255,255,0.05)';
    const activeAccent = isDoctor ? '#3b82f6' : '#10b981';
    const activeBg = isDoctor ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)';
    const activeText = isDoctor ? '#93c5fd' : '#6ee7b7';
    const logoAccent = isDoctor ? '#3b82f6' : '#10b981';

    // Group admin links by section
    const renderAdminLinks = () => {
        let lastSection = undefined;
        return activeLinks.map((link, idx) => {
            const showSection = link.section !== undefined && link.section !== lastSection;
            if (link.section !== undefined) lastSection = link.section;
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
                <div key={link.path}>
                    {showSection && link.section && (
                        <p style={{
                            color: 'rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 800,
                            textTransform: 'uppercase', letterSpacing: '0.18em',
                            padding: '16px 14px 6px', margin: 0
                        }}>{link.section}</p>
                    )}
                    <Link to={link.path}
                        style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}>
                        <div style={{
                            position: 'relative', display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 12px', borderRadius: 12, transition: 'all 0.15s',
                            background: isActive ? activeBg : 'transparent',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                        >
                            {/* Active bar */}
                            {isActive && (
                                <motion.div layoutId={`active-bar-${role}`}
                                    style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, background: activeAccent, borderRadius: 4 }}
                                />
                            )}
                            {/* Icon */}
                            <div style={{
                                height: 32, width: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s',
                                background: isActive ? `${activeAccent}25` : 'rgba(255,255,255,0.04)',
                                color: isActive ? activeText : 'rgba(255,255,255,0.35)',
                            }}>
                                <Icon size={15} />
                            </div>
                            <span style={{
                                fontSize: 13, fontWeight: isActive ? 700 : 600, flex: 1, letterSpacing: '-0.01em',
                                color: isActive ? activeText : 'rgba(255,255,255,0.45)',
                                transition: 'color 0.15s'
                            }}>
                                {link.name}
                            </span>
                            {isActive && (
                                <ChevronRight size={12} style={{ color: activeAccent, opacity: 0.7 }} />
                            )}
                        </div>
                    </Link>
                </div>
            );
        });
    };

    const renderStandardLinks = () => activeLinks.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.path;
        return (
            <Link key={link.path} to={link.path}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${isActive ? "bg-emerald-500/10 text-emerald-400" : "text-slate-400 hover:text-white hover:bg-white/[0.05]"}`}>
                {isActive && (
                    <motion.div layoutId="active-bar"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-emerald-500 rounded-full"
                    />
                )}
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-white/[0.04] text-slate-500 group-hover:bg-white/[0.08] group-hover:text-slate-300"}`}>
                    <Icon size={15} />
                </div>
                <span className={`text-[13px] font-semibold flex-1 tracking-tight ${isActive ? "font-bold" : ""}`}>{link.name}</span>
                {link.name === "Notifications" && unreadCount > 0 && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-rose-500 text-white min-w-[18px] text-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
                {isActive && <ChevronRight size={13} className="text-emerald-500 opacity-60" />}
            </Link>
        );
    });

    return (
        <div style={{
            width: 240, height: '100vh', position: 'fixed', left: 0, top: 0,
            display: 'flex', flexDirection: 'column', zIndex: 50,
            background: sidebarBg,
            borderRight: `1px solid ${borderColor}`
        }}>
            {/* Logo */}
            <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${borderColor}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            height: 36, width: 36, borderRadius: 11, flexShrink: 0,
                            background: `linear-gradient(135deg, ${logoAccent}, ${isAdmin ? '#4f46e5' : isDoctor ? '#1d4ed8' : '#059669'})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: `0 6px 16px ${logoAccent}40`
                        }}>
                            {isAdmin ? <Building2 size={17} color="white" /> : isDoctor ? <Stethoscope size={17} color="white" /> : <HeartPulse size={17} color="white" />}
                        </div>
                        <div>
                            <p style={{ color: 'white', fontSize: 14, fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>
                                {isAdmin ? 'Admin Portal' : isDoctor ? 'Doctor Portal' : 'Patient Portal'}
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                {isAdmin ? 'Hospital Management' : isDoctor ? 'Medical Staff' : 'Healthcare'}
                            </p>
                        </div>
                    </Link>
                    <Link to="/" title="Back to Home"
                        style={{ height: 28, width: 28, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', flexShrink: 0 }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    >
                        <ArrowLeft size={13} />
                    </Link>
                </div>
            </div>

            {/* Status Badge */}
            <div style={{ padding: '10px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: isDoctor ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.08)', border: `1px solid ${isDoctor ? 'rgba(59,130,246,0.2)' : 'rgba(16,185,129,0.18)'}`, borderRadius: 9 }}>
                    <div style={{ height: 6, width: 6, borderRadius: '50%', background: activeAccent, boxShadow: `0 0 5px ${activeAccent}`, flexShrink: 0 }} />
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{isDoctor ? 'On Duty' : isAdmin ? 'System Active' : 'Active Session'}</span>
                </div>
            </div>

            {/* Navigation */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
                {renderAdminLinks()}
            </div>

            {/* Footer – User Card */}
            <div style={{ padding: '12px 10px', borderTop: `1px solid ${borderColor}` }}>
                <div style={{
                    background: 'rgba(255,255,255,0.03)', border: `1px solid ${borderColor}`,
                    borderRadius: 12, padding: '10px 12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {/* Avatar */}
                        <div style={{ height: 34, width: 34, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: `2px solid ${activeAccent}40` }}>
                            <img
                                src={user?.profileImage && user?.profileImage !== "default-avatar.png"
                                    ? user.profileImage.startsWith("http") ? user.profileImage : `http://localhost:5000/${user.profileImage}`
                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin")}&background=${isAdmin ? '7c3aed' : '10b981'}&color=fff&bold=true`}
                                alt={user?.name}
                                style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                                onError={e => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=${isAdmin ? '7c3aed' : '10b981'}&color=fff&bold=true`; }}
                            />
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: 'white', fontSize: 12, fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.name || 'User'}
                            </p>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                padding: '1px 7px', borderRadius: 6, fontSize: 9, fontWeight: 800,
                                textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 2,
                                background: isAdmin ? 'rgba(16,185,129,0.25)' : role === 'doctor' ? 'rgba(59,130,246,0.25)' : 'rgba(16,185,129,0.25)',
                                color: isAdmin ? '#6ee7b7' : role === 'doctor' ? '#93c5fd' : '#6ee7b7'
                            }}>
                                {roleBadge}
                            </span>
                        </div>
                        {/* Logout */}
                        <button onClick={logout} title="Log Out"
                            style={{ height: 28, width: 28, borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}>
                            <LogOut size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
