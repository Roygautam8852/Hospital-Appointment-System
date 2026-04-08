import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle, Stethoscope, ArrowRight, CheckCircle2, ArrowLeft, Heart, Shield, Users, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user: ctxUser, error } = useAuth();
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
                    <Link to="/" className="flex items-center gap-2.5 mb-5 group w-fit">
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

                    <h2 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">Welcome back</h2>
                    <p className="text-slate-500 text-sm mb-5">Sign in to your patient account to continue.</p>

                    <AnimatePresence>
                        {isSignupSuccess && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3"
                            >
                                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                                <p className="text-sm font-semibold text-emerald-700">Account created! You can now sign in.</p>
                            </motion.div>
                        )}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3"
                            >
                                <AlertCircle size={17} className="text-rose-500 shrink-0" />
                                <p className="text-sm font-medium text-rose-600">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Google Sign In */}
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
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-px bg-slate-100"></div>
                        <span className="text-xs font-semibold text-slate-400">or sign in with email</span>
                        <div className="flex-1 h-px bg-slate-100"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={17} />
                                <input
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-800 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                                <a href="#" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={17} />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-800 font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <input type="checkbox" id="remember" className="w-4 h-4 rounded text-emerald-600 border-slate-300 cursor-pointer" />
                            <label htmlFor="remember" className="text-xs font-medium text-slate-500 cursor-pointer select-none">Keep me signed in for 30 days</label>
                        </div>

                        <button
                            type="submit"
                            disabled={localLoading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-100 disabled:opacity-70 active:scale-95"
                        >
                            {localLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                <> Sign In <ArrowRight size={16} /> </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 font-medium mt-4">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">Create account</Link>
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400 font-medium">
                            Are you a medical professional?{' '}
                            <Link to="/doctor-login" className="text-slate-600 font-bold hover:text-emerald-600 transition-colors underline underline-offset-2">Doctor Portal →</Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right: Visual Panel — Emerald theme matching landing page */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"
                        className="w-full h-full object-cover"
                        alt="Hospital"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/90 via-emerald-600/85 to-teal-700/90"></div>
                    <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-white/10 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-[-10%] left-[5%] w-[40%] h-[40%] bg-emerald-300/20 rounded-full blur-[60px]"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center p-16 text-white w-full">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="h-14 w-14 bg-white/20 backdrop-blur-sm rounded-[1.5rem] flex items-center justify-center mb-8 border border-white/30 shadow-lg">
                            <Shield size={24} className="text-white" />
                        </div>

                        <h2 className="text-4xl font-bold mb-4 leading-tight tracking-tight">
                            Your Health,<br />Our Priority.
                        </h2>
                        <p className="text-emerald-100 text-sm font-medium leading-relaxed mb-10 max-w-sm">
                            Access your appointments, medical records, and prescriptions — all in one secure, trusted place.
                        </p>

                        <div className="space-y-3 mb-10">
                            {[
                                { icon: Heart, text: '500+ Certified Specialists' },
                                { icon: Clock, text: '24/7 Available Appointments' },
                                { icon: Shield, text: 'HIPAA Compliant & Secure' },
                                { icon: Users, text: '10,000+ Patients Served' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20"
                                >
                                    <div className="h-7 w-7 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                        <item.icon size={13} className="text-white" />
                                    </div>
                                    <span className="text-sm font-semibold text-white/90">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-white/20 flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-emerald-200">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-emerald-300 rounded-full animate-pulse"></div>
                                Session Secured
                            </div>
                            <span>AES-256 Encrypted</span>
                            <span>NABH Certified</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
