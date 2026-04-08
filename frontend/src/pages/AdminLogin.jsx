import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HeartPulse, Mail, Lock, Eye, EyeOff, ShieldCheck,
    Loader2, AlertCircle, ArrowLeft, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === 'admin') navigate('/admin/dashboard');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Please enter credentials.'); return; }
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (result.success) {
            if (result.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                setError('Access denied – Admin credentials required.');
                setShake(true);
                setTimeout(() => setShake(false), 600);
            }
        } else {
            setError(result.message || 'Invalid credentials.');
            setShake(true);
            setTimeout(() => setShake(false), 600);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#060a12', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

            {/* Animated background mesh */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '55%', height: '55%', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
                <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
                <div style={{ position: 'absolute', top: '40%', left: '60%', width: '30%', height: '30%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)' }} />
                {/* Grid overlay */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', opacity: 0.5 }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={shake ? 'animate-shake' : ''}
                style={{ width: '100%', maxWidth: 460, padding: '0 20px', position: 'relative', zIndex: 10 }}
            >
                {/* Back link */}
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.35)', fontSize: 13, fontWeight: 600, marginBottom: 24, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                >
                    <ArrowLeft size={14} /> Back to Home
                </Link>

                {/* Card */}
                <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '40px 40px 36px', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 36 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: 18, marginBottom: 20, boxShadow: '0 12px 32px rgba(16,185,129,0.4)' }}>
                            <ShieldCheck size={30} color="white" />
                        </div>
                        <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>Admin Portal</h1>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Authorized personnel only</p>
                    </div>

                    {/* Hospital badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '10px 14px', marginBottom: 28 }}>
                        <Building2 size={16} color="#34d399" />
                        <div>
                            <p style={{ color: '#34d399', fontSize: 11, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>MediCare Pro Hospital</p>
                            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, margin: 0 }}>Hospital Management System</p>
                        </div>
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
                            <span style={{ color: '#10b981', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>Secure</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Email field */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 700, marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                Admin Email
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                                <input
                                    id="admin-email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="hospital123@gmail.com"
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 12, padding: '13px 14px 13px 42px',
                                        color: 'white', fontSize: 14, fontWeight: 500,
                                        outline: 'none', transition: 'all 0.2s',
                                        fontFamily: 'inherit'
                                    }}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(16,185,129,0.6)'; e.target.style.background = 'rgba(16,185,129,0.08)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 700, marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                                <input
                                    id="admin-password"
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 12, padding: '13px 44px 13px 42px',
                                        color: 'white', fontSize: 14, fontWeight: 500,
                                        outline: 'none', transition: 'all 0.2s',
                                        fontFamily: 'inherit'
                                    }}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(16,185,129,0.6)'; e.target.style.background = 'rgba(16,185,129,0.08)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 0 }}>
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 20 }}>
                                    <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0 }} />
                                    <span style={{ color: '#fca5a5', fontSize: 13, fontWeight: 500 }}>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit button */}
                        <button
                            id="admin-login-btn"
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                                background: loading ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg, #10b981, #059669)',
                                color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                boxShadow: loading ? 'none' : '0 8px 24px rgba(16,185,129,0.4)',
                                transition: 'all 0.2s', fontFamily: 'inherit', letterSpacing: '-0.2px'
                            }}
                            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {loading ? <><Loader2 size={18} className="animate-spin" /> Authenticating...</> : <><ShieldCheck size={18} /> Access Admin Dashboard</>}
                        </button>
                    </form>

                    {/* Hint */}
                    <div style={{ textAlign: 'center', marginTop: 24, padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, margin: 0, fontWeight: 500 }}>
                            🔐 This portal is restricted to authorized hospital administrators only.
                        </p>
                    </div>
                </div>

                {/* Footer links */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 20 }}>
                    <Link to="/login" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                    >Patient Login</Link>
                    <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: 12 }}>•</span>
                    <Link to="/doctor-login" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                    >Doctor Login</Link>
                </div>
            </motion.div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-8px); }
                    75% { transform: translateX(8px); }
                }
                input::placeholder { color: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
};

export default AdminLogin;
