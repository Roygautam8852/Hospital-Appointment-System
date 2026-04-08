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
    Stethoscope,
    ShieldCheck,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Star
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = (e) => {
        e.preventDefault();
        if (formData.name && formData.email) setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalLoading(true);
        const result = await register(formData);
        setLocalLoading(false);
        if (result.success) {
            navigate('/login?signup=success');
        }
    };

    const features = [
        "Book appointments with 500+ specialists",
        "Access your medical records securely",
        "Get prescriptions & reports online",
        "24/7 emergency support available",
        "HIPAA compliant data protection",
    ];

    return (
        <div className="h-screen w-full flex font-sans bg-white overflow-hidden">
            {/* Left: Form Panel */}
            <div className="w-full lg:w-[48%] h-full flex flex-col justify-center px-8 md:px-12 lg:px-16 relative overflow-hidden">
                {/* Back button */}
                <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors text-xs font-bold group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md mx-auto"
                >
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 mb-4 group w-fit">
                        <div className="h-9 w-9 border-2 border-emerald-500 rounded-full flex items-center justify-center p-0.5 group-hover:scale-110 transition-transform">
                            <div className="h-full w-full bg-emerald-50 rounded-full flex items-center justify-center">
                                <Stethoscope className="h-4 w-4 text-emerald-600" />
                            </div>
                        </div>
                        <div>
                            <p className="text-base font-bold text-emerald-600 leading-none">MediCare</p>
                            <p className="text-[9px] font-semibold text-slate-400 tracking-wide mt-0.5">Healthcare Solutions</p>
                        </div>
                    </Link>

                    <h2 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">Create your account</h2>
                    <p className="text-slate-500 text-sm mb-4">Join MediCare and take control of your health journey.</p>

                    {/* Step progress */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1.5">
                            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                {step > 1 ? <CheckCircle2 size={14} /> : '1'}
                            </div>
                            <span className="text-xs font-semibold text-slate-500 hidden sm:block">Basic Info</span>
                        </div>
                        <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-100'}`}></div>
                        <div className="flex items-center gap-1.5">
                            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                2
                            </div>
                            <span className="text-xs font-semibold text-slate-500 hidden sm:block">Security</span>
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3"
                            >
                                <AlertCircle size={17} className="text-rose-500 shrink-0" />
                                <p className="text-sm font-medium text-rose-600">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Google Sign Up */}
                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm mb-4 active:scale-95"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Sign up with Google
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-px bg-slate-100"></div>
                        <span className="text-xs font-semibold text-slate-400">or register with email</span>
                        <div className="flex-1 h-px bg-slate-100"></div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={nextStep}
                                className="space-y-3"
                            >
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={17} />
                                        <input
                                            name="name"
                                            type="text"
                                            required
                                            placeholder="e.g. Alexander Pierce"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-800 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={17} />
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-800 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Phone Number <span className="text-slate-400 normal-case font-medium">(optional)</span></label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={17} />
                                        <input
                                            name="phone"
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-800 font-medium"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-100 active:scale-95"
                                >
                                    Continue <ArrowRight size={16} />
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleSubmit}
                                className="space-y-3"
                            >
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={17} />
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            minLength={6}
                                            placeholder="Minimum 6 characters"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-800 font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Password strength */}
                                {formData.password && (
                                    <div className="flex items-center gap-1.5">
                                        {[1,2,3,4].map((i) => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                                                formData.password.length >= i * 3
                                                    ? i <= 2 ? 'bg-rose-400' : i === 3 ? 'bg-amber-400' : 'bg-emerald-500'
                                                    : 'bg-slate-100'
                                            }`}></div>
                                        ))}
                                        <span className="text-[10px] text-slate-400 font-medium ml-1 whitespace-nowrap">
                                            {formData.password.length < 6 ? 'Too short' : formData.password.length < 9 ? 'Fair' : formData.password.length < 12 ? 'Good' : 'Strong'}
                                        </span>
                                    </div>
                                )}

                                {/* Step 1 summary */}
                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <p className="text-xs font-bold text-emerald-700 mb-1">Registering as Patient</p>
                                    <p className="text-xs text-emerald-600 font-medium truncate">{formData.name} · {formData.email}</p>
                                </div>

                                <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <input type="checkbox" required id="policy" className="w-4 h-4 mt-0.5 rounded text-emerald-600 border-slate-300 cursor-pointer shrink-0" />
                                    <label htmlFor="policy" className="text-xs font-medium text-slate-500 cursor-pointer select-none leading-relaxed">
                                        I agree to the <span className="text-emerald-600 font-semibold">Health Data Privacy Policy</span> and <span className="text-emerald-600 font-semibold">Terms of Service</span>.
                                    </label>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="px-5 py-3.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-all active:scale-95 font-bold"
                                    >
                                        <ArrowLeft size={17} />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={localLoading}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-100 disabled:opacity-70 active:scale-95"
                                    >
                                        {localLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                            <> Create Account <CheckCircle2 size={16} /> </>
                                        )}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <p className="text-center text-sm text-slate-500 font-medium mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">Sign in</Link>
                    </p>
                </motion.div>
            </div>

            {/* Right: Visual Panel */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"
                        className="w-full h-full object-cover"
                        alt="Healthcare"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-emerald-950/90 to-slate-900/95"></div>
                    <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-white/10 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-[-10%] left-[5%] w-[40%] h-[40%] bg-emerald-300/20 rounded-full blur-[60px]"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center p-16 text-white w-full">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="h-14 w-14 bg-white/20 backdrop-blur-sm rounded-[1.5rem] flex items-center justify-center mb-5 border border-white/30 shadow-lg">
                            <ShieldCheck size={24} className="text-white" />
                        </div>

                        <h2 className="text-3xl font-bold mb-3 leading-tight tracking-tight">
                            Join 10,000+<br />Patients Today.
                        </h2>
                        <p className="text-emerald-100 text-sm font-medium leading-relaxed mb-6 max-w-sm">
                            Get instant access to top specialists, your medical history, and a healthier lifestyle — all from one dashboard.
                        </p>

                        <div className="space-y-2 mb-6">
                            {features.map((feat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.08 }}
                                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20"
                                >
                                    <div className="h-5 w-5 bg-emerald-400/30 rounded-md flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={11} className="text-emerald-200" />
                                    </div>
                                    <span className="text-sm font-medium text-white/90">{feat}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/20 w-fit">
                            <div className="flex -space-x-2">
                                {['a1','b2','c3','d4'].map((u, i) => (
                                    <img key={i} src={`https://i.pravatar.cc/32?u=${u}`} className="h-8 w-8 rounded-full border-2 border-emerald-600 object-cover" alt="" />
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-0.5 mb-0.5">
                                    {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="currentColor" className="text-yellow-300"/>)}
                                </div>
                                <p className="text-[11px] font-semibold text-emerald-100">Trusted by 10,000+ patients</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-5 border-t border-white/20 flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-emerald-200">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-emerald-300 rounded-full animate-pulse"></div>
                                Data Encrypted
                            </div>
                            <span>ISO 9001:2026</span>
                            <span>NABH Certified</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Signup;