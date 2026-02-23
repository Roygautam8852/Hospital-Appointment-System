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
    Check
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
    });

    const departments = [
        { name: 'Cardiology', icon: Heart, desc: 'Heart and vascular care' },
        { name: 'Neurology', icon: Activity, desc: 'Brain and nervous system' },
        { name: 'Pediatrics', icon: Baby, desc: 'Children health services' },
        { name: 'Orthopedics', icon: Bone, desc: 'Bone and joint care' },
        { name: 'General Medicine', icon: Stethoscope, desc: 'Routine health checkups' }
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
        if (!formData.doctor || !formData.date || !formData.time) {
            setError('Please fill all required fields');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/appointments', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStep(4); // Success step
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto pb-20">
                {/* Header */}
                <div className="mb-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black text-slate-900 tracking-tight mb-3"
                    >
                        Book Appointment
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs"
                    >
                        Quality Care is just a few clicks away
                    </motion.p>
                </div>

                {/* Stepper Progress */}
                <div className="flex items-center justify-center mb-16 px-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${step >= s ? 'bg-primary-600 text-white shadow-primary-200' : 'bg-white text-slate-300 border border-slate-100 shadow-sm'
                                }`}>
                                {step > s ? <Check size={20} strokeWidth={3} /> : <span className="font-black">{s}</span>}
                            </div>
                            {s < 3 && (
                                <div className="w-12 sm:w-24 h-1 mx-3 rounded-full bg-slate-100 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: step > s ? '100%' : (step === s ? '50%' : '0%') }}
                                        className="h-full bg-primary-600"
                                    ></motion.div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Select Department */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <div className="col-span-full mb-4">
                                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Choose a Specialty</h2>
                                <p className="text-sm text-slate-500 font-medium">Select the department for your consultation</p>
                            </div>
                            {departments.map((dept, idx) => (
                                <motion.button
                                    key={dept.name}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setFormData({ ...formData, department: dept.name });
                                        nextStep();
                                    }}
                                    className={`p-8 rounded-[2.5rem] border-2 text-left transition-all relative overflow-hidden group ${formData.department === dept.name
                                        ? 'border-primary-600 bg-primary-50'
                                        : 'border-white bg-white shadow-sm hover:shadow-xl hover:border-primary-100'
                                        }`}
                                >
                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 ${formData.department === dept.name ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-400'
                                        }`}>
                                        <dept.icon size={28} />
                                    </div>
                                    <h3 className="font-black text-slate-800 mb-2 tracking-tight">{dept.name}</h3>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{dept.desc}</p>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight size={18} className="text-primary-600" />
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}

                    {/* Step 2: Select Doctor */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Available Specialists</h2>
                                    <p className="text-sm text-slate-500 font-medium italic">Department: {formData.department}</p>
                                </div>
                                <button onClick={prevStep} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors">
                                    <ChevronLeft size={16} /> Back to Specialties
                                </button>
                            </div>

                            {loading ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-white rounded-[2.5rem] animate-pulse shadow-sm"></div>)}
                                </div>
                            ) : doctors.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {doctors.map((doc) => (
                                        <motion.div
                                            key={doc._id}
                                            whileHover={{ y: -5 }}
                                            onClick={() => {
                                                setFormData({ ...formData, doctor: doc._id });
                                                nextStep();
                                            }}
                                            className={`p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all flex items-center gap-6 relative shadow-sm ${formData.doctor === doc._id
                                                ? 'border-primary-600 bg-primary-50 shadow-primary-50'
                                                : 'border-white bg-white hover:border-primary-100 hover:shadow-xl'
                                                }`}
                                        >
                                            <div className="h-24 w-24 rounded-3xl overflow-hidden shadow-lg border-2 border-white flex-shrink-0 bg-slate-100">
                                                <img
                                                    src={doc.profileImage && doc.profileImage !== 'default-avatar.png' ? doc.profileImage : `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=10b981&color=fff&bold=true`}
                                                    alt={doc.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Verified</span>
                                                    <div className="flex items-center text-amber-400">
                                                        <CheckCircle2 size={10} className="fill-current" />
                                                    </div>
                                                </div>
                                                <h4 className="font-black text-slate-800 tracking-tight leading-none mb-2">{doc.name}</h4>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{doc.specialization}</p>
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Experience</p>
                                                        <p className="text-xs font-bold text-slate-600">{doc.experience || 10} Years</p>
                                                    </div>
                                                    <div className="w-px h-6 bg-slate-100"></div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Fee</p>
                                                        <p className="text-xs font-bold text-primary-600">₹{doc.consultationFee || 500}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {formData.doctor === doc._id && (
                                                <div className="absolute top-4 right-4 h-6 w-6 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg">
                                                    <Check size={14} strokeWidth={4} />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                                    <AlertCircle className="mx-auto text-slate-200 mb-4" size={48} />
                                    <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No doctors available in this section yet.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Step 3: Complete Details */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50">
                                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-8 flex items-center gap-3">
                                    <CalendarIcon className="text-primary-600" /> Appointment Details
                                </h2>

                                {error && (
                                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
                                        <AlertCircle size={18} /> {error}
                                    </div>
                                )}

                                <div className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block pl-2">Select Date</label>
                                            <div className="relative">
                                                <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-600" size={18} />
                                                <input
                                                    type="date"
                                                    required
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-bold text-slate-700 transition-all"
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block pl-2">Preferred Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-600" size={18} />
                                                <select
                                                    required
                                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-bold text-slate-700 appearance-none transition-all cursor-pointer"
                                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                >
                                                    <option value="">Choose Slot</option>
                                                    {timeSlots.map(slot => (
                                                        <option key={slot} value={slot}>{slot}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block pl-2">Reason for Visit</label>
                                        <textarea
                                            rows="4"
                                            className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-medium text-slate-700 transition-all"
                                            placeholder="Please describe your symptoms or reason for the visit..."
                                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-8 py-4 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-sm"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="flex-1 py-4 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                        >
                                            {loading ? <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : 'Confirm Appointment'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Success Message */}
                    {step === 4 && (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-16 rounded-[4rem] shadow-2xl border border-slate-50 text-center max-w-xl mx-auto"
                        >
                            <div className="h-24 w-24 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-lg shadow-emerald-50">
                                <CheckCircle2 size={56} strokeWidth={2.5} className="animate-pulse" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4 uppercase">Success!</h2>
                            <p className="text-slate-500 font-medium italic mb-10 text-lg">
                                "Your appointment has been successfully requested. We'll update you soon!"
                            </p>
                            <div className="space-y-4">
                                <button
                                    onClick={() => navigate('/patient/dashboard')}
                                    className="w-full py-5 bg-primary-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary-200 hover:bg-primary-700 transition-all hover:scale-[1.02]"
                                >
                                    Go to Dashboard
                                </button>
                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-primary-600 transition-colors"
                                >
                                    Book Another Appointment
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
