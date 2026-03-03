import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
    Bell,
    Calendar,
    FileText,
    CreditCard,
    CheckCircle2,
    Clock,
    MoreVertical,
    Trash2,
    Settings,
    Shield,
    Info,
    AlertCircle,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    const mockNotifications = [
        {
            id: 1,
            title: 'Appointment Reminder',
            message: 'Your appointment with Dr. Sarah Wilson is scheduled for tomorrow at 10:00 AM.',
            time: '2 hours ago',
            type: 'reminder',
            read: false,
            icon: Calendar,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            id: 2,
            title: 'Lab Report Ready',
            message: 'Your Complete Blood Count (CBC) report is now available in your Medical Vault.',
            time: '5 hours ago',
            type: 'report',
            read: false,
            icon: FileText,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            id: 3,
            title: 'Payment Successful',
            message: 'Payment of ₹800 for consultation with Dr. Bruce Banner has been confirmed.',
            time: '1 day ago',
            type: 'payment',
            read: true,
            icon: CreditCard,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        },
        {
            id: 4,
            title: 'Security Alert',
            message: 'Your account was accessed from a new device in New Delhi, India.',
            time: '2 days ago',
            type: 'security',
            read: true,
            icon: Shield,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
        {
            id: 5,
            title: 'Healthy Tip',
            message: 'Remember to stay hydrated! Drinking 8 glasses of water daily improves skin and energy levels.',
            time: '3 days ago',
            type: 'info',
            read: true,
            icon: Info,
            color: 'text-primary-600',
            bg: 'bg-primary-50'
        }
    ];

    useEffect(() => {
        setTimeout(() => {
            setNotifications(mockNotifications);
            setLoading(false);
        }, 800);
    }, []);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'unread') return !n.read;
        if (activeTab === 'reminders') return n.type === 'reminder';
        return true;
    });

    const tabs = [
        { id: 'all', name: 'All' },
        { id: 'unread', name: 'Unread' },
        { id: 'reminders', name: 'Reminders' },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notifications</h1>
                        <p className="text-slate-500 font-medium">Manage your alerts, reminders and system updates.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={markAllRead}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:border-primary-600 hover:text-primary-600 transition-all"
                        >
                            <Check size={18} /> Mark all read
                        </button>
                        <button className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all">
                            <Settings size={20} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-primary-600 text-white shadow-md shadow-primary-100'
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {tab.name}
                            {tab.id === 'unread' && notifications.filter(n => !n.read).length > 0 && (
                                <span className="ml-2 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                    {notifications.filter(n => !n.read).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-white rounded-[2rem] animate-pulse shadow-sm border border-slate-50"></div>
                        ))
                    ) : filteredNotifications.length > 0 ? (
                        <AnimatePresence>
                            {filteredNotifications.map((n, idx) => (
                                <motion.div
                                    key={n.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`relative bg-white p-6 rounded-[2rem] border transition-all group flex items-start gap-5 ${n.read ? 'border-slate-100 opacity-75' : 'border-primary-100 shadow-md shadow-primary-600/5'
                                        }`}
                                >
                                    {!n.read && (
                                        <div className="absolute top-6 right-6 h-2 w-2 bg-primary-600 rounded-full animate-pulse"></div>
                                    )}

                                    <div className={`h-12 w-12 shrink-0 rounded-2xl ${n.bg} ${n.color} flex items-center justify-center`}>
                                        <n.icon size={22} />
                                    </div>

                                    <div className="flex-1 pr-12">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className={`font-bold tracking-tight ${n.read ? 'text-slate-600' : 'text-slate-900'}`}>{n.title}</h4>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{n.time}</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                            {n.message}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!n.read && (
                                            <button
                                                onClick={() => markAsRead(n.id)}
                                                className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                                                title="Mark as read"
                                            >
                                                <CheckCircle2 size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(n.id)}
                                            className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="bg-white py-20 rounded-[3rem] border-2 border-dashed border-slate-100 text-center shadow-sm">
                            <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                                <Bell size={48} />
                            </div>
                            <h4 className="text-2xl font-bold text-slate-800 mb-2">You're all caught up!</h4>
                            <p className="text-slate-400 font-medium max-w-sm mx-auto italic">
                                “No new notifications found in this category. We'll let you know when something important arrives.”
                            </p>
                        </div>
                    )}
                </div>

                {/* Bottom Context Info */}
                <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-6">
                    <div className="h-14 w-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary-600">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h5 className="font-bold text-slate-800 mb-1">Stay Notified</h5>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                            Enable push notifications in your browser to get real-time updates about your appointments even when you're away from the dashboard.
                        </p>
                    </div>
                    <button className="ml-auto px-6 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                        Enable
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Notifications;
