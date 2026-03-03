import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Calendar as CalendarIcon,
    Clock,
    User,
    Stethoscope,
    ChevronRight,
    ChevronLeft,
    AlertCircle,
    CheckCircle2,
    Heart,
    Activity,
    Baby,
    Bone,
    Check,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BookAppointment = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        doctor: '',
        department: '',
        date: '',
        time: '',
        reason: '',
        patientName: user?.name || '',
        patientAge: '',
        patientGender: '',
    });

    const departments = [
        { name: 'Cardiology', icon: Heart, desc: 'Advanced heart & vascular diagnostics', color: 'from-rose-500 to-pink-600' },
        { name: 'Neurology', icon: Activity, desc: 'Precision nervous system therapeutics', color: 'from-violet-500 to-purple-600' },
        { name: 'Pediatrics', icon: Baby, desc: 'Dedicated pediatric wellness care', color: 'from-emerald-500 to-teal-600' },
        { name: 'Orthopedics', icon: Bone, desc: 'Expert bone & joint restoration', color: 'from-amber-500 to-orange-600' },
        { name: 'General Medicine', icon: Stethoscope, desc: 'Comprehensive routine health checkups', color: 'from-primary-500 to-indigo-600' }
    ];

    const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
        '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ];

    useEffect(() => {
        if (formData.department) {
            fetchDoctors();
        }
    }, [formData.department]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/doctors/department/${formData.department}`);
            setDoctors(res.data.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load doctors. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.doctor || !formData.department || !formData.date || !formData.time || !formData.patientName || !formData.patientAge || !formData.patientGender || !formData.reason) {
            setError('Incomplete Data. Please ensure all fields including clinic intent are finalized.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/appointments', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStep(4);
        } catch (err) {
            setError(err.response?.data?.message || 'Network error during authorization.');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto pb-20 pt-6">
                {/* Header Section */}
                <div className="mb-12 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                            <div className="h-6 w-1 bg-primary-600 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Scheduling Terminal</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">
                            Reserve Your <span className="text-primary-600 italic">Session</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-lg text-base">
                            Select your specialized department and authorized clinician to initiate your clinical visit.
                        </p>
                    </div>

                    {/* Stepper Progress */}
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm self-center lg:self-auto uppercase tracking-widest font-black text-[8px]">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center">
                                <div className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-500 font-black text-[10px] ${step >= s ? 'bg-slate-900 text-white shadow-xl shadow-black/10' : 'bg-slate-50 text-slate-300'
                                    }`}>
                                    {step > s ? <Check size={14} strokeWidth={4} /> : s}
                                </div>
                                {s < 3 && <div className="w-8 h-1 mx-1.5 bg-slate-50 rounded-full overflow-hidden">
                                    <div className={`h-full bg-slate-900 transition-all duration-1000 ${step > s ? 'w-full' : 'w-0'}`}></div>
                                </div>}
                            </div>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Select Specialty */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-10"
                        >
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {departments.map((dept, idx) => (
                                    <motion.button
                                        key={dept.name}
                                        whileHover={{ y: -6, scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        onClick={() => {
                                            setFormData({ ...formData, department: dept.name });
                                            nextStep();
                                        }}
                                        className={`p-8 rounded-[2rem] text-left transition-all relative overflow-hidden group shadow-sm hover:shadow-2xl hover:shadow-black/[0.04] bg-white border border-slate-100`}
                                    >
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-6 transition-all group-hover:rotate-6 bg-gradient-to-br ${dept.color} text-white shadow-lg`}>
                                            <dept.icon size={22} />
                                        </div>
                                        <h3 className="font-black text-slate-900 text-lg mb-2 tracking-tighter uppercase">{dept.name}</h3>
                                        <p className="text-[12px] text-slate-400 font-medium leading-relaxed mb-6">{dept.desc}</p>
                                        <div className="flex items-center gap-2 text-[9px] font-black text-primary-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                                            Initiate Flow
                                            <ChevronRight size={12} />
                                        </div>

                                        {/* Subtle pattern background */}
                                        <div className="absolute -bottom-10 -right-10 opacity-5 transition-transform group-hover:scale-125 duration-1000">
                                            <dept.icon size={160} />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Select Clinician */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Authorized Clinicians</h2>
                                    <p className="text-xs font-black text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full w-fit mt-2 border border-primary-100 tracking-widest">DEPT: {formData.department.toUpperCase()}</p>
                                </div>
                                <button onClick={prevStep} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all group">
                                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                    Switch Specialty
                                </button>
                            </div>

                            {loading ? (
                                <div className="grid md:grid-cols-2 gap-8">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-white rounded-[3rem] animate-pulse border border-slate-50 shadow-sm"></div>)}
                                </div>
                            ) : doctors.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {doctors.map((doc, idx) => (
                                        <motion.div
                                            key={doc._id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            whileHover={{ y: -4 }}
                                            onClick={() => {
                                                setFormData({ ...formData, doctor: doc._id });
                                                nextStep();
                                            }}
                                            className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col sm:flex-row items-center sm:items-start gap-6 relative shadow-sm hover:shadow-xl overflow-hidden bg-white group ${formData.doctor === doc._id ? 'border-primary-600' : 'border-white hover:border-primary-100'}`}
                                        >
                                            <div className="h-32 w-full sm:w-32 rounded-2xl overflow-hidden shadow-xl relative flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                <img
                                                    src={doc.profileImage && doc.profileImage !== 'default-avatar.png'
                                                        ? (doc.profileImage.startsWith('http') ? doc.profileImage : `http://localhost:5000/${doc.profileImage}`)
                                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=4f46e5&color=fff&bold=true`}
                                                    alt={doc.name}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=4f46e5&color=fff&bold=true`;
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                            </div>

                                            <div className="flex-1 text-center sm:text-left space-y-3">
                                                <div>
                                                    <div className="flex items-center gap-2 justify-center sm:justify-start mb-1.5">
                                                        <span className="bg-emerald-500/10 text-emerald-600 text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-100">Verified Specialist</span>
                                                    </div>
                                                    <h4 className="font-black text-slate-900 text-lg tracking-tighter leading-none mb-1 group-hover:text-primary-600 transition-colors uppercase">{doc.name}</h4>
                                                    <p className="text-xs font-bold text-slate-400 italic">{doc.specialization}</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-50">
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Clinic Tenure</p>
                                                        <p className="text-sm font-black text-slate-800">{doc.experience || 10}<span className="text-[10px] text-slate-400 ml-1">YRS</span></p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Fee</p>
                                                        <p className="text-sm font-black text-primary-600">₹{doc.consultationFee || 500}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {formData.doctor === doc._id && (
                                                <div className="absolute top-6 right-6 h-10 w-10 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-600/30">
                                                    <Check size={24} strokeWidth={4} />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-sm px-6">
                                    <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
                                        <AlertCircle className="text-slate-300" size={48} />
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Null Provider Set</h4>
                                    <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm">No authorized clinicians are currently assigned to this department node.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Step 3: Logistics & Validation */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-transparent to-transparent opacity-50"></div>

                                <div className="relative z-10 space-y-10">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4 uppercase">
                                            <CalendarIcon className="text-primary-600" size={32} />
                                            Logistics Terminal
                                        </h2>
                                        <div className="p-3 bg-slate-50 rounded-2xl">
                                            <Shield size={24} className="text-emerald-500" />
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ x: 10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            className="p-6 bg-rose-50 border border-rose-100 text-rose-600 rounded-3xl flex items-center gap-4 text-[10px] font-black uppercase tracking-widest"
                                        >
                                            <AlertCircle size={20} /> {error}
                                        </motion.div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 font-black">Personal Identity</label>
                                            <div className="relative">
                                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.patientName}
                                                    placeholder="Unified Identification Name"
                                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-primary-600/5 focus:border-primary-600 font-bold text-slate-900 transition-all placeholder:text-slate-300 text-sm shadow-inner"
                                                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 font-black">Age Marker</label>
                                                <input
                                                    type="number"
                                                    required
                                                    placeholder="YY"
                                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-primary-600/5 focus:border-primary-600 font-bold text-slate-900 transition-all text-sm shadow-inner text-center"
                                                    onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 font-black">Bioset</label>
                                                <select
                                                    required
                                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-primary-600/5 focus:border-primary-600 font-bold text-slate-900 appearance-none transition-all cursor-pointer text-sm shadow-inner"
                                                    onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                                                >
                                                    <option value="">SET</option>
                                                    <option value="Male">MALE</option>
                                                    <option value="Female">FEMALE</option>
                                                    <option value="Other">OTHER</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 font-black">Authorization Date</label>
                                            <div className="relative">
                                                <CalendarIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                                <input
                                                    type="date"
                                                    required
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-primary-600/5 focus:border-primary-600 font-bold text-slate-900 transition-all text-sm shadow-inner"
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 font-black">Temporal Window</label>
                                            <div className="relative">
                                                <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                                <select
                                                    required
                                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-primary-600/5 focus:border-primary-600 font-bold text-slate-900 appearance-none transition-all cursor-pointer text-sm shadow-inner"
                                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                >
                                                    <option value="">CHOOSE SLOT</option>
                                                    {timeSlots.map(slot => (
                                                        <option key={slot} value={slot}>{slot.toUpperCase()}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 font-black">Clinical Intent Description</label>
                                        <textarea
                                            rows="4"
                                            className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-8 focus:ring-primary-600/5 focus:border-primary-600 font-bold text-slate-900 transition-all placeholder:text-slate-300 text-sm shadow-inner"
                                            placeholder="Synchronize clinical rationale and primary symptoms for specialist review..."
                                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-6 pt-10">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-12 py-5 bg-slate-100 text-slate-500 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all shadow-sm active:scale-95"
                                        >
                                            Abort Step
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="flex-1 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/40 hover:bg-black transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 relative overflow-hidden group/submit"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover/submit:opacity-100 transition-opacity"></div>
                                            <span className="relative z-10">{loading ? 'Processing Sync...' : 'Finalize Authorization'}</span>
                                            <div className="relative z-10 h-6 w-6 rounded-lg bg-white/20 flex items-center justify-center group-hover/submit:translate-x-1 transition-transform">
                                                {loading ? <div className="h-3 w-3 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : <Check size={14} strokeWidth={4} />}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Success Terminal */}
                    {step === 4 && (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-20 rounded-[5rem] shadow-2xl border border-slate-50 text-center max-w-2xl mx-auto relative overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-emerald-500"></div>
                            <div className="h-32 w-32 bg-emerald-50 text-emerald-600 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-emerald-500/10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                                <CheckCircle2 size={64} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 uppercase">Protocol Established</h2>
                            <p className="text-slate-500 font-bold mb-12 text-lg max-w-sm mx-auto italic leading-relaxed">
                                "Your clinical authorization request has been successfully broadasted to the specialist node."
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => navigate('/patient/dashboard')}
                                    className="py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-black transition-all hover:-translate-y-1 active:scale-95"
                                >
                                    Return to Overview
                                </button>
                                <button
                                    onClick={() => setStep(1)}
                                    className="py-5 bg-slate-50 text-slate-500 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] border border-slate-100 hover:bg-white hover:shadow-xl transition-all active:scale-95"
                                >
                                    New Booking
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
};

export default BookAppointment;
