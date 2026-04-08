import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import {
    Bell,
    Calendar,
    FileText,
    CreditCard,
    CheckCircle2,
    Clock,
    Trash2,
    Settings,
    Shield,
    Info,
    AlertCircle,
    Check,
    BellOff,
    BellRing,
    Activity,
    Zap,
    CircleDot,
    Pill,
    ArrowRight,
    RefreshCw,
    Stethoscope,
    X,
    CheckCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = "http://localhost:5000/api";

const typeConfig = {
    reminder: {
        icon: Calendar,
        color: "text-blue-600",
        bg: "bg-blue-50",
        tag: "Reminder",
        tagColor: "text-blue-600 bg-blue-50 border-blue-100",
    },
    payment: {
        icon: CreditCard,
        color: "text-amber-600",
        bg: "bg-amber-50",
        tag: "Payment",
        tagColor: "text-amber-600 bg-amber-50 border-amber-100",
    },
    report: {
        icon: FileText,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        tag: "Report",
        tagColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    prescription: {
        icon: Pill,
        color: "text-rose-600",
        bg: "bg-rose-50",
        tag: "Prescription",
        tagColor: "text-rose-600 bg-rose-50 border-rose-100",
    },
    security: {
        icon: Shield,
        color: "text-violet-600",
        bg: "bg-violet-50",
        tag: "Security",
        tagColor: "text-violet-600 bg-violet-50 border-violet-100",
    },
    status: {
        icon: Stethoscope,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        tag: "Status",
        tagColor: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    info: {
        icon: Info,
        color: "text-sky-600",
        bg: "bg-sky-50",
        tag: "Info",
        tagColor: "text-sky-600 bg-sky-50 border-sky-100",
    },
};

const getConfig = (type) => typeConfig[type] || typeConfig.info;

const relativeTime = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const Toast = ({ msg, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-bold border ${
            type === "success"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-rose-600 text-white border-rose-500"
        }`}
    >
        {type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
        {msg}
        <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100"><X size={14} /></button>
    </motion.div>
);

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const authHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const fetchNotifications = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            else setRefreshing(true);
            const { data } = await axios.get(`${API}/notifications`, authHeaders());
            if (data.success) setNotifications(data.data);
        } catch (err) {
            if (!silent) showToast("Failed to load notifications", "error");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(() => fetchNotifications(true), 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markAsRead = async (id) => {
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
        try {
            await axios.put(`${API}/notifications/${id}/read`, {}, authHeaders());
        } catch {
            fetchNotifications(true);
        }
    };

    const markAllRead = async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        try {
            await axios.put(`${API}/notifications/read-all`, {}, authHeaders());
            showToast("All notifications marked as read");
        } catch {
            showToast("Failed to update notifications", "error");
            fetchNotifications(true);
        }
    };

    const deleteNotification = async (id) => {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        try {
            await axios.delete(`${API}/notifications/${id}`, authHeaders());
        } catch {
            fetchNotifications(true);
        }
    };

    const clearAll = async () => {
        if (!window.confirm("Clear all notifications?")) return;
        setNotifications([]);
        try {
            await axios.delete(`${API}/notifications`, authHeaders());
            showToast("All notifications cleared");
        } catch {
            showToast("Failed to clear notifications", "error");
            fetchNotifications(true);
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    const filteredNotifications = notifications.filter((n) => {
        if (activeTab === "unread") return !n.read;
        if (activeTab === "reminders") return n.type === "reminder";
        if (activeTab === "system") return n.type === "security" || n.type === "info" || n.type === "status";
        return true;
    });

    const stats = [
        { label: "Total", value: notifications.length, icon: Bell, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Unread", value: unreadCount, icon: BellRing, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Reminders", value: notifications.filter((n) => n.type === "reminder").length, icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Alerts", value: notifications.filter((n) => n.type === "security" || n.type === "status").length, icon: Shield, color: "text-violet-600", bg: "bg-violet-50" },
    ];

    const tabs = [
        { id: "all", label: "All" },
        { id: "unread", label: "Unread", badge: unreadCount },
        { id: "reminders", label: "Reminders" },
        { id: "system", label: "System" },
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 pb-8">
                    <div className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse" />)}
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3">
                        {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />)}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="font-sans space-y-6 pb-8">

                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                    <div className="relative px-8 py-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-emerald-50/30 to-emerald-50/60 pointer-events-none" />
                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                                        Notifications
                                    </span>
                                    {unreadCount > 0 && (
                                        <span className="flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                                            <CircleDot size={9} className="animate-pulse" />
                                            {unreadCount} unread
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-xl font-bold text-slate-800 tracking-tight">Your Alerts &amp; Updates</h1>
                                <p className="text-sm text-slate-500 font-medium mt-0.5">
                                    Real-time notifications from your appointments, prescriptions &amp; payments
                                </p>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => fetchNotifications(true)}
                                    disabled={refreshing}
                                    className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-100 transition-all disabled:opacity-50"
                                    title="Refresh"
                                >
                                    <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                                </button>
                                <button
                                    onClick={markAllRead}
                                    disabled={unreadCount === 0}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-100 hover:border-emerald-200 hover:text-emerald-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <CheckCheck size={15} /> Mark all read
                                </button>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearAll}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm border border-rose-100 hover:bg-rose-100 transition-all"
                                    >
                                        <Trash2 size={15} /> Clear all
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all"
                        >
                            <div className={`h-10 w-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                                <stat.icon size={18} />
                            </div>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                            <p className="text-xl font-black text-slate-800">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-1 p-4 border-b border-slate-50 flex-wrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    activeTab === tab.id
                                        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                }`}
                            >
                                {tab.label}
                                {tab.badge > 0 && (
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/30 text-white" : "bg-rose-500 text-white"}`}>
                                        {tab.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                        <div className="ml-auto text-[11px] text-slate-400 font-medium pr-1">
                            {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? "s" : ""}
                        </div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        <AnimatePresence mode="popLayout">
                            {filteredNotifications.length > 0 ? filteredNotifications.map((n, idx) => {
                                const cfg = getConfig(n.type);
                                const Icon = cfg.icon;
                                return (
                                    <motion.div
                                        key={n._id}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                        transition={{ delay: idx * 0.03 }}
                                        className={`flex items-start gap-4 px-6 py-4 transition-all group cursor-pointer ${
                                            n.read
                                                ? "hover:bg-slate-50/60"
                                                : "bg-emerald-50/20 hover:bg-emerald-50/40 border-l-2 border-l-emerald-400"
                                        }`}
                                        onClick={() => !n.read && markAsRead(n._id)}
                                    >
                                        <div className={`h-10 w-10 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                            <Icon size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h4 className={`text-sm font-bold ${n.read ? "text-slate-500" : "text-slate-800"}`}>
                                                    {n.title}
                                                </h4>
                                                <span className={`text-[9px] font-black uppercase tracking-wider border px-2 py-0.5 rounded-full ${cfg.tagColor}`}>
                                                    {cfg.tag}
                                                </span>
                                                {!n.read && (
                                                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                )}
                                            </div>
                                            <p className={`text-[12px] leading-relaxed font-medium ${n.read ? "text-slate-400" : "text-slate-500"} line-clamp-2`}>
                                                {n.message}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-2 text-[10px] font-semibold text-slate-400">
                                                <Clock size={11} />
                                                {relativeTime(n.createdAt)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                            {!n.read && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); markAsRead(n._id); }}
                                                    className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <CheckCircle2 size={14} />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }}
                                                className="h-8 w-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            }) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-16 text-center"
                                >
                                    <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <BellOff size={24} className="text-emerald-500" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 mb-1">You are all caught up!</p>
                                    <p className="text-xs text-slate-400 font-medium">
                                        {activeTab === "unread" ? "No unread notifications" : "No notifications in this category"}
                                    </p>
                                    {activeTab !== "all" && (
                                        <button
                                            onClick={() => setActiveTab("all")}
                                            className="mt-4 text-xs font-bold text-emerald-600 hover:underline"
                                        >
                                            View all notifications
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 opacity-10"><BellRing size={80} /></div>
                        <div className="relative z-10">
                            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                                <Zap size={18} />
                            </div>
                            <p className="text-sm font-bold mb-1">Enable Push Notifications</p>
                            <p className="text-[11px] text-emerald-100 leading-relaxed mb-4">
                                Get real-time alerts for appointments, reports, and payments even when you are away from the dashboard.
                            </p>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 rounded-xl font-bold text-xs hover:bg-emerald-50 transition-all">
                                Enable Now <ArrowRight size={13} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Activity size={16} className="text-emerald-400" />
                                <p className="text-sm font-bold">Notification Activity</p>
                            </div>
                            <div className="space-y-2.5">
                                {[
                                    { label: "Appointments", count: notifications.filter((n) => n.type === "reminder").length, color: "bg-blue-500" },
                                    { label: "Prescriptions", count: notifications.filter((n) => n.type === "prescription").length, color: "bg-rose-500" },
                                    { label: "Payments", count: notifications.filter((n) => n.type === "payment").length, color: "bg-amber-500" },
                                    { label: "Status Updates", count: notifications.filter((n) => n.type === "status").length, color: "bg-indigo-500" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${item.color} flex-shrink-0`} />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[11px] font-semibold text-slate-300">{item.label}</span>
                                                <span className="text-[10px] font-black text-slate-400">{item.count}</span>
                                            </div>
                                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${notifications.length ? (item.count / notifications.length) * 100 : 0}%` }}
                                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                                    className={`h-full ${item.color} rounded-full`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default Notifications;
