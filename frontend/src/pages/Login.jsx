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
        <div className="h-screen w-full flex overflow-hidden bg-slate-50 relative font-['Plus_Jakarta_Sans',sans-serif]">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/5 rounded-full blur-[120px] pointer-events-none transition-all duration-1000"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Go Back Button */}
            <Link
                to="/"
                className="absolute top-8 left-8 z-50 flex items-center justify-center w-12 h-12 bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl text-slate-600 hover:bg-white hover:text-primary-600 transition-all shadow-xl shadow-black/5 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>

            {/* Form Side */}
            <div className="w-full lg:w-[45%] h-full flex flex-col justify-center items-center p-8 relative z-10 bg-white/20 backdrop-blur-3xl border-r border-white/40">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-[420px]"
                >
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-4 mb-12 group self-center lg:self-start">
                        <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-200 group-hover:rotate-6 transition-all duration-500">
                            <HeartPulse className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-slate-900 leading-none tracking-tighter">MediCare</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Health Eco-System</span>
                        </div>
                    </Link>

                    {/* Header */}
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Welcome Back</h2>
                        <p className="text-slate-500 font-medium">Please enter your authorization keys to continue.</p>
                    </div>

                    <AnimatePresence>
                        {isSignupSuccess && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-8 p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4"
                            >
                                <div className="h-12 w-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[14px] font-black text-emerald-900 leading-tight">Verification Success</p>
                                    <p className="text-xs text-emerald-700 font-bold opacity-80">You can now access your account.</p>
                                </div>
                            </motion.div>
                        )}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-600"
                            >
                                <AlertCircle size={20} className="shrink-0" />
                                <p className="text-sm font-bold">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 group">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Universal ID</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-14 pr-6 py-4.5 bg-white border border-slate-100 rounded-2xl focus:ring-8 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-slate-900 text-sm shadow-xl shadow-black/[0.02]"
                                    placeholder="patient@id.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Security Key</label>
                                <a href="#" className="text-[10px] font-black text-primary-600 hover:tracking-widest transition-all">RECOVER KEY</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-14 pr-6 py-4.5 bg-white border border-slate-100 rounded-2xl focus:ring-8 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-slate-900 text-sm shadow-xl shadow-black/[0.02]"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-1">
                            <input type="checkbox" id="rem" className="w-5 h-5 rounded-lg text-primary-600 focus:ring-primary-600 border-slate-200 cursor-pointer transition-all" />
                            <label htmlFor="rem" className="text-xs font-bold text-slate-500 cursor-pointer select-none">Trust this device for 30 days</label>
                        </div>

                        <button
                            type="submit"
                            disabled={localLoading}
                            className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-black tracking-widest uppercase text-[11px] shadow-2xl shadow-slate-900/10 hover:shadow-primary-600/20 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 group"
                        >
                            {localLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    Authorize Session
                                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100 text-center lg:text-left">
                        <p className="text-slate-500 font-bold text-sm">
                            New to the infrastructure? {' '}
                            <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-black uppercase tracking-widest text-xs ml-2 hover:underline decoration-2 underline-offset-4">Join Network</Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Branding Section (Mesh Visuals) */}
            <div className="hidden lg:flex flex-1 h-full bg-slate-900 overflow-hidden relative">
                {/* Mesh Gradient Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"
                        className="w-full h-full object-cover opacity-40 grayscale-[0.5]"
                        alt="Hospital"
                    />
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-600/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-20%] left-[10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[100px] transition-all duration-1000"></div>
                </div>

                <div className="relative z-10 w-full flex flex-col justify-center p-24">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="max-w-xl"
                    >
                        <div className="h-20 w-20 bg-primary-600 rounded-[2.5rem] flex items-center justify-center text-white mb-12 shadow-2xl shadow-primary-600/40 transform -rotate-6 hover:rotate-0 transition-all duration-700">
                            <ShieldCheck size={36} />
                        </div>
                        <h1 className="text-7xl font-black text-white leading-[1.1] mb-10 tracking-tighter">
                            Advanced <br />
                            <span className="text-primary-500">Security</span> <br />
                            Protocols.
                        </h1>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-md">
                            Managing critical health data with enterprise-level encryption and zero-trust architecture.
                        </p>

                        <div className="flex items-center gap-10 mt-16 pt-16 border-t border-white/10">
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-white">99.9%</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Uptime Record</span>
                            </div>
                            <div className="h-10 w-px bg-white/10"></div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-white">AES-256</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bit Encryption</span>
                            </div>
                            <div className="h-10 w-px bg-white/10"></div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-white text-emerald-500">HIPAA</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Compliance</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-12 left-0 right-0 px-24 flex justify-between items-center text-[10px] text-slate-600 font-black tracking-[0.3em] uppercase">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        SESSION SECURED
                    </div>
                    <div className="text-slate-700">ISO 27001 : 2026 CERTIFIED</div>
                </div>
            </div>
        </div>
    );
};

export default Login;
