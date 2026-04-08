import { useState, useRef, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    User, Mail, Phone, MapPin, Camera, Shield, Bell, CreditCard,
    ChevronRight, Edit2, Save, Activity, Heart, Dna, CheckCircle2,
    Lock, AlertCircle, Stethoscope, Calendar, TrendingUp, Star,
    X, Key, Upload, AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = "http://localhost:5000/api/auth";

// ─── Toast ───────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-bold ${
            type === "success" ? "bg-emerald-600" : "bg-red-500"
        }`}
    >
        {type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
        {msg}
        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
    </motion.div>
);

// ─── Editable Field ───────────────────────────────────────────────────────────
const Field = ({ label, fieldKey, icon: Icon, value, onChange, editing, type = "text" }) => (
    <div>
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">{label}</label>
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
            editing ? "bg-slate-50 border-emerald-200 ring-2 ring-emerald-500/10" : "bg-slate-50/50 border-slate-100"
        }`}>
            <Icon size={14} className={editing ? "text-emerald-500" : "text-slate-300"} />
            <input
                readOnly={!editing}
                type={type}
                value={value}
                onChange={(e) => onChange(fieldKey, e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300"
                placeholder={`Enter ${label.toLowerCase()}`}
            />
        </div>
    </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const Profile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const buildInitial = (u) => ({
        name: u?.name || "",
        email: u?.email || "",
        phone: u?.phone || "",
        address: u?.address || "",
        bloodGroup: u?.bloodGroup || "",
        height: u?.height || "",
        weight: u?.weight || "",
        dob: u?.dob || "",
        gender: u?.gender || "",
        emergencyContact: u?.emergencyContact || "",
        emergencyPhone: u?.emergencyPhone || "",
        allergies: u?.allergies || "",
        insurance: u?.insurance || "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(() => buildInitial(user));
    const [originalData, setOriginalData] = useState(() => buildInitial(user));
    const [saving, setSaving] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [toast, setToast] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [pwSaving, setPwSaving] = useState(false);

    // Sync when user changes from context
    useEffect(() => {
        const fresh = buildInitial(user);
        setFormData(fresh);
        setOriginalData(fresh);
    }, [user]);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleChange = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

    const handleEdit = () => {
        setOriginalData({ ...formData });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({ ...originalData });
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { data } = await axios.put(`${API}/updateprofile`, formData, { headers });
            setUser(data.user);
            setOriginalData(buildInitial(data.user));
            setIsEditing(false);
            showToast("Profile updated successfully!");
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to update profile", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setAvatarPreview(preview);
        try {
            setUploadingAvatar(true);
            const fd = new FormData();
            fd.append("avatar", file);
            const { data } = await axios.post(`${API}/uploadavatar`, fd, {
                headers: { ...headers, "Content-Type": "multipart/form-data" },
            });
            setUser(data.user);
            showToast("Profile photo updated!");
        } catch (err) {
            setAvatarPreview(null);
            showToast(err.response?.data?.message || "Failed to upload photo", "error");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handlePasswordChange = async () => {
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            showToast("New passwords do not match", "error");
            return;
        }
        if (pwForm.newPassword.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
        }
        try {
            setPwSaving(true);
            await axios.put(`${API}/updatepassword`, {
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            }, { headers });
            setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setShowPasswordModal(false);
            showToast("Password changed successfully!");
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to change password", "error");
        } finally {
            setPwSaving(false);
        }
    };

    // ── Derived values ─────────────────────────────────────────────────────────
    const avatarSrc = avatarPreview
        || (user?.profileImage && user.profileImage !== "default-avatar.png"
            ? user.profileImage.startsWith("http")
                ? user.profileImage
                : `http://localhost:5000/${user.profileImage}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=10b981&color=fff&bold=true&size=120`);

    const healthStats = [
        { label: "Blood Group", value: formData.bloodGroup || "—", icon: Heart, color: "text-rose-600", bg: "bg-rose-50", key: "bloodGroup" },
        { label: "Height", value: formData.height || "—", icon: Activity, color: "text-blue-600", bg: "bg-blue-50", key: "height" },
        { label: "Weight", value: formData.weight || "—", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", key: "weight" },
        { label: "Date of Birth", value: formData.dob || "—", icon: Calendar, color: "text-violet-600", bg: "bg-violet-50", key: "dob" },
    ];

    const profileFields = [
        { label: "Full Name", key: "name", icon: User },
        { label: "Email Address", key: "email", icon: Mail },
        { label: "Phone Number", key: "phone", icon: Phone },
        { label: "Address", key: "address", icon: MapPin },
        { label: "Gender", key: "gender", icon: User },
        { label: "Date of Birth", key: "dob", icon: Calendar },
    ];

    const completionItems = [
        { label: "Basic Info", done: !!(formData.name && formData.email) },
        { label: "Contact Details", done: !!(formData.phone) },
        { label: "Health Metrics", done: !!(formData.bloodGroup && formData.height && formData.weight) },
        { label: "Emergency Contact", done: !!(formData.emergencyContact && formData.emergencyPhone) },
        { label: "Allergies", done: !!(formData.allergies) },
        { label: "Insurance Info", done: !!(formData.insurance) },
    ];
    const completionPct = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);

    const settingsLinks = [
        { name: "Change Password", desc: "Update account password", icon: Key, color: "text-blue-600", bg: "bg-blue-50", action: () => setShowPasswordModal(true) },
        { name: "Notifications", desc: "Email, Push, SMS alerts", icon: Bell, color: "text-amber-600", bg: "bg-amber-50", action: () => navigate("/patient/notifications") },
        { name: "Billing & Payments", desc: "Cards, receipts, history", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50", action: () => navigate("/patient/history") },
    ];

    return (
        <DashboardLayout>
            <div className="font-sans space-y-6 pb-8">
                {/* ── Header Banner ─────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                    <div className="relative">
                        <div className="h-28 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
                            <div className="absolute -bottom-8 -right-8 h-40 w-40 bg-white/10 rounded-full" />
                        </div>
                        <div className="px-8 pb-5">
                            <div className="flex items-end justify-between">
                                <div className="flex items-end gap-4 -mt-8">
                                    <div className="relative flex-shrink-0">
                                        <div className="h-20 w-20 rounded-2xl ring-4 ring-white shadow-xl overflow-hidden bg-emerald-100">
                                            {uploadingAvatar && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                                                    <Upload size={18} className="text-white animate-bounce" />
                                                </div>
                                            )}
                                            <img
                                                src={avatarSrc}
                                                alt={user?.name}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=10b981&color=fff&bold=true&size=120`;
                                                }}
                                            />
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Change profile photo"
                                            className="absolute -bottom-1.5 -right-1.5 h-7 w-7 bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow hover:bg-emerald-700 transition-all z-10"
                                        >
                                            <Camera size={13} />
                                        </button>
                                        <span className="absolute top-1 right-1 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full z-10" />
                                    </div>
                                    <div className="mb-1">
                                        <h2 className="text-lg font-bold text-slate-800 capitalize">{formData.name || "Your Name"}</h2>
                                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Patient</span>
                                            <span className="text-[10px] text-slate-400 font-medium">{formData.email}</span>
                                            <span className="flex items-center gap-1 text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                                                <CheckCircle2 size={9} /> Verified
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    {isEditing ? (
                                        <>
                                            <button onClick={handleCancel} disabled={saving}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all disabled:opacity-50">
                                                <X size={13} /> Cancel
                                            </button>
                                            <button onClick={handleSave} disabled={saving}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-sm shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-70">
                                                {saving ? <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> : <Save size={13} />}
                                                {saving ? "Saving…" : "Save Changes"}
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={handleEdit}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-100 hover:border-emerald-200 hover:text-emerald-600 transition-all">
                                            <Edit2 size={14} /> Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── Health Stats Row ──────────────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {healthStats.map((stat, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all"
                        >
                            <div className={`h-10 w-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                                <stat.icon size={18} />
                            </div>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                            {isEditing ? (
                                <input
                                    value={formData[stat.key]}
                                    onChange={(e) => handleChange(stat.key, e.target.value)}
                                    placeholder="—"
                                    className="text-lg font-black text-slate-800 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-0.5 w-full outline-none ring-2 ring-emerald-500/10 focus:ring-emerald-400/30"
                                />
                            ) : (
                                <p className="text-xl font-black text-slate-800">{stat.value}</p>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* ── Main Grid ─────────────────────────────────────────────── */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left col */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Identity Details */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                    <User size={16} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800">Identity Details</h3>
                                {isEditing && <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Editing</span>}
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {profileFields.map((f) => (
                                    <Field key={f.key} label={f.label} fieldKey={f.key} icon={f.icon}
                                        value={formData[f.key]} onChange={handleChange} editing={isEditing} />
                                ))}
                            </div>
                        </div>

                        {/* Clinical Summary */}
                        <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute -top-6 -right-6 h-32 w-32 bg-emerald-500/5 rounded-full" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="h-9 w-9 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                        <Stethoscope size={16} className="text-emerald-400" />
                                    </div>
                                    <h3 className="text-sm font-bold">Clinical Summary</h3>
                                    {isEditing && <span className="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Editing</span>}
                                </div>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    {/* Emergency Contact */}
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Emergency Contact</p>
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                <input value={formData.emergencyContact} onChange={(e) => handleChange("emergencyContact", e.target.value)}
                                                    placeholder="Contact name"
                                                    className="w-full bg-white/10 border border-white/20 text-white text-xs font-bold rounded-lg px-2 py-1.5 outline-none placeholder:text-slate-500 focus:border-emerald-400" />
                                                <input value={formData.emergencyPhone} onChange={(e) => handleChange("emergencyPhone", e.target.value)}
                                                    placeholder="Phone number"
                                                    className="w-full bg-white/10 border border-white/20 text-white text-xs font-bold rounded-lg px-2 py-1.5 outline-none placeholder:text-slate-500 focus:border-emerald-400" />
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm font-bold text-white">{formData.emergencyContact || "—"}</p>
                                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{formData.emergencyPhone || "—"}</p>
                                            </>
                                        )}
                                    </div>
                                    {/* Allergies */}
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Known Allergies</p>
                                        {isEditing ? (
                                            <input value={formData.allergies} onChange={(e) => handleChange("allergies", e.target.value)}
                                                placeholder="e.g. Pollen, Penicillin"
                                                className="w-full bg-white/10 border border-white/20 text-white text-xs font-bold rounded-lg px-2 py-1.5 outline-none placeholder:text-slate-500 focus:border-emerald-400" />
                                        ) : (
                                            formData.allergies ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {formData.allergies.split(",").map((a, i) => (
                                                        <span key={i} className="text-[9px] font-black px-2 py-1 bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20">{a.trim()}</span>
                                                    ))}
                                                </div>
                                            ) : <p className="text-sm font-bold text-slate-500">—</p>
                                        )}
                                    </div>
                                    {/* Insurance */}
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Insurance</p>
                                        {isEditing ? (
                                            <input value={formData.insurance} onChange={(e) => handleChange("insurance", e.target.value)}
                                                placeholder="Provider & policy no."
                                                className="w-full bg-white/10 border border-white/20 text-white text-xs font-bold rounded-lg px-2 py-1.5 outline-none placeholder:text-slate-500 focus:border-emerald-400" />
                                        ) : (
                                            <p className="text-sm font-bold text-white">{formData.insurance || "—"}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right col */}
                    <div className="space-y-5">
                        {/* Profile Completion */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                        <TrendingUp size={15} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800">Profile Completion</h3>
                                </div>
                                <span className="text-lg font-black text-emerald-600">{completionPct}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                                <motion.div
                                    animate={{ width: `${completionPct}%` }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                                />
                            </div>
                            <div className="space-y-2">
                                {completionItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                        <div className={`h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-300"}`}>
                                            {item.done ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                                        </div>
                                        <span className={`text-xs font-semibold ${item.done ? "text-slate-600" : "text-slate-400"}`}>{item.label}</span>
                                        {!item.done && (
                                            <span className="ml-auto text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100">Pending</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Account Settings */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
                                    <Lock size={14} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800">Account Settings</h3>
                            </div>
                            <div className="space-y-1">
                                {settingsLinks.map((item, i) => (
                                    <button key={i} onClick={item.action}
                                        className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-slate-50 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-9 w-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                                                <item.icon size={15} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs font-bold text-slate-700">{item.name}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white relative overflow-hidden">
                            <div className="absolute -top-4 -right-4 opacity-10"><Shield size={80} /></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="h-9 w-9 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Star size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">Verified Account</p>
                                        <p className="text-[10px] text-emerald-100">HIPAA & ISO 27001</p>
                                    </div>
                                </div>
                                <p className="text-[11px] text-emerald-100 leading-relaxed mb-4">
                                    Your data is encrypted with AES-256 and stored in compliance with healthcare regulations.
                                </p>
                                <div className="flex items-center gap-1.5 text-[9px] font-black bg-white/20 px-2.5 py-1 rounded-full w-fit">
                                    <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
                                    SECURE VAULT ACTIVE
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Change Password Modal ─────────────────────────────────────── */}
            <AnimatePresence>
                {showPasswordModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                        onClick={(e) => { if (e.target === e.currentTarget) setShowPasswordModal(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <Key size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800">Change Password</h3>
                                        <p className="text-xs text-slate-400">Update your account security</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowPasswordModal(false)}
                                    className="h-8 w-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-all">
                                    <X size={15} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: "Current Password", key: "currentPassword" },
                                    { label: "New Password", key: "newPassword" },
                                    { label: "Confirm New Password", key: "confirmPassword" },
                                ].map((f) => (
                                    <div key={f.key}>
                                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">{f.label}</label>
                                        <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                                            <Lock size={14} className="text-slate-300" />
                                            <input
                                                type="password"
                                                value={pwForm[f.key]}
                                                onChange={(e) => setPwForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                                                placeholder={`Enter ${f.label.toLowerCase()}`}
                                                className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
                                    Cancel
                                </button>
                                <button onClick={handlePasswordChange} disabled={pwSaving}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-70">
                                    {pwSaving ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Key size={14} />}
                                    {pwSaving ? "Updating…" : "Update Password"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Toast ─────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default Profile;
