import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle, HeartPulse, ShieldCheck, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useAuth();
    const [localLoading, setLocalLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isSignupSuccess = new URLSearchParams(location.search).get('signup') === 'success';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalLoading(true);
        const result = await login(email, password);
        setLocalLoading(false);
        if (result.success) {
            navigate(`/${result.user.role}/dashboard`);
        }
    };

    return (
        <div className="h-screen w-full flex overflow-hidden bg-white relative">
            {/* Go Back Button */}
            <Link
                to="/"
                className="absolute top-5 left-5 z-20 flex items-center justify-center w-10 h-10 bg-white/50 backdrop-blur-md border border-slate-200 rounded-full text-slate-600 hover:bg-white hover:text-primary-600 transition-all shadow-sm group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>

            {/* Left Side: Form Section */}
            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center p-6 sm:p-10 bg-slate-50/30">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[380px] flex flex-col items-center lg:items-start"
                >
                    {/* Success Message Banner */}
                    <AnimatePresence>
                        {isSignupSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 shadow-sm shadow-emerald-100"
                            >
                                <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div>
                                    <p className="text-[13px] font-black text-emerald-900 leading-tight">Registration Successful!</p>
                                    <p className="text-[11px] text-emerald-600 font-bold">Please authorize with your credentials.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2 mb-5 group">
                        <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-200 group-hover:scale-110 transition-transform">
                            <HeartPulse className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-black text-slate-900 tracking-tighter">CAREPULSE</span>
                    </Link>

                    <div className="mb-6 text-center lg:text-left">
                        <h2 className="text-2xl font-black text-slate-900 mb-1">Welcome Back</h2>
                        <p className="text-sm text-slate-500 font-medium">Enter your credentials to access your dashboard</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="w-full mb-4 p-3 rounded-xl bg-red-50 text-red-600 flex items-center gap-2.5 border border-red-100 overflow-hidden"
                            >
                                <AlertCircle size={16} className="shrink-0" />
                                <p className="text-xs font-bold leading-tight">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email System</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 outline-none transition-all font-medium text-slate-900 text-sm shadow-sm"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Key</label>
                                <a href="#" className="text-[9px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-wider">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 outline-none transition-all font-medium text-slate-900 text-sm shadow-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-1 pb-1">
                            <input type="checkbox" id="rem" className="w-3.5 h-3.5 rounded text-primary-600 focus:ring-primary-600 border-slate-200 cursor-pointer" />
                            <label htmlFor="rem" className="text-[11px] font-bold text-slate-500 cursor-pointer select-none">Remember this session</label>
                        </div>

                        <button
                            type="submit"
                            disabled={localLoading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-black tracking-widest uppercase text-[10px] shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-70 group"
                        >
                            {localLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                <>
                                    Authorize Login
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 w-full text-center lg:text-left">
                        <p className="text-slate-500 font-bold text-xs">
                            New member? {' '}
                            <Link to="/signup" className="text-primary-600 hover:text-primary-700 decoration-2 underline-offset-4 font-black">Join Network</Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Branding Section (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 h-full bg-slate-900 overflow-hidden relative">
                {/* Visual Background */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"
                        className="w-full h-full object-cover opacity-60 grayscale-[0.3]"
                        alt="Hospital"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-slate-900/80 to-slate-950"></div>
                </div>

                <div className="relative z-10 w-full flex flex-col justify-center p-20">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-md"
                    >
                        <div className="h-14 w-14 bg-primary-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-primary-900/40">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-5xl font-black text-white leading-tight mb-8">
                            Modern <br />
                            Healthcare <br />
                            <span className="text-primary-500 underline decoration-primary-500 underline-offset-8">Infrastructure.</span>
                        </h1>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed">
                            Access world-class medical management tools. Securely manage patient data, schedules, and clinical operations with zero friction.
                        </p>
                    </motion.div>

                    <div className="absolute bottom-10 left-20 right-20 flex justify-between items-center text-[10px] text-slate-500 font-black tracking-widest uppercase opacity-50">
                        <span>ISO 27001 SECURE</span>
                        <span>HIPAA COMPLIANT DEVICE</span>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
            </div>
        </div>
    );
};

export default Login;
