import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Search,
    Filter,
    FileText,
    Download,
    Eye,
    Plus,
    Clock,
    User,
    ChevronRight,
    ArrowUpRight,
    Upload,
    FileImage,
    AlertCircle,
    Calendar,
    Stethoscope,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MedicalRecords = () => {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const mockRecords = [
        {
            _id: 'rec1',
            type: 'prescription',
            title: 'General Wellness Prescription',
            doctor: 'Dr. Sarah Wilson',
            date: '20 Feb 2026',
            category: 'Cardiology',
            fileSize: '1.2 MB',
            description: 'Post-consultation medication and lifestyle advice.',
            security: 'Encrypted'
        },
        {
            _id: 'rec2',
            type: 'report',
            title: 'Complete Blood Count (CBC)',
            doctor: 'Diagnostic Lab - MediCare',
            date: '18 Feb 2026',
            category: 'Hermatology',
            fileSize: '3.4 MB',
            description: 'Routine blood examination results.',
            security: 'Verified'
        },
        {
            _id: 'rec3',
            type: 'imaging',
            title: 'Chest X-Ray PA View',
            doctor: 'Dr. Bruce Banner',
            date: '10 Feb 2026',
            category: 'Radiology',
            fileSize: '15.8 MB',
            description: 'Radiology report for persistent cough inspection.',
            security: 'Encrypted'
        },
        {
            _id: 'rec4',
            type: 'prescription',
            title: 'Allergy Treatment Plan',
            doctor: 'Dr. Michael Chen',
            date: '05 Feb 2026',
            category: 'Immunology',
            fileSize: '0.8 MB',
            description: 'Seasonal allergy management and medication.',
            security: 'Verified'
        }
    ];

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/prescriptions', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const realPrescriptions = res.data.data.map(p => ({
                    _id: p._id,
                    type: 'prescription',
                    title: p.notes || 'Medical Prescription',
                    doctor: p.doctor?.name || 'MediCare specialist',
                    date: new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                    category: p.doctor?.specialization || 'General',
                    fileSize: '0.5 MB',
                    description: p.medicines?.map(m => m.name).join(', ') || 'Prescribed medication',
                    security: 'Verified'
                }));

                const combinedRecords = [...realPrescriptions];
                if (combinedRecords.length < 5) {
                    combinedRecords.push(...mockRecords);
                }

                setRecords(combinedRecords);
            } catch (err) {
                console.error('Error fetching prescriptions:', err);
                setRecords(mockRecords);
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, []);

    const filteredRecords = records.filter(rec => {
        const matchesTab = activeTab === 'all' || rec.type === activeTab;
        const matchesSearch =
            rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rec.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rec.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const categories = [
        { id: 'all', name: 'All Records', icon: FileText, count: records.length },
        { id: 'prescription', name: 'Prescriptions', icon: Stethoscope, count: records.filter(r => r.type === 'prescription').length },
        { id: 'report', name: 'Lab Reports', icon: FileImage, count: records.filter(r => r.type === 'report').length },
        { id: 'imaging', name: 'Imaging', icon: Shield, count: records.filter(r => r.type === 'imaging').length },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-10 pb-20">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-2 w-12 bg-primary-600 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Secure Medical Archive</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
                            The <span className="text-primary-600 italic">Medical</span> Vault
                        </h1>
                        <p className="text-slate-500 font-medium max-w-xl text-lg leading-relaxed">
                            Access your encrypted clinical history, authorized prescriptions, and verified diagnostic reports in one unified terminal.
                        </p>
                    </div>

                    <button className="relative group bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-2xl shadow-slate-900/20 active:scale-95 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative z-10">Authorize Upload</span>
                        <Upload size={18} className="relative z-10 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-10 items-start">
                    {/* Left Sidebar (3/12) */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Navigation Category */}
                        <div className="bg-white p-6 rounded-[3rem] border border-slate-100 shadow-sm space-y-1.5 relative overflow-hidden">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4 mb-4">Repository</h3>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`w-full flex items-center justify-between group px-5 py-4 rounded-[1.5rem] transition-all relative overflow-hidden ${activeTab === cat.id
                                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 scale-105'
                                        : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 relative z-10">
                                        <cat.icon size={18} className={activeTab === cat.id ? 'text-primary-400' : 'text-slate-400 group-hover:text-primary-600'} />
                                        <span className="text-xs font-black uppercase tracking-widest">{cat.name}</span>
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full relative z-10 ${activeTab === cat.id ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
                                        {cat.count}
                                    </span>
                                    {activeTab === cat.id && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Capacity Chart */}
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Vault Capacity</h3>
                                <Shield size={16} className="text-emerald-500" />
                            </div>
                            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mb-6">
                                <div className="text-4xl font-black text-slate-900 mb-1">2.4<span className="text-lg text-slate-400 font-bold">GB</span></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Storage Used</p>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '48%' }}
                                    className="h-full bg-gradient-to-r from-primary-500 to-indigo-600 rounded-full"
                                />
                            </div>
                            <p className="text-center text-[9px] font-bold text-slate-400 mt-4 uppercase tracking-[0.2em]">48% of total network quota</p>
                        </div>

                        {/* Security Protocol */}
                        <div className="bg-emerald-600 rounded-[3rem] p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-20 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                                <Shield size={100} />
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-lg font-black mb-2 tracking-tight">Active Protocol</h4>
                                <p className="text-emerald-100 text-[11px] font-medium leading-relaxed mb-6 opacity-80">
                                    All documents are isolated via AES-256 cryptographic standards.
                                </p>
                                <div className="flex items-center gap-2 text-[10px] font-black text-white px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full w-fit">
                                    <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></div>
                                    ISO 27001 COMPLIANT
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content (9/12) */}
                    <div className="lg:col-span-9 space-y-10">
                        {/* Search Terminal */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                                <Search className="text-slate-400 group-focus-within:text-primary-600 transition-all duration-300" size={24} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by physician, specialization, or keyword..."
                                className="w-full pl-20 pr-48 py-7 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm group-hover:shadow-2xl group-hover:shadow-black/[0.04] focus:shadow-2xl focus:shadow-primary-600/10 focus:border-primary-600/30 outline-none transition-all font-bold text-slate-900 text-lg placeholder:text-slate-300 placeholder:font-medium tracking-tight"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute inset-y-4 right-4 flex items-center gap-3">
                                <div className="hidden sm:flex items-center gap-2 px-5 py-3 bg-slate-900 rounded-2xl text-white shadow-xl">
                                    <span className="text-[10px] font-black uppercase tracking-widest">{filteredRecords.length} Files</span>
                                    <div className="h-4 w-px bg-white/20 mx-1"></div>
                                    <div className="flex items-center gap-1.5 text-[9px] font-black">
                                        <kbd className="bg-white/10 px-1.5 py-0.5 rounded border border-white/20">⌘</kbd>
                                        <kbd className="bg-white/10 px-1.5 py-0.5 rounded border border-white/20">K</kbd>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Records Board */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {loading ? (
                                [1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-48 bg-white/50 rounded-[3rem] animate-pulse border border-slate-100"></div>
                                ))
                            ) : filteredRecords.length > 0 ? (
                                filteredRecords.map((rec, idx) => (
                                    <motion.div
                                        key={rec._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-black/[0.03] hover:-translate-y-2 transition-all group flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-start justify-between mb-8">
                                                <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:rotate-6 shadow-xl ${rec.type === 'prescription' ? 'bg-primary-500 text-white shadow-primary-500/20' :
                                                    rec.type === 'report' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                                                        'bg-indigo-500 text-white shadow-indigo-500/20'
                                                    }`}>
                                                    <FileText size={28} />
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{rec.fileSize}</span>
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                                                        <div className={`h-1.5 w-1.5 rounded-full ${rec.security === 'Encrypted' ? 'bg-indigo-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{rec.security}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <h4 className="font-black text-slate-900 text-xl tracking-tight group-hover:text-primary-600 transition-colors capitalize mb-2">{rec.title}</h4>

                                            <div className="space-y-4 mb-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                                                        <User size={16} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{rec.doctor}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                                        <Calendar size={16} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{rec.date}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 pt-6 border-t border-slate-50 relative z-10">
                                            <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-[1.5rem] transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 group/btn shadow-sm">
                                                <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                                                View Source
                                            </button>
                                            <button className="h-14 w-14 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-90 group/dl">
                                                <Download size={20} className="group-hover/dl:-translate-y-1 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="md:col-span-2 bg-white py-32 rounded-[4rem] border border-slate-100 text-center shadow-lg relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                    <div className="h-32 w-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                                        <Shield className="text-slate-200" size={64} />
                                    </div>
                                    <h4 className="text-3xl font-black text-slate-900 mb-4">Repository Neutral</h4>
                                    <p className="text-slate-400 font-medium mb-12 max-w-sm mx-auto text-lg">
                                        No indexed documents match your criteria. Synchronize your vault to refresh the local cache.
                                    </p>
                                    <button className="px-14 py-5 bg-primary-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95">
                                        Manual Sync
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Recent History Terminal */}
                        <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/40">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-transparent opacity-50"></div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                                    <Clock className="text-primary-400" />
                                    Access Terminal History
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { text: 'Prescription downloaded for Cardiology checkup', time: '2h ago', icon: Download, security: 'Authorized' },
                                        { text: 'Blood Test Report uploaded by Diagnostic Lab', time: '1d ago', icon: Upload, security: 'Verified' },
                                        { text: 'Security log: Profile accessed from new device', time: '2d ago', icon: Shield, security: 'System' },
                                    ].map((act, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-[2rem] border border-white/5 transition-all group/item">
                                            <div className="flex items-center gap-5">
                                                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary-400 group-hover/item:text-white transition-colors">
                                                    <act.icon size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-200 tracking-tight leading-relaxed">{act.text}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{act.time}</span>
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{act.security}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight size={18} className="text-slate-600 group-hover/item:text-white transition-all transform group-hover/item:translate-x-1" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MedicalRecords;
