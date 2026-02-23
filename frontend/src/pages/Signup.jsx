import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    Mail,
    Lock,
    User,
    Phone,
    Loader2,
    AlertCircle,
    HeartPulse,
    UserCircle2,
    Stethoscope,
    ShieldCheck,
    ArrowRight,
    ArrowLeft,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'patient'
    });
    const { register, error } = useAuth();
    const [localLoading, setLocalLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step < 2) {
            setStep(2);
            return;
        }
        setLocalLoading(true);
        const result = await register(formData);
        setLocalLoading(false);
        if (result.success) {
            navigate('/login?signup=success');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = (e) => {
        e.preventDefault();
        if (formData.name && formData.email) setStep(2);
    };

    const prevStep = () => setStep(1);

    return (
        <div className="h-screen w-full flex overflow-hidden bg-white">
            {/* Form Side */}
            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center p-6 sm:p-10 bg-slate-50/30 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-[440px]"
                >
                    {/* Header */}
                    <div className="mb-6 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <Link to="/" className="flex items-center gap-2 mb-4 group">
                            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-200">
                                <HeartPulse className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-lg font-black text-slate-900 tracking-tighter uppercase">CarePulse</span>
                        </Link>
                        <h2 className="text-2xl font-black text-slate-900 mb-1">Create Account</h2>
                        <p className="text-sm text-slate-500 font-medium">Join our global healthcare network</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3 mb-6 w-full">
                        <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
                        <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 flex items-center gap-2.5 border border-red-100 overflow-hidden"
                            >
                                <AlertCircle size={16} className="shrink-0" />
                                <p className="text-xs font-bold leading-tight">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity Selection</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: 'patient' })}
                                                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all ${formData.role === 'patient' ? 'bg-primary-50 border-primary-600 text-primary-600 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                            >
                                                <User size={16} />
                                                <span className="font-bold text-[10px] uppercase tracking-wider">Patient</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: 'doctor' })}
                                                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all ${formData.role === 'doctor' ? 'bg-primary-50 border-primary-600 text-primary-600 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                            >
                                                <Stethoscope size={16} />
                                                <span className="font-bold text-[10px] uppercase tracking-wider">Medical Staff</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                            <div className="relative group">
                                                <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
                                                <input
                                                    name="name"
                                                    type="text"
                                                    required
                                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 outline-none transition-all font-medium text-slate-900 text-xs shadow-sm"
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email System</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
                                                <input
                                                    name="email"
                                                    type="email"
                                                    required
                                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 outline-none transition-all font-medium text-slate-900 text-xs shadow-sm"
                                                    placeholder="john@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={nextStep}
                                        className="w-full bg-slate-900 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-black tracking-widest uppercase text-[10px] transition-all active:scale-95 group mt-2"
                                    >
                                        Next Component
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
                                                <input
                                                    name="phone"
                                                    type="tel"
                                                    required
                                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 outline-none transition-all font-medium text-slate-900 text-xs shadow-sm"
                                                    placeholder="+1..."
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Privacy Key</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
                                                <input
                                                    name="password"
                                                    type="password"
                                                    required
                                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 outline-none transition-all font-medium text-slate-900 text-xs shadow-sm"
                                                    placeholder="••••••••"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 px-1">
                                        <input type="checkbox" required id="pol" className="w-4 h-4 rounded text-primary-600 focus:ring-primary-600 border-slate-200 cursor-pointer" />
                                        <label htmlFor="pol" className="text-[10px] font-bold text-slate-500 cursor-pointer select-none">I verify all provided medical records & identity info</label>
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="w-16 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3.5 rounded-xl flex items-center justify-center transition-all active:scale-95"
                                        >
                                            <ArrowLeft size={18} />
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={localLoading}
                                            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-black tracking-widest uppercase text-[10px] shadow-lg shadow-primary-200 transition-all active:scale-95 disabled:opacity-70 group"
                                        >
                                            {localLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                                <>
                                                    Initialize Account
                                                    <Check size={16} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 w-full text-center lg:text-left">
                        <p className="text-slate-500 font-bold text-[11px]">
                            Already registered? {' '}
                            <Link to="/login" className="text-primary-600 hover:text-primary-700 decoration-2 underline-offset-4 font-black uppercase tracking-wider">Login to System</Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Visual Side (Hidden on Mobile) */}
            <div className="hidden lg:block lg:w-1/2 bg-slate-900 relative">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200"
                        alt="CarePulse"
                        className="w-full h-full object-cover opacity-50 grayscale-[0.2]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-slate-900/60 to-slate-950"></div>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-20 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-10 rounded-[3rem] bg-white/5 backdrop-blur-xl border border-white/10 max-w-lg"
                    >
                        <div className="h-12 w-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white mb-6">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 leading-tight">Patient Safety & <br />Security Protocols.</h3>
                        <p className="text-slate-400 font-medium text-base">
                            Your medical data is protected with enterprise-level encryption. HIPAA compliant infrastructure ensuring your privacy is our top priority.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
