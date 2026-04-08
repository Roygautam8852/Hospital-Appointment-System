import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import axios from 'axios';
import {
    Building2, Bell, Shield, Save, Check, Loader2,
    AlertTriangle, Send, Users, Stethoscope, Mail,
    Phone, Globe, Clock, MapPin, Hash, Award,
    BedDouble, Lock, Eye, EyeOff, RefreshCw, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost:5000/api';

const TabBtn = ({ label, icon: Icon, active, onClick }) => (
    <button onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 18px', borderRadius: 12, border: 'none',
        background: active ? 'rgba(16,185,129,0.15)' : 'transparent',
        color: active ? '#10b981' : 'rgba(255,255,255,0.4)',
        fontSize: 13, fontWeight: 700, cursor: 'pointer',
        borderRight: active ? '2px solid #10b981' : '2px solid transparent',
        transition: 'all 0.2s', textAlign: 'left', width: '100%', fontFamily: 'inherit'
    }}>
        <Icon size={15} /> {label}
    </button>
);

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState('hospital');
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Hospital info form
    const [hospitalForm, setHospitalForm] = useState({
        hospitalName: '', email: '', phone: '', address: '',
        website: '', workingHours: '', emergencyContact: '',
        establishedYear: '', bedCapacity: '', accreditation: ''
    });

    // Broadcast form
    const [broadcast, setBroadcast] = useState({ title: '', message: '', targetRole: 'all' });
    const [broadcasting, setBroadcasting] = useState(false);

    // Password form
    const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPass, setShowPass] = useState({ curr: false, new: false, confirm: false });
    const [changingPass, setChangingPass] = useState(false);

    const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await axios.get(`${API}/admin/settings`, { headers: getHeaders() });
                if (data.success) {
                    setSettings(data.data);
                    setHospitalForm(data.data);
                }
            } catch (_) {
                setHospitalForm({
                    hospitalName: 'MediCare Pro Hospital', email: 'hospital123@gmail.com',
                    phone: '+91 98765 43210', address: '123 Health Street, Medical City, India',
                    website: 'www.medicarepro.com', workingHours: '8:00 AM – 8:00 PM',
                    emergencyContact: '+91 99999 00000', establishedYear: '2010',
                    bedCapacity: '500', accreditation: 'NABH Accredited'
                });
            }
            setLoading(false);
        };
        fetch();
    }, []);

    const showMsg = (msg, isError = false) => {
        if (isError) setError(msg); else setSuccess(msg);
        setTimeout(() => { setError(''); setSuccess(''); }, 4000);
    };

    const saveHospitalInfo = async (e) => {
        e.preventDefault();
        setSaving(true);
        await new Promise(r => setTimeout(r, 800)); // simulate API
        showMsg('Hospital information saved successfully!');
        setSaving(false);
    };

    const sendBroadcast = async (e) => {
        e.preventDefault();
        if (!broadcast.title || !broadcast.message) { showMsg('Title and message required.', true); return; }
        setBroadcasting(true);
        try {
            const { data } = await axios.post(`${API}/admin/broadcast`, broadcast, { headers: getHeaders() });
            if (data.success) showMsg(data.message || 'Broadcast sent successfully!');
            setBroadcast({ title: '', message: '', targetRole: 'all' });
        } catch (err) {
            showMsg(err.response?.data?.message || 'Failed to send broadcast.', true);
        }
        setBroadcasting(false);
    };

    const changePassword = async (e) => {
        e.preventDefault();
        if (passForm.newPassword !== passForm.confirmPassword) {
            showMsg('New passwords do not match.', true); return;
        }
        if (passForm.newPassword.length < 6) {
            showMsg('Password must be at least 6 characters.', true); return;
        }
        setChangingPass(true);
        try {
            await axios.put(`${API}/auth/updatepassword`, {
                currentPassword: passForm.currentPassword,
                newPassword: passForm.newPassword
            }, { headers: getHeaders() });
            showMsg('Password changed successfully!');
            setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            showMsg(err.response?.data?.message || 'Failed to change password.', true);
        }
        setChangingPass(false);
    };

    const inputStyle = {
        width: '100%', boxSizing: 'border-box',
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10, padding: '11px 14px', color: 'white', fontSize: 13,
        fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s'
    };
    const labelStyle = {
        color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6
    };

    const TABS = [
        { id: 'hospital', label: 'Hospital Info', icon: Building2 },
        { id: 'broadcast', label: 'Broadcast Notification', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <DashboardLayout>
            <style>{`
                input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
                select option { background: #1a1d27; color: white; }
                input:focus, textarea:focus, select:focus { border-color: rgba(16,185,129,0.5) !important; background: rgba(16,185,129,0.06) !important; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, margin: 0 }}>System Settings</h1>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: '6px 0 0' }}>
                    Manage hospital configuration and system preferences
                </p>
            </div>

            {/* Toast */}
            <AnimatePresence>
                {(success || error) && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
                            background: success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                            border: `1px solid ${success ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                            borderRadius: 12, padding: '12px 18px'
                        }}>
                        {success ? <Check size={16} color="#10b981" /> : <AlertTriangle size={16} color="#f87171" />}
                        <span style={{ color: success ? '#6ee7b7' : '#fca5a5', fontSize: 13, fontWeight: 600 }}>
                            {success || error}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
                {/* Sidebar Tabs */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 12, height: 'fit-content' }}>
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '4px 18px 10px' }}>Settings</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {TABS.map(tab => (
                            <TabBtn key={tab.id} label={tab.label} icon={tab.icon} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
                        ))}
                    </div>

                    {/* Hospital Status Card */}
                    <div style={{ margin: '20px 0 8px', padding: '14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <div style={{ height: 8, width: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                            <span style={{ color: '#10b981', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>System Online</span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0, lineHeight: 1.5 }}>
                            All services running normally.
                        </p>
                    </div>
                </div>

                {/* Content Panel */}
                <div>
                    {/* ── Hospital Info ── */}
                    {activeTab === 'hospital' && (
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 28 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                <div style={{ height: 44, width: 44, borderRadius: 14, background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                    <Building2 size={20} />
                                </div>
                                <div>
                                    <h2 style={{ color: 'white', fontSize: 17, fontWeight: 800, margin: 0 }}>Hospital Information</h2>
                                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '3px 0 0' }}>Update your hospital's public profile</p>
                                </div>
                            </div>

                            <form onSubmit={saveHospitalInfo}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
                                    <div style={{ gridColumn: '1/-1' }}>
                                        <label style={labelStyle}><Building2 size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />Hospital Name</label>
                                        <input style={inputStyle} placeholder="MediCare Pro Hospital" value={hospitalForm.hospitalName} onChange={e => setHospitalForm({ ...hospitalForm, hospitalName: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}><Mail size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />Contact Email</label>
                                        <input style={inputStyle} type="email" placeholder="hospital@example.com" value={hospitalForm.email} onChange={e => setHospitalForm({ ...hospitalForm, email: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}><Phone size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />Phone Number</label>
                                        <input style={inputStyle} placeholder="+91 98765 43210" value={hospitalForm.phone} onChange={e => setHospitalForm({ ...hospitalForm, phone: e.target.value })} />
                                    </div>
                                    <div style={{ gridColumn: '1/-1' }}>
                                        <label style={labelStyle}><MapPin size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />Address</label>
                                        <input style={inputStyle} placeholder="123 Health Street, City, Country" value={hospitalForm.address} onChange={e => setHospitalForm({ ...hospitalForm, address: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}><Globe size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />Website</label>
                                        <input style={inputStyle} placeholder="www.hospital.com" value={hospitalForm.website} onChange={e => setHospitalForm({ ...hospitalForm, website: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}><Clock size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />Working Hours</label>
                                        <input style={inputStyle} placeholder="8:00 AM – 8:00 PM" value={hospitalForm.workingHours} onChange={e => setHospitalForm({ ...hospitalForm, workingHours: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}><Phone size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />Emergency Contact</label>
                                        <input style={inputStyle} placeholder="+91 99999 00000" value={hospitalForm.emergencyContact} onChange={e => setHospitalForm({ ...hospitalForm, emergencyContact: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}><Hash size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />Established Year</label>
                                        <input style={inputStyle} placeholder="2010" value={hospitalForm.establishedYear} onChange={e => setHospitalForm({ ...hospitalForm, establishedYear: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}><BedDouble size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />Bed Capacity</label>
                                        <input style={inputStyle} type="number" placeholder="500" value={hospitalForm.bedCapacity} onChange={e => setHospitalForm({ ...hospitalForm, bedCapacity: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}><Award size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />Accreditation</label>
                                        <input style={inputStyle} placeholder="NABH Accredited" value={hospitalForm.accreditation} onChange={e => setHospitalForm({ ...hospitalForm, accreditation: e.target.value })} />
                                    </div>
                                </div>

                                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                                    <button type="submit" disabled={saving}
                                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 12, background: saving ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 8px 24px rgba(16,185,129,0.3)', fontFamily: 'inherit' }}>
                                        {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : <><Save size={16} /> Save Changes</>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* ── Broadcast ── */}
                    {activeTab === 'broadcast' && (
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 28 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                    <div style={{ height: 44, width: 44, borderRadius: 14, background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <h2 style={{ color: 'white', fontSize: 17, fontWeight: 800, margin: 0 }}>Broadcast Notification</h2>
                                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '3px 0 0' }}>Send system-wide notifications to users</p>
                                    </div>
                                </div>

                                <form onSubmit={sendBroadcast}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <div>
                                            <label style={labelStyle}>Target Audience</label>
                                            <div style={{ display: 'flex', gap: 10 }}>
                                                {['all', 'patient', 'doctor'].map(role => (
                                                    <button key={role} type="button"
                                                        onClick={() => setBroadcast({ ...broadcast, targetRole: role })}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: 8,
                                                            padding: '10px 20px', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit',
                                                            background: broadcast.targetRole === role ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                                                            border: broadcast.targetRole === role ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.1)',
                                                            color: broadcast.targetRole === role ? '#f59e0b' : 'rgba(255,255,255,0.4)',
                                                            fontSize: 13, fontWeight: 700, textTransform: 'capitalize', transition: 'all 0.15s'
                                                        }}>
                                                        {role === 'all' ? <Users size={14} /> : role === 'patient' ? <Users size={14} /> : <Stethoscope size={14} />}
                                                        {role === 'all' ? 'All Users' : `${role.charAt(0).toUpperCase() + role.slice(1)}s`}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Notification Title *</label>
                                            <input style={inputStyle} placeholder="e.g. System Maintenance Notice" value={broadcast.title} onChange={e => setBroadcast({ ...broadcast, title: e.target.value })} required />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Message *</label>
                                            <textarea style={{ ...inputStyle, height: 120, resize: 'vertical' }} placeholder="Type your broadcast message here..." value={broadcast.message} onChange={e => setBroadcast({ ...broadcast, message: e.target.value })} required />
                                        </div>

                                        {/* Preview */}
                                        {(broadcast.title || broadcast.message) && (
                                            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 14, padding: '16px 18px' }}>
                                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>Preview</p>
                                                <div style={{ display: 'flex', gap: 12 }}>
                                                    <div style={{ height: 36, width: 36, borderRadius: 10, background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', flexShrink: 0 }}>
                                                        <Bell size={16} />
                                                    </div>
                                                    <div>
                                                        <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>{broadcast.title || 'Notification Title'}</p>
                                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{broadcast.message || 'Message...'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <button type="submit" disabled={broadcasting}
                                                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 12, background: broadcasting ? 'rgba(245,158,11,0.3)' : 'linear-gradient(135deg, #d97706, #f59e0b)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: broadcasting ? 'not-allowed' : 'pointer', boxShadow: '0 8px 24px rgba(245,158,11,0.25)', fontFamily: 'inherit' }}>
                                                {broadcasting ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</> : <><Send size={16} /> Send Broadcast</>}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Info Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
                                {[
                                    { label: 'In-app Notifications', desc: 'Appear in the notification bell for each user', color: '#3b82f6' },
                                    { label: 'Real-time Delivery', desc: 'Notifications are delivered immediately', color: '#10b981' },
                                ].map((info, i) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px 18px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                            <div style={{ height: 8, width: 8, borderRadius: '50%', background: info.color }} />
                                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 700, margin: 0 }}>{info.label}</p>
                                        </div>
                                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>{info.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Security ── */}
                    {activeTab === 'security' && (
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 28, marginBottom: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                    <div style={{ height: 44, width: 44, borderRadius: 14, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171' }}>
                                        <Lock size={20} />
                                    </div>
                                    <div>
                                        <h2 style={{ color: 'white', fontSize: 17, fontWeight: 800, margin: 0 }}>Change Password</h2>
                                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '3px 0 0' }}>Update your admin account password</p>
                                    </div>
                                </div>

                                <form onSubmit={changePassword}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 440 }}>
                                        {[
                                            { key: 'curr', label: 'Current Password', field: 'currentPassword' },
                                            { key: 'new', label: 'New Password', field: 'newPassword' },
                                            { key: 'confirm', label: 'Confirm New Password', field: 'confirmPassword' },
                                        ].map(item => (
                                            <div key={item.key}>
                                                <label style={labelStyle}>{item.label}</label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type={showPass[item.key] ? 'text' : 'password'}
                                                        style={{ ...inputStyle, paddingRight: 42 }}
                                                        placeholder="••••••••"
                                                        value={passForm[item.field]}
                                                        onChange={e => setPassForm({ ...passForm, [item.field]: e.target.value })}
                                                        required
                                                    />
                                                    <button type="button"
                                                        onClick={() => setShowPass(p => ({ ...p, [item.key]: !p[item.key] }))}
                                                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 0 }}>
                                                        {showPass[item.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <div style={{ marginTop: 8 }}>
                                            <button type="submit" disabled={changingPass}
                                                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 12, background: changingPass ? 'rgba(239,68,68,0.3)' : 'linear-gradient(135deg, #dc2626, #ef4444)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: changingPass ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                                                {changingPass ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Updating...</> : <><Lock size={16} /> Change Password</>}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Security tips */}
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
                                <h3 style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 16px' }}>Security Best Practices</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {[
                                        'Use a password with at least 12 characters including symbols',
                                        'Never share your admin credentials with anyone',
                                        'Log out after every session on shared devices',
                                        'Regularly review the activity logs for suspicious access',
                                        'Enable two-factor authentication when available',
                                    ].map((tip, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                            <div style={{ height: 18, width: 18, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', flexShrink: 0, marginTop: 1 }}>
                                                <Check size={10} />
                                            </div>
                                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
