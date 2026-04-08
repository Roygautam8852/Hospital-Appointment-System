import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle, Stethoscope, ArrowRight, ArrowLeft, ShieldCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error } = useAuth();
    const [localLoading, setLocalLoading] = useState(false);
    const navigate = useNavigate();

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
        <div className="h-screen w-full flex font-sans overflow-hidden">
            {/* Left: Dark Professional Panel */}
            <div className="hidden lg:flex w-[45%] h-full relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&q=80&w=1200"
                        className="w-full h-full object-cover opacity-20"
                        alt="Doctor"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 to-slate-800/90"></div>
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-slate-600/20 rounded-full blur-[80px]"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center p-16 text-white w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="h-14 w-14 bg-emerald-600/20 border border-emerald-500/30 rounded-[1.5rem] flex items-center justify-center mb-5">
                            <Stethoscope size={26} className="text-emerald-400" />
                        </div>

                        <h2 className="text-3xl font-bold mb-3 leading-tight tracking-tight text-white">
                            Medical<br />Professional Portal
                        </h2>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed mb-7 max-w-sm">
                            Secure access for verified doctors and medical staff. Your credentials are provided by the MediCare administration team.
                        </p>

                        <div className="space-y-3">
                            {[
                                'View & manage your patient appointments',
                                'Write and issue digital prescriptions',
                                'Access patient medical history',
                                'Update your availability schedule',
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className="flex items-center gap-3 text-slate-300 text-sm"
                                >
                                    <div className="h-5 w-5 bg-emerald-500/20 border border-emerald-500/30 rounded-md flex items-center justify-center shrink-0">
                                        <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full"></div>
                                    </div>
                                    {item}
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-slate-600 font-medium">
                            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            Secure connection · AES-256 encrypted
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="w-full lg:w-[55%] h-full flex flex-col justify-center px-8 md:px-12 lg:px-16 relative bg-white overflow-hidden">
                <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors text-xs font-bold group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md mx-auto"
                >
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 mb-5 group w-fit">
                        <div className="h-9 w-9 border-2 border-emerald-500 rounded-full flex items-center justify-center p-0.5">
                            <div className="h-full w-full bg-emerald-50 rounded-full flex items-center justify-center">
                                <Stethoscope className="h-4 w-4 text-emerald-600" />
                            </div>
                        </div>
                        <div>
                            <p className="text-base font-bold text-emerald-600 leading-none">MediCare</p>
                            <p className="text-[9px] font-semibold text-slate-400 tracking-wide mt-0.5">Doctor & Admin Portal</p>
                        </div>
                    </Link>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full mb-4">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-700">Verified Medical Staff Only</span>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">Doctor Sign In</h2>
                    <p className="text-slate-500 text-sm mb-4">Use the credentials provided by your administrator.</p>

                    {/* Info notice */}
                    <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4">
                        <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Doctor accounts are created by the MediCare admin team. If you don't have credentials yet, please contact your hospital administrator.
                        </p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3"
                            >
                                <AlertCircle size={17} className="text-rose-500 shrink-0" />
                                <p className="text-sm font-medium text-rose-600">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={17} />
                                <input
                                    type="email"
                                    required
                                    placeholder="doctor@medicare.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm text-slate-800 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
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

                        <button
                            type="submit"
                            disabled={localLoading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-200 disabled:opacity-70 active:scale-95"
                        >
                            {localLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                <> Access Portal <ArrowRight size={16} /> </>
                            )}
                        </button>
                    </form>

                    <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400 font-medium">
                            Are you a patient?{' '}
                            <Link to="/login" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">Patient Login →</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DoctorLogin;
