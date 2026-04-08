import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
    Search,
    Filter,
    FileText,
    Download,
    Eye,
    Upload,
    Clock,
    User,
    Calendar,
    Stethoscope,
    Shield,
    CheckCircle2,
    Lock,
    Activity,
    FlaskConical,
    ScanLine,
    Pill,
    ChevronRight,
    Plus,
    AlertCircle,
    TrendingUp,
    Zap,
    HardDrive,
    RefreshCw,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MedicalRecords = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [activityLog, setActivityLog] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        type: "prescription",
        title: "",
        category: "General",
        description: "",
        medicines: [{ name: "", dosage: "", duration: "" }],
    });

    // Fetch medical records
    const fetchRecords = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/medical-records", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                setRecords(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching records:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch activity log
    const fetchActivityLog = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/medical-records/activity/log", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                setActivityLog(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching activity log:", err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRecords();
            fetchActivityLog();

            // Real-time polling every 30 seconds
            const interval = setInterval(() => {
                fetchRecords();
                fetchActivityLog();
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [user]);

    // Handle form submission
    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("No authentication token found. Please login again.");
                return;
            }

            const payload = {
                ...uploadForm,
                patient: user._id,  // Changed from user.id to user._id
                medicines: uploadForm.type === "prescription" ? uploadForm.medicines : undefined,
            };

            await axios.post("http://localhost:5000/api/medical-records", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setShowUploadModal(false);
            setUploadForm({
                type: "prescription",
                title: "",
                category: "General",
                description: "",
                medicines: [{ name: "", dosage: "", duration: "" }],
            });

            // Refresh records
            fetchRecords();
            fetchActivityLog();
        } catch (err) {
            alert("Error uploading record: " + err.message);
        }
    };

    const filteredRecords = records.filter((rec) => {
        const matchesTab = activeTab === "all" || rec.type === activeTab;
        const matchesSearch =
            rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (rec.doctor?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            rec.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const stats = [
        {
            label: "Total Records",
            value: records.length,
            icon: FileText,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            label: "Prescriptions",
            value: records.filter((r) => r.type === "prescription").length,
            icon: Pill,
            color: "text-violet-600",
            bg: "bg-violet-50",
        },
        {
            label: "Lab Reports",
            value: records.filter((r) => r.type === "lab_report").length,
            icon: FlaskConical,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Imaging",
            value: records.filter((r) => r.type === "imaging").length,
            icon: ScanLine,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
    ];

    const categories = [
        { id: "all", label: "All Records", icon: FileText, count: records.length },
        {
            id: "prescription",
            label: "Prescriptions",
            icon: Pill,
            count: records.filter((r) => r.type === "prescription").length,
        },
        {
            id: "lab_report",
            label: "Lab Reports",
            icon: FlaskConical,
            count: records.filter((r) => r.type === "lab_report").length,
        },
        { id: "imaging", label: "Imaging", icon: ScanLine, count: records.filter((r) => r.type === "imaging").length },
    ];

    const typeConfig = {
        prescription: { color: "bg-violet-500", light: "bg-violet-50", text: "text-violet-600", label: "Prescription" },
        lab_report: { color: "bg-blue-500", light: "bg-blue-50", text: "text-blue-600", label: "Lab Report" },
        imaging: { color: "bg-amber-500", light: "bg-amber-50", text: "text-amber-600", label: "Imaging" },
        other: { color: "bg-slate-500", light: "bg-slate-50", text: "text-slate-600", label: "Document" },
    };

    return (
        <DashboardLayout>
            <div className="font-sans space-y-6 pb-8">
                {/* Header Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                    <div className="relative px-8 py-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-emerald-50/30 to-emerald-50/60 pointer-events-none" />
                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                                        Medical Records
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                                        <Lock size={9} />
                                        AES-256 Encrypted
                                    </span>
                                </div>
                                <h1 className="text-xl font-bold text-slate-800 tracking-tight">Your Health Vault</h1>
                                <p className="text-sm text-slate-500 font-medium mt-0.5">
                                    Securely store and access your prescriptions, lab reports, and imaging records
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        fetchRecords();
                                        fetchActivityLog();
                                    }}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-100 hover:border-emerald-200 hover:text-emerald-600 transition-all"
                                >
                                    <RefreshCw size={15} /> Sync
                                </button>
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-sm shadow-emerald-200 hover:bg-emerald-700 transition-all"
                                >
                                    <Upload size={15} /> Upload Record
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

                {/* Main Content */}
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Category Nav */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 mb-3">Repository</p>
                            <div className="space-y-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveTab(cat.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${
                                            activeTab === cat.id
                                                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                                                : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <cat.icon size={15} className={activeTab === cat.id ? "text-white" : "text-slate-400"} />
                                            <span className="text-xs font-bold">{cat.label}</span>
                                        </div>
                                        <span
                                            className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                                                activeTab === cat.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                                            }`}
                                        >
                                            {cat.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Storage */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs font-bold text-slate-700">Vault Capacity</p>
                                <HardDrive size={15} className="text-slate-400" />
                            </div>
                            <div className="text-center bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                                <p className="text-2xl font-black text-slate-800">2.4<span className="text-sm font-bold text-slate-400"> GB</span></p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Used Storage</p>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "48%" }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium text-center mt-2">48% of 5 GB quota</p>
                        </div>

                        {/* Security Badge */}
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white relative overflow-hidden">
                            <div className="absolute -top-4 -right-4 opacity-10">
                                <Shield size={80} />
                            </div>
                            <div className="relative z-10">
                                <div className="h-9 w-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                                    <Lock size={16} />
                                </div>
                                <p className="text-xs font-black mb-1">Active Protocol</p>
                                <p className="text-[10px] text-emerald-100 leading-relaxed mb-4">
                                    All documents secured via AES-256 cryptographic standards.
                                </p>
                                <div className="flex items-center gap-1.5 text-[9px] font-black bg-white/20 px-2.5 py-1 rounded-full w-fit">
                                    <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
                                    ISO 27001 COMPLIANT
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Area */}
                    <div className="lg:col-span-3 space-y-5">
                        {/* Search */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by physician, specialization, or keyword..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-32 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg">
                                    {filteredRecords.length} Files
                                </div>
                            </div>
                        </div>

                        {/* Records Grid */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            {loading ? (
                                [1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-44 bg-slate-50 rounded-2xl animate-pulse border border-slate-100" />
                                ))
                            ) : filteredRecords.length > 0 ? (
                                <AnimatePresence>
                                    {filteredRecords.map((rec, idx) => {
                                        const cfg = typeConfig[rec.type] || typeConfig.other;
                                        return (
                                            <motion.div
                                                key={rec._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-emerald-100 transition-all group"
                                            >
                                                {/* Top Row */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className={`h-11 w-11 ${cfg.color} rounded-xl flex items-center justify-center shadow-sm flex-shrink-0`}>
                                                        <FileText size={20} className="text-white" />
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="text-[9px] font-bold text-slate-400">{rec.fileSize}</span>
                                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full">
                                                            <div
                                                                className={`h-1.5 w-1.5 rounded-full ${
                                                                    rec.security === "Encrypted" ? "bg-violet-500" : "bg-emerald-500 animate-pulse"
                                                                }`}
                                                            />
                                                            <span className="text-[9px] font-black text-slate-500">{rec.security}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Title & Type */}
                                                <div className="mb-3">
                                                    <span className={`text-[9px] font-black uppercase tracking-wider ${cfg.text} ${cfg.light} px-2 py-0.5 rounded-md`}>
                                                        {cfg.label}
                                                    </span>
                                                    <h4 className="font-bold text-slate-800 text-sm mt-1.5 group-hover:text-emerald-600 transition-colors line-clamp-1">
                                                        {rec.title}
                                                    </h4>
                                                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{rec.description}</p>
                                                </div>

                                                {/* Meta */}
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                                                        <User size={11} className="text-slate-400" />
                                                        <span className="truncate max-w-[120px]">{rec.doctor?.name || "MediCare"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                                                        <Calendar size={11} />
                                                        {new Date(rec.createdAt).toLocaleDateString("en-GB", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                                                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-600 rounded-xl transition-all font-bold text-[11px] border border-slate-100 hover:border-emerald-600">
                                                        <Eye size={13} /> View
                                                    </button>
                                                    <button className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 text-white rounded-xl transition-all font-bold text-[11px] hover:bg-emerald-600">
                                                        <Download size={13} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            ) : (
                                <div className="sm:col-span-2 bg-white rounded-2xl border border-emerald-100 shadow-sm p-12 text-center">
                                    <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Shield size={24} className="text-emerald-600" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 mb-1">No records found</p>
                                    <p className="text-xs text-slate-400 font-medium mb-5">Try adjusting your search or upload a new record</p>
                                    <button
                                        onClick={() => setShowUploadModal(true)}
                                        className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all"
                                    >
                                        Upload Record
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Activity Log */}
                        {activityLog.length > 0 && (
                            <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-transparent pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Activity size={16} className="text-emerald-400" />
                                            <p className="text-sm font-bold">Access Log</p>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400">Last 7 days</span>
                                    </div>
                                    <div className="space-y-2">
                                        {activityLog.map((item, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between px-3.5 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all group/item cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                                        <FileText size={14} className="text-emerald-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-semibold text-slate-200">{item.action}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[9px] font-bold text-slate-500">{item.time}</span>
                                                            <span className="text-[9px] font-black text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">
                                                                {item.tag}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={14} className="text-slate-600 group-hover/item:text-slate-300 transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {showUploadModal && (
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
                            className="bg-white rounded-2xl max-w-md w-full p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Upload Medical Record</h3>
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleUploadSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Record Type</label>
                                    <select
                                        value={uploadForm.type}
                                        onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    >
                                        <option value="prescription">Prescription</option>
                                        <option value="lab_report">Lab Report</option>
                                        <option value="imaging">Imaging</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={uploadForm.title}
                                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                        placeholder="Record title"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                                    <select
                                        value={uploadForm.category}
                                        onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    >
                                        <option value="General">General</option>
                                        <option value="Cardiology">Cardiology</option>
                                        <option value="Neurology">Neurology</option>
                                        <option value="Radiology">Radiology</option>
                                        <option value="Haematology">Haematology</option>
                                        <option value="Pediatrics">Pediatrics</option>
                                        <option value="Orthopedics">Orthopedics</option>
                                        <option value="Dermatology">Dermatology</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                    <textarea
                                        value={uploadForm.description}
                                        onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                                        placeholder="Record description"
                                        rows="3"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowUploadModal(false)}
                                        className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 transition-colors"
                                    >
                                        Upload
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default MedicalRecords;
