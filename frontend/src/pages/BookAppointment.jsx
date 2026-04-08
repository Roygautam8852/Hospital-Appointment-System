import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import RazorpayPayment from '../components/RazorpayPayment';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
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
    Shield,
    Brain,
    Eye,
    Wind,
    Pill,
    ArrowRight,
    Plus,
    Star,
    MapPin,
    Phone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BookAppointment = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);
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
        { name: 'Cardiology', icon: Heart, desc: 'Heart & vascular diagnostics, ECG, echo', color: 'bg-rose-50', iconColor: 'text-rose-600', iconBg: 'bg-rose-100', border: 'hover:border-rose-200', badge: 'bg-rose-100 text-rose-600' },
        { name: 'Neurology', icon: Brain, desc: 'Brain, spine & nervous system care', color: 'bg-violet-50', iconColor: 'text-violet-600', iconBg: 'bg-violet-100', border: 'hover:border-violet-200', badge: 'bg-violet-100 text-violet-600' },
        { name: 'Pediatrics', icon: Baby, desc: 'Child health, growth & development', color: 'bg-emerald-50', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100', border: 'hover:border-emerald-200', badge: 'bg-emerald-100 text-emerald-600' },
        { name: 'Orthopedics', icon: Bone, desc: 'Bone, joint & musculoskeletal treatment', color: 'bg-amber-50', iconColor: 'text-amber-600', iconBg: 'bg-amber-100', border: 'hover:border-amber-200', badge: 'bg-amber-100 text-amber-600' },
        { name: 'General Medicine', icon: Stethoscope, desc: 'Routine checkups & general health care', color: 'bg-blue-50', iconColor: 'text-blue-600', iconBg: 'bg-blue-100', border: 'hover:border-blue-200', badge: 'bg-blue-100 text-blue-600' },
        { name: 'Ophthalmology', icon: Eye, desc: 'Complete eye exams & vision correction', color: 'bg-cyan-50', iconColor: 'text-cyan-600', iconBg: 'bg-cyan-100', border: 'hover:border-cyan-200', badge: 'bg-cyan-100 text-cyan-600' },
    ];

    const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
        '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ];

    useEffect(() => {
        if (formData.department) fetchDoctors();
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
            setError('Please fill in all required fields before confirming.');
            return;
        }
        if (!selectedDoctor) {
            setError('Selected doctor not found. Please try selecting a doctor again.');
            return;
        }
        // Move to Step 4 (Review)
        setError('');
        nextStep();
    };

    const handlePaymentSuccess = async (paymentData) => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            
            // Prepare appointment data with proper date conversion
            const appointmentData = {
                ...formData,
                patientAge: Number(formData.patientAge),
                date: new Date(formData.date).toISOString(),
                paymentStatus: 'paid',
                paymentId: paymentData.transactionId,
                amount: paymentData.amount,
            };
            
            const response = await axios.post('http://localhost:5000/api/appointments', appointmentData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setStep(5);
            } else {
                setError(response.data.message || 'Failed to book appointment. Please try again.');
                setShowPayment(false);
            }
        } catch (err) {
            console.error('Booking error:', err);
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
            setShowPayment(false);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const selectedDept = departments.find(d => d.name === formData.department);
    const selectedDoctor = doctors.find(d => d._id === formData.doctor);

    return (
        <DashboardLayout>
            <div className="font-sans max-w-5xl mx-auto pb-10">

                {/* Page Header */}
                <div className="mb-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="relative px-8 py-6">
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-emerald-50/30 to-emerald-50/60 pointer-events-none"></div>
                            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">Book Appointment</span>
                                    </div>
                                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">Reserve Your Session</h1>
                                    <p className="text-sm text-slate-500 font-medium mt-0.5">Select a department, choose a doctor, and confirm your slot.</p>
                                </div>

                                {/* Step Progress */}
                                <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-100 self-start lg:self-auto">
                                    {[
                                        { n: 1, label: 'Department' },
                                        { n: 2, label: 'Doctor' },
                                        { n: 3, label: 'Details' },
                                        { n: 4, label: 'Review' },
                                        { n: 5, label: 'Payment' },
                                    ].map((s, i) => (
                                        <div key={s.n} className="flex items-center gap-1.5">
                                            <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-[11px] font-black transition-all duration-300 ${step >= s.n ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                                {step > s.n ? <Check size={12} strokeWidth={3} /> : s.n}
                                            </div>
                                            <span className={`text-[10px] font-bold hidden sm:block ${step === s.n ? 'text-slate-700' : 'text-slate-400'}`}>{s.label}</span>
                                            {i < 4 && <div className={`w-6 h-px mx-0.5 transition-all duration-500 ${step > s.n ? 'bg-emerald-400' : 'bg-slate-200'}`}></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Selected summary strip */}
                        {step > 1 && (
                            <div className="px-8 py-3 border-t border-slate-50 bg-slate-50/50 flex items-center gap-4 flex-wrap">
                                {selectedDept && (
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold ${selectedDept.badge}`}>
                                        <selectedDept.icon size={11} />
                                        {selectedDept.name}
                                    </div>
                                )}
                                {step > 2 && selectedDoctor && (
                                    <>
                                        <ChevronRight size={12} className="text-slate-300" />
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-600">
                                            <User size={11} />
                                            {selectedDoctor.name}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* ── Step 1: Select Department ── */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {departments.map((dept, idx) => (
                                    <motion.button
                                        key={dept.name}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.06 }}
                                        whileHover={{ y: -3, scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setFormData({ ...formData, department: dept.name, doctor: '' });
                                            nextStep();
                                        }}
                                        className={`p-6 rounded-2xl text-left transition-all bg-white border border-slate-100 shadow-sm hover:shadow-md ${dept.border} group relative overflow-hidden`}
                                    >
                                        <div className={`h-11 w-11 rounded-xl ${dept.iconBg} ${dept.iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <dept.icon size={20} />
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-sm tracking-tight mb-1">{dept.name}</h3>
                                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-4">{dept.desc}</p>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0">
                                            Select department <ChevronRight size={11} />
                                        </div>
                                        <div className={`absolute -bottom-6 -right-6 opacity-[0.06] transition-transform group-hover:scale-125 duration-700`}>
                                            <dept.icon size={96} />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Info strip */}
                            <div className="mt-4 bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4 flex flex-wrap items-center gap-6">
                                {[
                                    { icon: Shield, label: '500+ Certified Specialists', color: 'text-emerald-600' },
                                    { icon: Clock, label: 'Same-day appointments available', color: 'text-blue-600' },
                                    { icon: CheckCircle2, label: 'Instant confirmation', color: 'text-violet-600' },
                                ].map((b, i) => (
                                    <div key={i} className={`flex items-center gap-2 text-[11px] font-semibold ${b.color}`}>
                                        <b.icon size={13} /> {b.label}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Step 2: Select Doctor ── */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-slate-800 tracking-tight">Available Doctors</h2>
                                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{formData.department} department · click a doctor to continue</p>
                                </div>
                                <button onClick={prevStep} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-sm">
                                    <ChevronLeft size={14} /> Back
                                </button>
                            </div>

                            {loading ? (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white rounded-2xl animate-pulse border border-slate-100 shadow-sm"></div>)}
                                </div>
                            ) : doctors.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {doctors.map((doc, idx) => (
                                        <motion.div
                                            key={doc._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.08 }}
                                            whileHover={{ y: -2 }}
                                            onClick={() => {
                                                setFormData({ ...formData, doctor: doc._id });
                                                nextStep();
                                            }}
                                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-5 bg-white shadow-sm hover:shadow-md group relative overflow-hidden ${formData.doctor === doc._id ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 hover:border-emerald-200'}`}
                                        >
                                            <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-300">
                                                <img
                                                    src={doc.profileImage && doc.profileImage !== 'default-avatar.png'
                                                        ? (doc.profileImage.startsWith('http') ? doc.profileImage : `http://localhost:5000/${doc.profileImage}`)
                                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=10b981&color=fff&bold=true`}
                                                    alt={doc.name}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=10b981&color=fff&bold=true`;
                                                    }}
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Verified</span>
                                                </div>
                                                <h4 className="font-bold text-slate-800 text-sm tracking-tight truncate">{doc.name}</h4>
                                                <p className="text-[11px] text-slate-400 font-medium">{doc.specialization}</p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <div>
                                                        <span className="text-xs font-bold text-slate-600">{doc.experience || 10}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium"> yrs exp</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-bold text-emerald-600">₹{doc.consultationFee || 500}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium"> fee</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${formData.doctor === doc._id ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-300 border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-500 group-hover:border-emerald-100'}`}>
                                                {formData.doctor === doc._id ? <Check size={13} strokeWidth={3} /> : <ChevronRight size={13} />}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                                    <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                        <AlertCircle size={24} className="text-slate-300" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 mb-1">No doctors available</p>
                                    <p className="text-xs text-slate-400 font-medium">No doctors are currently assigned to this department.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── Step 3: Details & Confirm ── */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-slate-800 tracking-tight">Appointment Details</h2>
                                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">Fill in your information and choose a date & time slot</p>
                                </div>
                                <button onClick={prevStep} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-sm">
                                    <ChevronLeft size={14} /> Back
                                </button>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold"
                                >
                                    <AlertCircle size={16} /> {error}
                                </motion.div>
                            )}

                            <div className="grid lg:grid-cols-3 gap-4">
                                {/* Main form */}
                                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3">
                                        <div className="h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                            <User size={15} className="text-emerald-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-700">Patient Information</h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {/* Patient name */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
                                            <div className="relative">
                                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.patientName}
                                                    placeholder="e.g. Gautam Kumar"
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium text-slate-800 transition-all placeholder:text-slate-300"
                                                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Age + Gender */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Age *</label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={formData.patientAge}
                                                    placeholder="e.g. 28"
                                                    min="1" max="120"
                                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium text-slate-800 transition-all placeholder:text-slate-300"
                                                    onChange={(e) => setFormData({ ...formData, patientAge: Number(e.target.value) })}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gender *</label>
                                                <select
                                                    required
                                                    value={formData.patientGender}
                                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium text-slate-800 transition-all cursor-pointer appearance-none"
                                                    onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 border-t border-slate-50 border-b bg-slate-50/30 flex items-center gap-3">
                                        <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <Calendar size={15} className="text-blue-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-700">Date & Time</h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {/* Date */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Appointment Date *</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                                                <input
                                                    type="date"
                                                    required
                                                    value={formData.date}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium text-slate-800 transition-all"
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Time Slots */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Time Slot *</label>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                {timeSlots.map(slot => (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, time: slot })}
                                                        className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all border ${formData.time === slot
                                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200'
                                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50'
                                                        }`}
                                                    >
                                                        {slot}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 border-t border-slate-50 border-b bg-slate-50/30 flex items-center gap-3">
                                        <div className="h-8 w-8 bg-violet-50 rounded-lg flex items-center justify-center">
                                            <Stethoscope size={15} className="text-violet-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-700">Reason for Visit</h3>
                                    </div>
                                    <div className="p-6">
                                        <textarea
                                            rows="3"
                                            value={formData.reason}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium text-slate-800 transition-all placeholder:text-slate-300 resize-none"
                                            placeholder="Briefly describe your symptoms or reason for consultation..."
                                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        ></textarea>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="px-6 py-4 border-t border-slate-50 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs border border-slate-200 hover:bg-slate-100 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200 disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.98]"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 size={16} /> Proceed to Payment
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Booking Summary sidebar */}
                                <div className="space-y-4">
                                    {/* Doctor summary */}
                                    {selectedDoctor && (
                                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                            <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
                                                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                                <h3 className="text-xs font-bold text-slate-700">Selected Doctor</h3>
                                            </div>
                                            <div className="p-5">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="h-12 w-12 rounded-xl overflow-hidden border-2 border-emerald-100 flex-shrink-0">
                                                        <img
                                                            src={selectedDoctor.profileImage && selectedDoctor.profileImage !== 'default-avatar.png'
                                                                ? (selectedDoctor.profileImage.startsWith('http') ? selectedDoctor.profileImage : `http://localhost:5000/${selectedDoctor.profileImage}`)
                                                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoctor.name)}&background=10b981&color=fff&bold=true`}
                                                            alt={selectedDoctor.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{selectedDoctor.name}</p>
                                                        <p className="text-[11px] text-slate-400">{selectedDoctor.specialization}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                                        <p className="text-sm font-black text-slate-800">{selectedDoctor.experience || 10}</p>
                                                        <p className="text-[9px] text-slate-400 font-medium">Years exp</p>
                                                    </div>
                                                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                                                        <p className="text-sm font-black text-emerald-600">₹{selectedDoctor.consultationFee || 500}</p>
                                                        <p className="text-[9px] text-slate-400 font-medium">Consult fee</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Booking info */}
                                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                                        <h3 className="text-xs font-bold text-slate-700 mb-3">Booking Summary</h3>
                                        <div className="space-y-2.5">
                                            {[
                                                { label: 'Department', value: formData.department || '—', icon: Stethoscope },
                                                { label: 'Date', value: formData.date || '—', icon: Calendar },
                                                { label: 'Time', value: formData.time || '—', icon: Clock },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                                                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                                                        <item.icon size={12} className="text-slate-300" />
                                                        {item.label}
                                                    </div>
                                                    <span className={`text-[11px] font-bold ${item.value !== '—' ? 'text-slate-700' : 'text-slate-300'}`}>{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Trust note */}
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Shield size={13} className="text-emerald-600" />
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Secure Booking</span>
                                        </div>
                                        <p className="text-[11px] text-emerald-700 font-medium leading-relaxed">Your appointment details are encrypted and HIPAA compliant. You will receive a confirmation notification.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── Step 4: Review ── */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-slate-800 tracking-tight">Review Your Appointment</h2>
                                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">Verify all details are correct before proceeding to payment</p>
                                </div>
                                <button onClick={prevStep} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-sm">
                                    <ChevronLeft size={14} /> Back
                                </button>
                            </div>

                            <div className="max-w-xl mx-auto space-y-4">
                                {/* Patient Info Card */}
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
                                        <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <User size={15} className="text-blue-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-700">Patient Information</h3>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                            <span className="text-sm text-slate-500 font-medium">Name</span>
                                            <span className="font-bold text-slate-800">{formData.patientName}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                            <span className="text-sm text-slate-500 font-medium">Age</span>
                                            <span className="font-bold text-slate-800">{formData.patientAge} years</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-sm text-slate-500 font-medium">Gender</span>
                                            <span className="font-bold text-slate-800">{formData.patientGender}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment Details Card */}
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
                                        <div className="h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                            <Calendar size={15} className="text-emerald-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-700">Appointment Details</h3>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                            <span className="text-sm text-slate-500 font-medium">Department</span>
                                            <span className="font-bold text-slate-800">{formData.department}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                            <span className="text-sm text-slate-500 font-medium">Date</span>
                                            <span className="font-bold text-slate-800">{new Date(formData.date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-sm text-slate-500 font-medium">Time</span>
                                            <span className="font-bold text-slate-800">{formData.time}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Doctor Info Card */}
                                {selectedDoctor && (
                                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
                                            <div className="h-8 w-8 bg-violet-50 rounded-lg flex items-center justify-center">
                                                <User size={15} className="text-violet-600" />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-700">Doctor Information</h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-slate-200 flex-shrink-0">
                                                    <img
                                                        src={selectedDoctor.profileImage && selectedDoctor.profileImage !== 'default-avatar.png'
                                                            ? (selectedDoctor.profileImage.startsWith('http') ? selectedDoctor.profileImage : `http://localhost:5000/${selectedDoctor.profileImage}`)
                                                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoctor.name)}&background=10b981&color=fff&bold=true`}
                                                        alt={selectedDoctor.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">Dr. {selectedDoctor.name}</p>
                                                    <p className="text-sm text-slate-500">{selectedDoctor.specialization}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs">
                                                        <span className="text-slate-600"><span className="font-bold text-slate-800">{selectedDoctor.experience || 10}</span> yrs exp</span>
                                                        <span className="text-emerald-600"><span className="font-bold">₹{selectedDoctor.consultationFee || 500}</span> fee</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Reason Card */}
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
                                        <div className="h-8 w-8 bg-rose-50 rounded-lg flex items-center justify-center">
                                            <Stethoscope size={15} className="text-rose-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-700">Reason for Visit</h3>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-100">{formData.reason}</p>
                                    </div>
                                </div>

                                {/* Amount Summary */}
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 shadow-sm p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-600 font-medium">Consultation Fee</p>
                                            <p className="text-xs text-slate-500 mt-0.5">To be paid to Dr. {selectedDoctor?.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-emerald-600">₹{selectedDoctor?.consultationFee || 500}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-6 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-100 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => {
                                            const consultationFee = selectedDoctor?.consultationFee || 500;
                                            setPaymentAmount(consultationFee);
                                            setShowPayment(true);
                                        }}
                                        className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                                    >
                                        <CheckCircle2 size={16} /> Proceed to Payment
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── Step 5: Success ── */}
                    {step === 5 && (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.93, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="max-w-lg mx-auto"
                        >
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-center">
                                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500"></div>
                                <div className="p-10">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -20 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', delay: 0.2 }}
                                        className="h-20 w-20 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
                                    >
                                        <CheckCircle2 size={40} className="text-emerald-600" strokeWidth={2} />
                                    </motion.div>

                                    <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-2">Appointment Confirmed!</h2>
                                    <p className="text-sm text-slate-500 font-medium mb-2">Your appointment has been successfully booked.</p>
                                    <p className="text-xs text-slate-400 font-medium mb-8">A confirmation has been sent. Please arrive 10 minutes early.</p>

                                    <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 mb-6 text-left space-y-2.5">
                                        {[
                                            { label: 'Department', value: formData.department },
                                            { label: 'Date', value: formData.date },
                                            { label: 'Time', value: formData.time },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400 font-medium">{item.label}</span>
                                                <span className="font-bold text-slate-700">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => navigate('/patient/dashboard')}
                                            className="py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200"
                                        >
                                            Go to Dashboard
                                        </button>
                                        <button
                                            onClick={() => { setStep(1); setFormData({ doctor: '', department: '', date: '', time: '', reason: '', patientName: user?.name || '', patientAge: '', patientGender: '' }); setError(''); }}
                                            className="py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-200 hover:bg-white hover:shadow-sm transition-all"
                                        >
                                            Book Another
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Razorpay Payment Modal */}
                <RazorpayPayment
                    isOpen={showPayment}
                    onClose={() => setShowPayment(false)}
                    amount={paymentAmount}
                    doctorName={selectedDoctor?.name || ''}
                    appointmentDetails={{
                        email: user?.email,
                        phone: user?.phone,
                        date: formData.date,
                        time: formData.time
                    }}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            </div>
        </DashboardLayout>
    );
};

export default BookAppointment;
