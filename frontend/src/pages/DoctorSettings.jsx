import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import {
    Bell, Moon, Sun, Shield, Globe, Clock, Calendar,
    Volume2, VolumeX, Eye, EyeOff, Monitor, Save,
    CheckCircle, Smartphone, Mail, Lock, LogOut, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24, marginBottom: 20 };
const sectionTitle = { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px' };

const Toggle = ({ on, onToggle, color = '#3b82f6' }) => (
    <button onClick={onToggle} style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', position: 'relative',
        background: on ? (color === '#3b82f6' ? 'rgba(59,130,246,0.4)' : 'rgba(16,185,129,0.4)') : 'rgba(255,255,255,0.1)',
        transition: 'all 0.25s', flexShrink: 0,
    }}>
        <motion.div animate={{ x: on ? 22 : 2 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{ position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: on ? (color === '#3b82f6' ? '#3b82f6' : '#10b981') : 'rgba(255,255,255,0.3)' }} />
    </button>
);

const SettingRow = ({ icon: Icon, color, title, desc, children }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ height: 38, width: 38, borderRadius: 11, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
            <Icon size={16} />
        </div>
        <div style={{ flex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 700, margin: 0 }}>{title}</p>
            {desc && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: '2px 0 0' }}>{desc}</p>}
        </div>
        {children}
    </div>
);

export default function DoctorSettings() {
    const { user, logout } = useAuth();
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        smsAlerts: false,
        appointmentReminders: true,
        soundAlerts: true,
        profileVisible: true,
        twoFactor: false,
        darkMode: true,
        compactView: false,
        timezone: 'Asia/Kolkata',
        language: 'English',
        reminderTime: '30',
    });

    const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

    const handleSave = () => showToast('Settings saved successfully!');

    return (
        <DashboardLayout>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <div style={{ height: 8, width: 8, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
                        <span style={{ color: '#f59e0b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Preferences</span>
                    </div>
                    <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, margin: 0 }}>Settings</h1>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginTop: 4 }}>Manage your notification, privacy and display preferences</p>
                </div>
                <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 12, color: '#fcd34d', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    <Save size={14} /> Save Settings
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Notifications */}
                <div>
                    <div style={card}>
                        <p style={sectionTitle}>Notifications</p>
                        <SettingRow icon={Mail} color="#3b82f6" title="Email Notifications" desc="Appointment updates and alerts">
                            <Toggle on={settings.emailNotifications} onToggle={() => toggle('emailNotifications')} />
                        </SettingRow>
                        <SettingRow icon={Smartphone} color="#8b5cf6" title="Push Notifications" desc="Browser and device push alerts">
                            <Toggle on={settings.pushNotifications} onToggle={() => toggle('pushNotifications')} color="#8b5cf6" />
                        </SettingRow>
                        <SettingRow icon={Bell} color="#f59e0b" title="SMS Alerts" desc="Text messages for critical events">
                            <Toggle on={settings.smsAlerts} onToggle={() => toggle('smsAlerts')} color="#f59e0b" />
                        </SettingRow>
                        <SettingRow icon={Calendar} color="#10b981" title="Appointment Reminders" desc="Reminders before appointments">
                            <Toggle on={settings.appointmentReminders} onToggle={() => toggle('appointmentReminders')} color="#10b981" />
                        </SettingRow>
                        <SettingRow icon={settings.soundAlerts ? Volume2 : VolumeX} color="#ec4899" title="Sound Alerts" desc="Notification sounds for new events">
                            <Toggle on={settings.soundAlerts} onToggle={() => toggle('soundAlerts')} color="#ec4899" />
                        </SettingRow>

                        {settings.appointmentReminders && (
                            <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(16,185,129,0.07)', borderRadius: 12, border: '1px solid rgba(16,185,129,0.15)' }}>
                                <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                                    Send Reminder
                                </label>
                                <select value={settings.reminderTime} onChange={e => setSettings(s => ({ ...s, reminderTime: e.target.value }))}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', fontSize: 13, padding: '8px 12px', width: '100%', outline: 'none' }}>
                                    <option value="15">15 minutes before</option>
                                    <option value="30">30 minutes before</option>
                                    <option value="60">1 hour before</option>
                                    <option value="120">2 hours before</option>
                                    <option value="1440">1 day before</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Display */}
                    <div style={card}>
                        <p style={sectionTitle}>Display & Appearance</p>
                        <SettingRow icon={Moon} color="#8b5cf6" title="Dark Mode" desc="Use dark theme (recommended)">
                            <Toggle on={settings.darkMode} onToggle={() => toggle('darkMode')} color="#8b5cf6" />
                        </SettingRow>
                        <SettingRow icon={Monitor} color="#06b6d4" title="Compact View" desc="Show more data in less space">
                            <Toggle on={settings.compactView} onToggle={() => toggle('compactView')} color="#06b6d4" />
                        </SettingRow>

                        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Language</label>
                                <select value={settings.language} onChange={e => setSettings(s => ({ ...s, language: e.target.value }))}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', fontSize: 13, padding: '8px 12px', width: '100%', outline: 'none' }}>
                                    <option>English</option>
                                    <option>Hindi</option>
                                    <option>Tamil</option>
                                    <option>Telugu</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Timezone</label>
                                <select value={settings.timezone} onChange={e => setSettings(s => ({ ...s, timezone: e.target.value }))}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', fontSize: 13, padding: '8px 12px', width: '100%', outline: 'none' }}>
                                    <option value="Asia/Kolkata">IST (India)</option>
                                    <option value="UTC">UTC</option>
                                    <option value="America/New_York">EST (USA)</option>
                                    <option value="Europe/London">GMT (UK)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    {/* Privacy & Security */}
                    <div style={card}>
                        <p style={sectionTitle}>Privacy & Security</p>
                        <SettingRow icon={Eye} color="#10b981" title="Public Profile" desc="Make your profile visible to patients">
                            <Toggle on={settings.profileVisible} onToggle={() => toggle('profileVisible')} color="#10b981" />
                        </SettingRow>
                        <SettingRow icon={Shield} color="#3b82f6" title="Two-Factor Authentication" desc="Extra layer of account security">
                            <Toggle on={settings.twoFactor} onToggle={() => toggle('twoFactor')} />
                        </SettingRow>

                        {settings.twoFactor && (
                            <div style={{ marginTop: 14, padding: '14px', background: 'rgba(59,130,246,0.08)', borderRadius: 12, border: '1px solid rgba(59,130,246,0.15)' }}>
                                <p style={{ color: '#93c5fd', fontSize: 12, fontWeight: 600, margin: 0 }}>🔐 2FA is active. You'll be prompted for a code during login.</p>
                            </div>
                        )}
                    </div>

                    {/* Account Info */}
                    <div style={card}>
                        <p style={sectionTitle}>Account Information</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                { label: 'Full Name', value: user?.name || '—' },
                                { label: 'Email', value: user?.email || '—' },
                                { label: 'Role', value: 'Doctor' },
                                { label: 'Account Status', value: 'Active & Verified' },
                            ].map((row, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>{row.label}</p>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, margin: 0 }}>{row.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div style={{ ...card, border: '1px solid rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.03)' }}>
                        <p style={{ ...sectionTitle, color: '#f87171' }}>Danger Zone</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, color: '#f87171', cursor: 'pointer', width: '100%' }}>
                                <LogOut size={16} />
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Sign Out</p>
                                    <p style={{ fontSize: 11, opacity: 0.6, margin: '2px 0 0' }}>End your current session</p>
                                </div>
                            </button>
                            <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.06)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.12)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                    <AlertTriangle size={14} style={{ color: '#f87171' }} />
                                    <p style={{ color: '#f87171', fontSize: 12, fontWeight: 700, margin: 0 }}>Delete Account</p>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '0 0 10px' }}>This is irreversible. Contact your hospital administrator to delete your account.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 14, fontWeight: 700, fontSize: 13, color: 'white', background: toast.type === 'success' ? '#059669' : '#dc2626', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', cursor: 'pointer' }}
                        onClick={() => setToast(null)}>
                        {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />} {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
