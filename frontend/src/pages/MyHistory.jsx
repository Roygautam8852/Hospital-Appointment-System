import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
    Search,
    Filter,
    Download,
    Calendar,
    Clock,
    User,
    CheckCircle2,
    AlertCircle,
    FileText,
    ArrowUpRight,
    History,
    Phone,
    MapPin,
    ShoppingCart,
    TrendingUp,
    Pill,
    Heart,
    RefreshCw,
    ChevronDown,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MyHistory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date-desc"); // date-asc, date-desc, amount-asc, amount-desc
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [dateRange, setDateRange] = useState({ from: "", to: "" });
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Helper function to check if appointment is expired
    const isAppointmentExpired = (appointmentDate) => {
        const now = new Date();
        const apptDate = new Date(appointmentDate);
        return apptDate < now;
    };

    // Helper function to get appointment status including expired
    const getAppointmentStatus = (apt) => {
        if (isAppointmentExpired(apt.date) && apt.status !== 'completed' && apt.status !== 'cancelled') {
            return 'expired';
        }
        return apt.status;
    };

    // Fetch appointments with real-time updates
    const fetchAppointments = async () => {
        try {
            setError(null);
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/appointments", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                setAppointments(res.data.data || []);
            }
        } catch (err) {
            setError("Failed to load appointments. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAppointments();
            // Auto-refresh every 30 seconds
            const interval = setInterval(fetchAppointments, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    // Advanced filtering logic
    const getFilteredAppointments = () => {
        let filtered = appointments;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter((apt) =>
                apt.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                apt.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                apt.reason?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((apt) => apt.status === statusFilter);
        }

        // Date range filter
        if (dateRange.from) {
            filtered = filtered.filter((apt) =>
                new Date(apt.date) >= new Date(dateRange.from)
            );
        }
        if (dateRange.to) {
            filtered = filtered.filter((apt) =>
                new Date(apt.date) <= new Date(dateRange.to)
            );
        }

        // Sorting
        const sorted = [...filtered];
        switch (sortBy) {
            case "date-asc":
                sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case "date-desc":
                sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case "amount-asc":
                sorted.sort((a, b) => (a.amount || 0) - (b.amount || 0));
                break;
            case "amount-desc":
                sorted.sort((a, b) => (b.amount || 0) - (a.amount || 0));
                break;
            default:
                break;
        }

        return sorted;
    };

    const filteredAppointments = getFilteredAppointments();

    // Pagination
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

    const totalSpent = appointments
        .filter((a) => a.paymentStatus === "paid")
        .reduce((sum, a) => sum + (a.amount || 0), 0);

    const stats = [
        {
            label: "Total Visits",
            value: appointments.length,
            icon: Calendar,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            label: "Completed",
            value: appointments.filter((a) => a.status === "completed").length,
            icon: CheckCircle2,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Total Spent",
            value: `₹${totalSpent.toLocaleString("en-IN")}`,
            icon: ShoppingCart,
            color: "text-violet-600",
            bg: "bg-violet-50",
        },
        {
            label: "Doctors Met",
            value: [...new Set(appointments.map((a) => a.doctor?._id))].length,
            icon: User,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
    ];

    const exportToCSV = () => {
        const headers = ["Doctor", "Specialty", "Date", "Time", "Status", "Amount", "Reason"];
        const data = filteredAppointments.map((apt) => [
            apt.doctor?.name || "N/A",
            apt.department || apt.doctor?.specialization || "N/A",
            new Date(apt.date).toLocaleDateString(),
            apt.time,
            apt.status,
            apt.amount || "N/A",
            apt.reason,
        ]);

        const csvContent = [headers, ...data].map((e) => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `medical_history_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
    };

    return (
        <DashboardLayout>
            <div className="font-sans space-y-6 pb-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                    <div className="relative px-8 py-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-emerald-50/30 to-emerald-50/60 pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                                        Medical History
                                    </span>
                                </div>
                                <h1 className="text-xl font-bold text-slate-800 tracking-tight">Your Consultations</h1>
                                <p className="text-sm text-slate-500 font-medium mt-0.5">
                                    View all your past appointments, payments, and medical visits
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={fetchAppointments}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-100 hover:border-emerald-200 hover:text-emerald-600 transition-all"
                                >
                                    <RefreshCw size={15} /> Refresh
                                </button>
                                <button
                                    onClick={exportToCSV}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-100 hover:border-emerald-200 hover:text-emerald-600 transition-all"
                                >
                                    <Download size={15} /> Export
                                </button>
                                <button
                                    onClick={() => navigate("/patient/book")}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-sm shadow-emerald-200 hover:bg-emerald-700 transition-all"
                                >
                                    <Calendar size={15} /> New Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Row */}
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

                {/* Search & Filters */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <input
                                type="text"
                                placeholder="Search doctor, department, reason..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
                            <Filter size={14} className="text-slate-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs font-bold text-slate-600 cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className="px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm border border-emerald-200 hover:bg-emerald-100 transition-all flex items-center gap-2"
                        >
                            <ChevronDown size={14} style={{ transform: showAdvancedFilters ? "rotate(180deg)" : "rotate(0deg)" }} />
                            Filters
                        </button>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-200 outline-none cursor-pointer"
                        >
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="amount-desc">Highest Amount</option>
                            <option value="amount-asc">Lowest Amount</option>
                        </select>
                    </div>

                    {/* Advanced Filters */}
                    {showAdvancedFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3"
                        >
                            <div>
                                <label className="text-xs font-bold text-slate-600 block mb-1">From Date</label>
                                <input
                                    type="date"
                                    value={dateRange.from}
                                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600 block mb-1">To Date</label>
                                <input
                                    type="date"
                                    value={dateRange.to}
                                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                            <button
                                onClick={() => setDateRange({ from: "", to: "" })}
                                className="sm:col-span-2 mt-6 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all"
                            >
                                Clear Filters
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* Appointments List */}
                <div className="space-y-3">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
                        >
                            <AlertCircle className="text-red-600" size={18} />
                            <span className="text-sm font-medium text-red-600">{error}</span>
                            <button
                                onClick={fetchAppointments}
                                className="ml-auto px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded text-xs font-bold transition-all"
                            >
                                Retry
                            </button>
                        </motion.div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block">
                                <div className="h-12 w-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                            </div>
                            <p className="text-sm text-slate-500 font-medium mt-3">Loading your history...</p>
                        </div>
                    ) : paginatedAppointments.length > 0 ? (
                        <>
                            <AnimatePresence>
                                {paginatedAppointments.map((apt, idx) => (
                                    <motion.div
                                        key={apt._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => {
                                            setSelectedAppointment(apt);
                                            setShowDetailModal(true);
                                        }}
                                        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-emerald-100 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Doctor Avatar */}
                                            <div className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 border-2 border-emerald-100">
                                                <img
                                                    src={
                                                        apt.doctor?.profileImage &&
                                                        apt.doctor.profileImage !== "default-avatar.png"
                                                            ? apt.doctor.profileImage.startsWith("http")
                                                                ? apt.doctor.profileImage
                                                                : `http://localhost:5000/${apt.doctor.profileImage}`
                                                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                  apt.doctor?.name || "Doctor"
                                                              )}&background=10b981&color=fff&bold=true`
                                                    }
                                                    alt={apt.doctor?.name}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                            apt.doctor?.name || "Doctor"
                                                        )}&background=10b981&color=fff&bold=true`;
                                                    }}
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-slate-800 text-sm">{apt.doctor?.name}</h4>
                                                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                                        {apt.department || apt.doctor?.specialization}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 italic line-clamp-1 mb-2">"{apt.reason}"</p>
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
                                                        <Calendar size={12} className="text-slate-400" />
                                                        {new Date(apt.date).toLocaleDateString("en-GB", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
                                                        <Clock size={12} className="text-slate-400" />
                                                        {apt.time}
                                                    </div>
                                                    {apt.amount && (
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                                            ₹{apt.amount}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <StatusBadge status={getAppointmentStatus(apt)} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <button
                                        onClick={() => setPage(Math.max(1, page - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                                                page === p
                                                    ? "bg-emerald-600 text-white"
                                                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                                        disabled={page === totalPages}
                                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-12 text-center">
                            <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <History size={28} className="text-emerald-600" />
                            </div>
                            <p className="text-sm font-bold text-slate-600 mb-1">No appointments found</p>
                            <p className="text-xs text-slate-500 font-medium mb-6">
                                Try adjusting your filters or book your first appointment
                            </p>
                            <button
                                onClick={() => navigate("/patient/book")}
                                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-sm shadow-emerald-200 hover:bg-emerald-700 transition-all"
                            >
                                Book Appointment
                            </button>
                        </div>
                    )}
                </div>

                {/* Insights Cards */}
                {filteredAppointments.length > 0 && (() => {
                    // Calculate most visited doctor
                    const doctorCounts = {};
                    appointments.forEach((apt) => {
                        if (apt.doctor?._id) {
                            doctorCounts[apt.doctor._id] = (doctorCounts[apt.doctor._id] || 0) + 1;
                        }
                    });
                    const mostVisitedDoctorId = Object.entries(doctorCounts).sort(([, a], [, b]) => b - a)[0]?.[0];
                    const mostVisitedDoctor = appointments.find((a) => a.doctor?._id === mostVisitedDoctorId);
                    const mostVisitedCount = doctorCounts[mostVisitedDoctorId] || 0;

                    return (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                        {/* Top Doctor */}
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-200/50">
                            <div className="flex items-start justify-between mb-3">
                                <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Heart size={18} />
                                </div>
                            </div>
                            <p className="text-[11px] font-bold opacity-75 uppercase tracking-wider mb-1">Most Visited</p>
                            <p className="text-sm font-bold mb-3">{mostVisitedDoctor?.doctor?.name || "Your Doctor"}</p>
                            <p className="text-[10px] opacity-80 font-medium">{mostVisitedCount} visits</p>
                        </div>

                        {/* Total Spent */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <div className="h-10 w-10 bg-violet-50 rounded-xl flex items-center justify-center mb-3">
                                <ShoppingCart size={18} className="text-violet-600" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Spent</p>
                            <p className="text-xl font-black text-slate-800">₹{totalSpent.toLocaleString("en-IN")}</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-2">on {appointments.length} consultations</p>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg shadow-slate-900/20">
                            <div className="h-10 w-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-3">
                                <TrendingUp size={18} className="text-emerald-400" />
                            </div>
                            <p className="text-[11px] font-bold opacity-75 uppercase tracking-wider mb-3">Health Status</p>
                            <button
                                onClick={() => navigate("/patient/book")}
                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all"
                            >
                                Book Next Appointment
                            </button>
                        </div>
                    </div>
                    );
                })()}

                {/* Appointment Detail Modal */}
                <AnimatePresence>
                    {showDetailModal && selectedAppointment && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            >
                                {/* Header */}
                                <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 flex items-center justify-between">
                                    <h2 className="text-xl font-bold">Appointment Details</h2>
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Doctor Info */}
                                    <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
                                        <img
                                            src={
                                                selectedAppointment.doctor?.profileImage?.startsWith("http")
                                                    ? selectedAppointment.doctor.profileImage
                                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                          selectedAppointment.doctor?.name || "Doctor"
                                                      )}&background=10b981&color=fff&bold=true`
                                            }
                                            alt={selectedAppointment.doctor?.name}
                                            className="h-20 w-20 rounded-xl object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-800 mb-1">{selectedAppointment.doctor?.name}</h3>
                                            <p className="text-sm text-emerald-600 font-bold mb-2">{selectedAppointment.department || selectedAppointment.doctor?.specialization}</p>
                                            {selectedAppointment.doctor?.phone && (
                                                <p className="text-sm text-slate-600 flex items-center gap-2">
                                                    <Phone size={14} />
                                                    {selectedAppointment.doctor.phone}
                                                </p>
                                            )}
                                        </div>
                                        <StatusBadge status={getAppointmentStatus(selectedAppointment)} />
                                    </div>

                                    {/* Appointment Details */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Date</p>
                                            <p className="text-sm font-bold text-slate-800">
                                                {new Date(selectedAppointment.date).toLocaleDateString("en-GB", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Time</p>
                                            <p className="text-sm font-bold text-slate-800">{selectedAppointment.time}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Reason</p>
                                            <p className="text-sm font-bold text-slate-800">{selectedAppointment.reason}</p>
                                        </div>
                                        {selectedAppointment.amount && (
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Amount</p>
                                                <p className="text-sm font-bold text-emerald-600">₹{selectedAppointment.amount}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Payment Status */}
                                    {selectedAppointment.paymentStatus && (
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Payment Status</p>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`h-2 w-2 rounded-full ${
                                                        selectedAppointment.paymentStatus === "paid"
                                                            ? "bg-emerald-600"
                                                            : "bg-amber-600"
                                                    }`}
                                                />
                                                <span className="text-sm font-bold capitalize text-slate-700">{selectedAppointment.paymentStatus}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Notes */}
                                    {selectedAppointment.notes && (
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Notes</p>
                                            <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{selectedAppointment.notes}</p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                                        <button
                                            onClick={() => {
                                                exportToCSV();
                                                setShowDetailModal(false);
                                            }}
                                            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-200 transition-all"
                                        >
                                            Export
                                        </button>
                                        <button
                                            onClick={() => setShowDetailModal(false)}
                                            className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 transition-all"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        pending: "bg-amber-50 text-amber-600 border-amber-100",
        confirmed: "bg-blue-50 text-blue-600 border-blue-100",
        completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
        cancelled: "bg-rose-50 text-rose-600 border-rose-100",
        expired: "bg-slate-50 text-slate-600 border-slate-100",
    };

    const icons = {
        pending: AlertCircle,
        confirmed: CheckCircle2,
        completed: CheckCircle2,
        cancelled: AlertCircle,
        expired: AlertCircle,
    };

    const Icon = icons[status] || AlertCircle;

    // Map status to display text
    const displayText = {
        expired: 'Expired',
        pending: 'Pending',
        confirmed: 'Confirmed',
        completed: 'Completed',
        cancelled: 'Cancelled'
    };

    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold capitalize border ${styles[status]}`}
        >
            <Icon size={12} />
            {displayText[status] || status}
        </span>
    );
};

export default MyHistory;
