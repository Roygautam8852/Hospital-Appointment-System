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
        <div className="h-screen w-full flex overflow-hidden bg-slate-50 relative font-['Plus_Jakarta_Sans',sans-serif]">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-600/5 rounded-full blur-[120px] pointer-events-none transition-all duration-1000"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Go Back Button */}
            <Link
                to="/"
                className="absolute top-8 left-8 z-50 flex items-center justify-center w-12 h-12 bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl text-slate-600 hover:bg-white hover:text-primary-600 transition-all shadow-xl shadow-black/5 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>

            {/* Form Side */}
            <div className="w-full lg:w-[45%] h-full flex flex-col justify-center items-center p-8 relative z-10 bg-white/20 backdrop-blur-3xl border-r border-white/40 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-[460px]"
                >
                    {/* Brand */}
                    <div className="flex items-center gap-4 mb-12 group self-center lg:self-start">
                        <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-primary-200 group-hover:rotate-6 transition-all duration-500 text-white">
                            <HeartPulse size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-slate-900 leading-none tracking-tighter">MediCare</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Infrastructure V2</span>
                        </div>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Create Identity</h2>
                        <p className="text-slate-500 font-medium">Join our global network of healthcare excellence.</p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center gap-2 mb-10 w-full">
                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${step >= 1 ? 'bg-primary-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]' : 'bg-slate-200'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${step >= 2 ? 'bg-primary-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]' : 'bg-slate-200'}`}></div>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-600"
                            >
                                <AlertCircle size={20} className="shrink-0" />
                                <p className="text-sm font-bold">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Network Role</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { id: 'patient', label: 'Patient', icon: User },
                                                { id: 'doctor', label: 'Doctor', icon: Stethoscope },
                                            ].map((r) => (
                                                <button
                                                    key={r.id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, role: r.id })}
                                                    className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all duration-500 group/role ${formData.role === r.id
                                                        ? 'bg-primary-50 border-primary-600 text-primary-600 shadow-xl shadow-primary-200/50'
                                                        : 'bg-white border-slate-100 text-slate-400 hover:border-primary-200 hover:bg-slate-50'}`}
                                                >
                                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-3 transition-all ${formData.role === r.id ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover/role:bg-white'}`}>
                                                        <r.icon size={24} />
                                                    </div>
                                                    <span className="font-extrabold text-[11px] uppercase tracking-widest">{r.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2 group">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Legal Name</label>
                                            <div className="relative">
                                                <UserCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                                <input
                                                    name="name"
                                                    type="text"
                                                    required
                                                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-8 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-slate-900 text-sm shadow-xl shadow-black/[0.02]"
                                                    placeholder="e.g. Alexander Pierce"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Universal Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                                <input
                                                    name="email"
                                                    type="email"
                                                    required
                                                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-8 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-slate-900 text-sm shadow-xl shadow-black/[0.02]"
                                                    placeholder="name@healthcare.io"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={nextStep}
                                        className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-black tracking-widest uppercase text-[11px] shadow-2xl transition-all active:scale-95 group"
                                    >
                                        Next Component
                                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2 group">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Phone</label>
                                            <div className="relative">
                                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                                <input
                                                    name="phone"
                                                    type="tel"
                                                    required
                                                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-8 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-slate-900 text-sm shadow-xl shadow-black/[0.02]"
                                                    placeholder="+91 88x xxx xxxx"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Security Key</label>
                                            <div className="relative">
                                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                                <input
                                                    name="password"
                                                    type="password"
                                                    required
                                                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-8 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-slate-900 text-sm shadow-xl shadow-black/[0.02]"
                                                    placeholder="••••••••••••"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <input type="checkbox" required id="pol" className="w-5 h-5 rounded-lg text-primary-600 focus:ring-primary-600 border-slate-200 cursor-pointer transition-all" />
                                        <label htmlFor="pol" className="text-[11px] font-bold text-slate-500 cursor-pointer select-none leading-relaxed">
                                            I agree to the <span className="text-primary-600">Health Data Privacy Policy</span> and verify my identity.
                                        </label>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="w-20 bg-white border border-slate-100 text-slate-400 py-5 rounded-2xl flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-lg shadow-black/[0.02]"
                                        >
                                            <ArrowLeft size={24} />
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={localLoading}
                                            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-black tracking-widest uppercase text-[11px] shadow-2xl shadow-primary-200 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 group"
                                        >
                                            {localLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                                <>
                                                    Initialize Identity
                                                    <Check size={20} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100 text-center lg:text-left">
                        <p className="text-slate-500 font-bold text-sm">
                            Already part of the network? {' '}
                            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-black uppercase tracking-widest text-xs ml-2 hover:underline decoration-2 underline-offset-4">Identity Login</Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Visual Side (Mesh Section) */}
            <div className="hidden lg:flex flex-1 h-full bg-slate-900 overflow-hidden relative">
                {/* Mesh Gradient Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200"
                        alt="CarePulse"
                        className="w-full h-full object-cover opacity-30 grayscale-[0.8]"
                    />
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
                    <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-primary-600/20 rounded-full blur-[140px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 w-full flex flex-col justify-center p-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="p-16 rounded-[4rem] bg-white/[0.03] backdrop-blur-2xl border border-white/10 max-w-xl group hover:border-white/20 transition-all duration-700 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                    >
                        <div className="h-20 w-20 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white mb-10 shadow-2xl shadow-emerald-500/20 group-hover:rotate-12 transition-all duration-700">
                            <ShieldCheck size={40} />
                        </div>
                        <h3 className="text-5xl font-black text-white mb-8 leading-[1.2] tracking-tighter">Your Health Data. <br /> <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">Encrypted 24/7.</span></h3>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12">
                            We utilize zero-knowledge proofs and enterprise-grade encryption to ensure your medical history remains exclusively yours.
                        </p>

                        <div className="space-y-6">
                            {[
                                { label: 'HIPAA Compliant Cloud Architecture', icon: Check },
                                { label: 'End-to-End Encryption as Standard', icon: Check },
                                { label: 'Secure Multi-Factor Authorization', icon: Check },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-slate-300 font-bold text-sm bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="h-6 w-6 bg-emerald-500/20 text-emerald-500 rounded-lg flex items-center justify-center">
                                        <item.icon size={14} />
                                    </div>
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-12 left-0 right-0 px-24 flex justify-between items-center text-[10px] text-slate-700 font-black tracking-[0.4em] uppercase">
                    <span>NETWORK STABILITY: OPTIMAL</span>
                    <span>ENCRYPTION: AES-256</span>
                </div>
            </div>
        </div>
    );
};

export default Signup;
