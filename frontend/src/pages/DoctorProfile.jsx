import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    User, Mail, Phone, MapPin, Camera, Save, X, Edit2,
    Stethoscope, Award, Star, Calendar, DollarSign,
    Key, Lock, CheckCircle, AlertTriangle, Upload, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost:5000/api/auth';

const inp = {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: 'white', fontSize: 13, padding: '10px 14px',
    outline: 'none', width: '100%', boxSizing: 'border-box',
};
const inpFocus = { ...inp, border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.07)' };
const labelSt = { color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 };
const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 };

const Toast = ({ msg, type, onClose }) => (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 14, fontWeight: 700, fontSize: 13, color: 'white', background: type === 'success' ? '#059669' : '#dc2626', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', cursor: 'pointer' }}
        onClick={onClose}>
        {type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />} {msg}
    </motion.div>
);

const DarkField = ({ label, value, onChange, editing, type = 'text', placeholder }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <label style={labelSt}>{label}</label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                readOnly={!editing}
                placeholder={editing ? (placeholder || `Enter ${label.toLowerCase()}`) : '—'}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={editing ? (focused ? inpFocus : inp) : { ...inp, background: 'rgba(255,255,255,0.02)', color: value ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.04)' }}
            />
        </div>
    );
};

export default function DoctorProfile() {
    const { user, setUser } = useAuth();
    const fileRef = useRef(null);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const buildForm = (u) => ({
        name: u?.name || '',
        email: u?.email || '',
        phone: u?.phone || '',
        about: u?.about || '',
        specialization: u?.specialization || '',
        experience: u?.experience || '',
        consultationFee: u?.consultationFee || '',
    });

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(() => buildForm(user));
    const [saved, setSaved] = useState(() => buildForm(user));
    const [saving, setSaving] = useState(false);
    const [avatarPrev, setAvatarPrev] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState(null);
    const [showPwModal, setShowPwModal] = useState(false);
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pwSaving, setPwSaving] = useState(false);
    const [fullProfile, setFullProfile] = useState(null);

    useEffect(() => {
        const fetchFull = async () => {
            try {
                const { data } = await axios.get(`${API}/me`, { headers });
                setFullProfile(data.user);
                const b = buildForm(data.user);
                setForm(b); setSaved(b);
            } catch (_) {}
        };
        fetchFull();
    }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data } = await axios.put(`${API}/updateprofile`, form, { headers });
            setUser(data.user);
            setSaved(buildForm(data.user));
            setEditing(false);
            showToast('Profile updated!');
        } catch (e) {
            showToast(e.response?.data?.message || 'Update failed', 'error');
        } finally { setSaving(false); }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarPrev(URL.createObjectURL(file));
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('avatar', file);
            const { data } = await axios.post(`${API}/uploadavatar`, fd, {
                headers: { ...headers, 'Content-Type': 'multipart/form-data' }
            });
            setUser(data.user);
            showToast('Photo updated!');
        } catch (_) { setAvatarPrev(null); showToast('Upload failed', 'error'); }
        finally { setUploading(false); }
    };

    const handlePwChange = async () => {
        if (pwForm.newPassword !== pwForm.confirmPassword) { showToast('Passwords do not match', 'error'); return; }
        if (pwForm.newPassword.length < 6) { showToast('Min 6 characters required', 'error'); return; }
        setPwSaving(true);
        try {
            await axios.put(`${API}/updatepassword`, { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }, { headers });
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPwModal(false);
            showToast('Password changed!');
        } catch (e) { showToast(e.response?.data?.message || 'Failed to change password', 'error'); }
        finally { setPwSaving(false); }
    };

    const avatarSrc = avatarPrev ||
        (user?.profileImage && user.profileImage !== 'default-avatar.png'
            ? user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000/${user.profileImage}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'D')}&background=3b82f6&color=fff&bold=true&size=120`);

    const profileData = fullProfile || user;

    return (
        <DashboardLayout>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{ height: 8, width: 8, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px #3b82f6' }} />
                    <span style={{ color: '#3b82f6', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Account</span>
                </div>
                <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, margin: 0 }}>My Profile</h1>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginTop: 4 }}>Manage your professional profile and account settings</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, alignItems: 'start' }}>
                {/* Left — Avatar + Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Avatar Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ ...card, textAlign: 'center' }}>
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
                            <div style={{ height: 96, width: 96, borderRadius: 24, overflow: 'hidden', border: '3px solid rgba(59,130,246,0.4)', background: 'rgba(59,130,246,0.1)', margin: '0 auto', position: 'relative' }}>
                                {uploading && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                                        <Upload size={20} style={{ color: 'white' }} />
                                    </div>
                                )}
                                <img src={avatarSrc} alt={user?.name} style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'D')}&background=3b82f6&color=fff&bold=true`; }} />
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                            <button onClick={() => fileRef.current?.click()}
                                style={{ position: 'absolute', bottom: -4, right: -4, height: 30, width: 30, borderRadius: 9, background: '#3b82f6', border: '2px solid #0c0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                                <Camera size={13} />
                            </button>
                        </div>
                        <p style={{ color: 'white', fontSize: 16, fontWeight: 800, margin: '0 0 4px' }}>{user?.name || 'Doctor'}</p>
                        <p style={{ color: '#93c5fd', fontSize: 12, fontWeight: 600, margin: '0 0 12px' }}>{profileData?.specialization || 'Specialist'}</p>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: 'rgba(59,130,246,0.2)', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Doctor</span>
                            <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: 'rgba(16,185,129,0.15)', color: '#6ee7b7' }}>Verified</span>
                        </div>
                    </motion.div>

                    {/* Doctor Stats */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }} style={card}>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>Doctor Stats</p>
                        {[
                            { label: 'Specialization', value: profileData?.specialization || '—', icon: Stethoscope, color: '#3b82f6' },
                            { label: 'Experience', value: profileData?.experience ? `${profileData.experience} years` : '—', icon: Award, color: '#f59e0b' },
                            { label: 'Rating', value: profileData?.ratings ? `${profileData.ratings} ★` : '4.8 ★', icon: Star, color: '#f59e0b' },
                            { label: 'Consultation Fee', value: profileData?.consultationFee ? `₹${profileData.consultationFee}` : '—', icon: DollarSign, color: '#10b981' },
                        ].map((s, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                                <div style={{ height: 34, width: 34, borderRadius: 10, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                                    <s.icon size={15} />
                                </div>
                                <div>
                                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{s.label}</p>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 700, margin: '2px 0 0' }}>{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} style={card}>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Security</p>
                        <button onClick={() => setShowPwModal(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, cursor: 'pointer', color: 'rgba(255,255,255,0.6)', transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)'; e.currentTarget.style.color = '#93c5fd'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                            <div style={{ height: 34, width: 34, borderRadius: 10, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93c5fd' }}>
                                <Key size={14} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Change Password</p>
                                <p style={{ fontSize: 11, opacity: 0.6, margin: '2px 0 0' }}>Update account security</p>
                            </div>
                        </button>
                    </motion.div>
                </div>

                {/* Right — Edit Form */}
                <div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                            <div>
                                <h3 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0 }}>Professional Information</h3>
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: '4px 0 0' }}>Your profile details shown to patients</p>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {editing ? (
                                    <>
                                        <button onClick={() => { setForm({ ...saved }); setEditing(false); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                            <X size={13} /> Cancel
                                        </button>
                                        <button onClick={handleSave} disabled={saving}
                                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'rgba(59,130,246,0.25)', border: '1px solid rgba(59,130,246,0.4)', borderRadius: 10, color: '#93c5fd', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                            {saving ? <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setEditing(true)}
                                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                        <Edit2 size={13} /> Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <DarkField label="Full Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} editing={editing} />
                                <DarkField label="Email Address" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} editing={editing} type="email" />
                                <DarkField label="Phone Number" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} editing={editing} />
                                <DarkField label="Specialization" value={form.specialization} onChange={v => setForm(f => ({ ...f, specialization: v }))} editing={editing} />
                                <DarkField label="Experience (years)" value={String(form.experience)} onChange={v => setForm(f => ({ ...f, experience: v }))} editing={editing} type="number" />
                                <DarkField label="Consultation Fee (₹)" value={String(form.consultationFee)} onChange={v => setForm(f => ({ ...f, consultationFee: v }))} editing={editing} type="number" />
                            </div>
                            <div>
                                <label style={labelSt}>About / Bio</label>
                                <textarea value={form.about} onChange={e => setForm(f => ({ ...f, about: e.target.value }))} readOnly={!editing} rows={4}
                                    placeholder={editing ? 'Write a short bio about yourself...' : '—'}
                                    style={{ ...inp, resize: 'vertical', ...(editing ? {} : { background: 'rgba(255,255,255,0.02)', color: form.about ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.04)' }) }} />
                            </div>
                        </div>

                        {editing && (
                            <div style={{ marginTop: 18, padding: 14, background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 12 }}>
                                <p style={{ color: '#93c5fd', fontSize: 12, fontWeight: 600, margin: 0 }}>📝 Editing mode active — changes will be saved when you click Save.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Change Password Modal */}
            <AnimatePresence>
                {showPwModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={e => { if (e.target === e.currentTarget) setShowPwModal(false); }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, width: '100%', maxWidth: 420, padding: 28 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ height: 40, width: 40, borderRadius: 12, background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93c5fd' }}>
                                        <Key size={17} />
                                    </div>
                                    <div>
                                        <p style={{ color: 'white', fontSize: 15, fontWeight: 800, margin: 0 }}>Change Password</p>
                                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '2px 0 0' }}>Update your account security</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowPwModal(false)} style={{ height: 32, width: 32, borderRadius: 9, background: 'rgba(255,255,255,0.07)', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={15} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirmPassword', 'Confirm New Password']].map(([k, lbl]) => (
                                    <div key={k}>
                                        <label style={labelSt}>{lbl}</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, ...inp }}>
                                            <Lock size={14} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                                            <input type="password" value={pwForm[k]} onChange={e => setPwForm(p => ({ ...p, [k]: e.target.value }))}
                                                placeholder={`Enter ${lbl.toLowerCase()}`}
                                                style={{ background: 'none', border: 'none', outline: 'none', color: 'white', fontSize: 13, width: '100%' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                                <button onClick={() => setShowPwModal(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button onClick={handlePwChange} disabled={pwSaving} style={{ flex: 2, padding: '12px', background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.35)', borderRadius: 12, color: '#93c5fd', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    {pwSaving ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Key size={14} />}
                                    {pwSaving ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </DashboardLayout>
    );
}
