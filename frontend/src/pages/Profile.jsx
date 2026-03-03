import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Camera,
    Shield,
    Bell,
    CreditCard,
    ChevronRight,
    Edit2,
    Check,
    Save,
    Activity,
    Heart,
    Weight,
    Dna
} from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bloodGroup: 'O+',
        height: '175 cm',
        weight: '72 kg',
        address: 'B-42, Health City, New Delhi, India'
    });

    const stats = [
        { label: 'Blood Group', value: formData.bloodGroup, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
        { label: 'Height', value: formData.height, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Weight', value: formData.weight, icon: Weight, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Genetics', value: 'AB-22', icon: Dna, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    const handleSave = async () => {
        setIsEditing(false);
        console.log('Profile updated:', formData);
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto pb-20">
                {/* Extra Compact Mesh Header Card */}
                <div className="relative mb-10">
                    <div className="h-36 rounded-[2rem] shadow-lg overflow-hidden relative group">
                        {/* Mesh Gradient Background */}
                        <div className="absolute inset-0 bg-[#4F46E5]">
                            <div className="absolute top-[-40%] left-[-10%] w-[50%] h-[150%] bg-emerald-400 rounded-full blur-[80px] opacity-30"></div>
                            <div className="absolute bottom-[-50%] right-[-5%] w-[40%] h-[120%] bg-rose-400 rounded-full blur-[60px] opacity-25"></div>
                        </div>
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-[0.5px]"></div>

                        {/* Edit Button Over Banner */}
                        <div className="absolute top-5 right-6 z-20">
                            {isEditing ? (
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-5 py-2 bg-emerald-500 text-white rounded-lg font-bold text-[10px] shadow-lg hover:bg-emerald-600 transition-all active:scale-95"
                                >
                                    <Save size={14} /> Save
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg font-bold text-[10px] shadow-lg hover:bg-white/20 transition-all active:scale-95"
                                >
                                    <Edit2 size={14} /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Profile Info - Super Compact Left Side */}
                    <div className="absolute inset-y-0 left-8 flex items-center gap-5 z-10">
                        <div className="relative group">
                            <div className="h-20 w-20 rounded-full bg-white p-1 shadow-xl border border-white/20 overflow-hidden transform group-hover:scale-105 transition-all duration-500">
                                <img
                                    src={user?.profileImage && user?.profileImage !== 'default-avatar.png'
                                        ? (user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000/${user.profileImage}`)
                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=10b981&color=fff&bold=true&size=120`}
                                    alt={user?.name}
                                    className="h-full w-full object-cover rounded-full"
                                />
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 border-2 border-[#4F46E5] rounded-full"></div>
                        </div>

                        <div className="text-white">
                            <h2 className="text-2xl font-black tracking-tight capitalize mb-0.5 drop-shadow-sm">{formData.name}</h2>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-white/10 backdrop-blur-md text-white rounded text-[8px] font-black uppercase tracking-widest border border-white/10">ID: #87873763</span>
                                <div className="h-1 w-1 bg-white/30 rounded-full"></div>
                                <span className="text-white/60 text-[9px] font-bold">Patient Node</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid System */}
                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Left Stats & Info (8/12) */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Quick Metrics Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                                >
                                    <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform`}>
                                        <stat.icon size={22} />
                                    </div>
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</h5>
                                    <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Professional Information Card */}
                        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-10">
                                <h3 className="text-2xl font-bold text-slate-900 mb-10 flex items-center gap-3">
                                    <span className="h-10 w-10 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-200">
                                        <User size={20} />
                                    </span>
                                    Identity Details
                                </h3>

                                <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                                    {[
                                        { label: 'Full Name', value: formData.name, key: 'name', icon: User },
                                        { label: 'Email Address', value: formData.email, key: 'email', icon: Mail },
                                        { label: 'Primary Phone', value: formData.phone, key: 'phone', icon: Phone },
                                        { label: 'Residential Address', value: formData.address, key: 'address', icon: MapPin },
                                    ].map((field) => (
                                        <div key={field.key} className="space-y-3 group">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">{field.label}</label>
                                            <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${isEditing
                                                ? 'bg-slate-50 border-primary-200 ring-4 ring-primary-600/5'
                                                : 'bg-white border-slate-50'
                                                }`}>
                                                <field.icon size={18} className={`${isEditing ? 'text-primary-600' : 'text-slate-300'}`} />
                                                <input
                                                    readOnly={!isEditing}
                                                    value={field.value}
                                                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                                    className={`w-full bg-transparent font-bold text-slate-800 outline-none ${!isEditing ? 'cursor-default' : ''}`}
                                                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Medical Summary Card */}
                        <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-2xl">
                            <div className="relative z-10 flex items-start justify-between">
                                <div className="max-w-md">
                                    <div className="h-12 w-12 bg-primary-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary-500/20">
                                        <Activity className="text-white" size={24} />
                                    </div>
                                    <h4 className="text-3xl font-extrabold mb-4 tracking-tight">Clinical Summary</h4>
                                    <p className="text-slate-400 font-medium leading-relaxed mb-8">
                                        Your high-level clinical profile for instant provider recognition during emergencies.
                                    </p>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Emergency Hub</span>
                                            <p className="font-bold text-xl group-hover:text-primary-400 transition-colors">Priti Kumari</p>
                                            <p className="text-xs text-slate-500 font-bold mt-1">+91 91234 56789</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Known Pathologies</span>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-3 py-1 bg-rose-500/10 text-rose-400 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-rose-500/20">Pollen Allergy</span>
                                                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-amber-500/20">Penicillin</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="h-40 w-40 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-center text-nowrap">
                                        <Shield className="text-primary-500 mb-4" size={48} />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Vault</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 h-64 w-64 bg-primary-600/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150"></div>
                        </div>
                    </div>

                    {/* Right Settings (4/12) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Preferences Card */}
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <span className="h-4 w-1 bg-primary-600 rounded-full"></span>
                                System Config
                            </h4>

                            <div className="space-y-4">
                                {[
                                    { name: 'Security & Auth', desc: 'Password, 2FA, Devices', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50' },
                                    { name: 'Communications', desc: 'Email, Push, SMS', icon: Bell, color: 'text-amber-500', bg: 'bg-amber-50' },
                                    { name: 'Payments', desc: 'Cards, Billing, History', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        className="w-full flex items-center justify-between p-5 rounded-[2rem] hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`h-12 w-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center group-hover:rotate-12 transition-all`}>
                                                <item.icon size={22} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-slate-800 tracking-tight">{item.name}</p>
                                                <p className="text-[10px] text-slate-400 font-semibold">{item.desc}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Completion Card */}
                        <div className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] p-10 rounded-[3rem] text-white shadow-xl shadow-indigo-200">
                            <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-6 leading-none">Account Score</p>
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-5xl font-extrabold tracking-tighter">70%</h4>
                                <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <Activity className="text-white" size={32} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '70% ' }}
                                        className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                                    ></motion.div>
                                </div>
                                <p className="text-xs font-bold text-indigo-100 italic leading-relaxed">
                                    “Complete your medical history to unlock emergency ID generation.”
                                </p>
                            </div>
                        </div>

                        {/* Banner Support */}
                        <div className="bg-white p-2 rounded-[3.5rem] shadow-sm border border-slate-100">
                            <div className="bg-slate-50 p-8 rounded-[3rem] text-center border border-white">
                                <div className="h-16 w-16 bg-white rounded-2xl shadow-sm mx-auto flex items-center justify-center text-primary-600 mb-6">
                                    <Shield size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-800 mb-2">Secure Information</h4>
                                <p className="text-xs text-slate-400 font-medium mb-8 leading-relaxed">Your data is stored with AES-256 encryption & HIPAA compliance.</p>
                                <button className="w-full py-4 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all active:scale-95">Verify ID Vault</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
