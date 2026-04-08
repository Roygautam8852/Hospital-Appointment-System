import {
    ArrowRight,
    Activity,
    Users,
    Shield,
    Clock,
    Phone,
    Mail,
    MapPin,
    Heart,
    Brain,
    Baby,
    Stethoscope,
    Bone,
    AlertTriangle,
    Search,
    HeartPulse,
    Droplets,
    Microscope,
    FileSearch,
    Award,
    ShieldCheck,
    GraduationCap,
    Star,
    Instagram,
    Twitter,
    Facebook,
    Linkedin,
    CheckCircle2,
    Lock,
    UserCircle,
    Star as StarIcon,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const UPLOADS_URL = 'http://localhost:5000/uploads/';

const testimonials = [
    {
        type: 'professional',
        name: 'Dr. Sarah Johnson',
        role: 'Cardiologist',
        img: 'https://i.pravatar.cc/150?u=sarah',
        text: "The appointment booking system is incredibly efficient. It saves me valuable time and helps me focus on patient care."
    },
    {
        type: 'professional',
        name: 'Dr. Robert Martinez',
        role: 'Pediatrician',
        img: 'https://i.pravatar.cc/150?u=robert',
        text: "This platform has streamlined our clinic operations significantly. Patient management is much more organized."
    },
    {
        type: 'patient',
        name: 'Michael Chen',
        role: 'Patient',
        img: 'https://i.pravatar.cc/150?u=michael',
        text: "Scheduling appointments has never been easier. The interface is intuitive and reminders are very helpful!"
    },
    {
        type: 'patient',
        name: 'Emily Williams',
        role: 'Patient',
        img: 'https://i.pravatar.cc/150?u=emily',
        text: "Booking appointments online 24/7 is a game changer. The confirmation system gives me peace of mind."
    }
];

// Fallback icons mapping for services
const IconMap = {
    HeartPulse, Droplets, Microscope, FileSearch, Stethoscope, Bone, Activity, Brain, Baby, Shield, Clock, Users
};

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [showAllDoctors, setShowAllDoctors] = useState(false);
    const [showAllServices, setShowAllServices] = useState(false);
    const [loading, setLoading] = useState(true);

    const doctorsLimit = 8;
    const servicesLimit = 6;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [docsRes, servRes] = await Promise.all([
                    axios.get(`${API}/doctors`),
                    axios.get(`${API}/services`)
                ]);
                if (docsRes.data.success) setDoctors(docsRes.data.data);
                if (servRes.data.success) setServices(servRes.data.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleBookClick = () => {
        if (user) {
            navigate(`/${user.role}/dashboard`);
        } else {
            navigate('/login');
        }
    };

    const getImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith('http')) return img;
        return UPLOADS_URL + img;
    };

    const formatDoctorName = (name) => {
        if (!name) return "";
        return name.toLowerCase().startsWith("dr.") ? name : `Dr. ${name}`;
    };

    const displayedDoctors = showAllDoctors ? doctors : doctors.slice(0, doctorsLimit);
    const displayedServices = showAllServices ? services : services.slice(0, servicesLimit);

    return (
        <div className="bg-white text-slate-900 font-sans">
            {/* Hero Section */}
            <section id="home" className="pt-24 pb-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-[3rem] p-6 lg:p-12 border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/30 -z-10 rounded-l-[4rem]"></div>

                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-9 w-9 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <Stethoscope className="text-emerald-600 h-4.5 w-4.5" />
                                    </div>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-emerald-600 tracking-tight">MediCare+</h1>
                                </div>

                                <div className="flex gap-1 mb-4 text-emerald-400">
                                    {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} size={14} fill="currentColor" />)}
                                </div>

                                <h2 className="text-xl lg:text-3xl font-bold mb-6 text-slate-800 leading-tight">
                                    Premium Healthcare <br />
                                    <span className="text-emerald-600">At Your Fingertips</span>
                                </h2>

                                {/* Feature Badges */}
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    {[
                                        { icon: CheckCircle2, text: 'Certified Specialists' },
                                        { icon: Clock, text: '24/7 Availability' },
                                        { icon: Lock, text: 'Safe & Secure' },
                                        { icon: Users, text: '100+ Doctors' },
                                    ].map((badge, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-emerald-50 px-3 py-2.5 rounded-xl border border-emerald-100/50">
                                            <badge.icon size={14} className="text-emerald-600" />
                                            <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wide">{badge.text}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button onClick={handleBookClick} className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold text-sm tracking-wide flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200">
                                        Book Appointment Now
                                    </button>
                                    <div className="flex items-center gap-3 bg-red-50/50 px-5 py-2.5 rounded-xl border border-red-100/50 group cursor-pointer hover:bg-red-50 transition-colors">
                                        <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md shadow-red-200">
                                            <Phone size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-red-400 capitalize mb-0.5">Emergency Call</p>
                                            <p className="text-sm font-bold text-red-600">911-CARE-PULSE</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                className="relative lg:flex justify-end hidden"
                            >
                                <div className="max-w-[360px] w-full relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800"
                                        alt="Medical Team"
                                        className="rounded-[2rem] shadow-lg w-full h-[400px] object-cover object-top"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=800";
                                        }}
                                    />
                                    <div className="absolute -bottom-4 -left-4 bg-white p-2.5 rounded-xl shadow-md border border-slate-50 flex items-center gap-2.5">
                                        <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                                            <Users size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{doctors.length}+</p>
                                            <p className="text-[10px] font-semibold text-slate-400">Active Doctors</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Certification Section */}
            <div className="py-20 text-center relative overflow-hidden bg-slate-50/30">
                <div className="absolute inset-0 flex items-center justify-center px-4">
                    <div className="h-[1px] w-full max-w-7xl bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4">
                    <motion.h3
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-slate-50/0 px-8 inline-block relative text-2xl lg:text-4xl font-bold text-slate-800 tracking-tight mb-10"
                    >
                        Certified & <span className="text-emerald-600 underline decoration-emerald-200 underline-offset-8">Excellence</span>
                    </motion.h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
                        {[
                            { icon: ShieldCheck, title: "NABH Accredited", subtitle: "National Standards", color: "text-emerald-600" },
                            { icon: Award, title: "Best Hospital 2026", subtitle: "Global Award Winner", color: "text-blue-600" },
                            { icon: GraduationCap, title: "JCI Standards", subtitle: "Professional Quality", color: "text-amber-500" },
                            { icon: Star, title: "ISO 9001:2026", subtitle: "Safety Certified", color: "text-rose-500" },
                        ].map((badge, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                            >
                                <div className={`mb-4 p-3 rounded-2xl bg-white shadow-inner group-hover:scale-110 transition-transform ${badge.color}`}>
                                    <badge.icon size={32} strokeWidth={2.5} />
                                </div>
                                <h4 className="text-sm font-bold text-slate-800 tracking-tight">{badge.title}</h4>
                                <p className="text-[10px] font-medium text-slate-400 mt-1">{badge.subtitle}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <section id="services" className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-3">Our <span className="text-emerald-600">Specialized</span> Services</h2>
                        <p className="text-slate-500 text-sm font-medium">Providing high-quality medical care across multiple departments.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedServices.map((service, i) => {
                            const ServiceIcon = IconMap[service.icon] || Stethoscope;
                            const serviceImg = service.image || service.img;
                            return (
                                <motion.div
                                    key={service._id || i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ y: -8 }}
                                    className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-100 transition-all duration-500 overflow-hidden group"
                                >
                                    <div className="h-40 w-full overflow-hidden relative">
                                        <img
                                            src={serviceImg ? (serviceImg.startsWith('http') ? serviceImg : UPLOADS_URL + serviceImg) : "https://images.unsplash.com/photo-1505751172107-1ba9321da3be?auto=format&fit=crop&q=80&w=400"}
                                            alt={service.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.unsplash.com/photo-1505751172107-1ba9321da3be?auto=format&fit=crop&q=80&w=400";
                                            }}
                                        />
                                        <div className="absolute top-3 left-3 h-8 w-8 bg-white/95 backdrop-blur-sm rounded-lg flex items-center justify-center text-emerald-600 shadow-lg border border-white/50">
                                            <ServiceIcon size={14} />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-base font-bold text-slate-800 mb-1 leading-tight">{service.name}</h4>
                                        <p className="text-[11px] text-slate-500 leading-relaxed italic line-clamp-2">
                                            "{service.description}"
                                        </p>
                                        <div className="mt-4 flex items-center gap-2 text-emerald-600 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                            Learn More <ArrowRight size={12} />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {services.length > servicesLimit && (
                        <div className="mt-12 text-center">
                            <button onClick={() => setShowAllServices(!showAllServices)} className="py-2.5 px-8 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl font-bold text-xs flex items-center gap-2 mx-auto hover:bg-emerald-600 hover:text-white transition-all shadow-md">
                                {showAllServices ? <><ChevronUp size={16} /> Show Less</> : <><ChevronDown size={16} /> Show More Services</>}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Medical Team Section */}
            <section id="doctors" className="py-20 px-4 bg-slate-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-3">Our <span className="text-emerald-600">Medical</span> Team</h2>
                        <p className="text-slate-500 text-sm font-medium">Book appointments quickly with our verified specialists.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {displayedDoctors.map((doc, i) => (
                            <motion.div
                                key={doc._id || i}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group max-w-sm mx-auto w-full"
                            >
                                <div className="h-52 overflow-hidden relative">
                                    <img
                                        src={getImageUrl(doc.profileImage) || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=10b981&color=fff&bold=true`}
                                        alt={doc.name}
                                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=10b981&color=fff&bold=true`;
                                        }}
                                    />
                                    <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-md">
                                        <StarIcon size={10} className="text-emerald-400" fill="currentColor" />
                                        <span className="text-[9px] font-black">{doc.ratings || '5.0'}</span>
                                    </div>
                                </div>
                                <div className="p-4 text-center">
                                    <h4 className="text-base font-bold text-slate-800 mb-0.5">{formatDoctorName(doc.name)}</h4>
                                    <p className="text-emerald-600 font-semibold text-[11px] mb-2">{doc.specialization}</p>

                                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg py-1 px-2.5 inline-block mb-3">
                                        <span className="text-[9px] font-bold text-emerald-700">{doc.experience} years Experience</span>
                                    </div>

                                    <button onClick={handleBookClick} className="w-full py-2 bg-emerald-600 text-white rounded-lg font-bold text-[10px] flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-md">
                                        <CalendarIcon size={13} /> Book Now
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {doctors.length > doctorsLimit && (
                        <div className="mt-12 text-center">
                            <button onClick={() => setShowAllDoctors(!showAllDoctors)} className="py-2.5 px-8 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl font-bold text-xs flex items-center gap-2 mx-auto hover:bg-emerald-600 hover:text-white transition-all shadow-md">
                                {showAllDoctors ? <><ChevronUp size={16} /> Show Less</> : <><ChevronDown size={16} /> Show More Doctors</>}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Voices of Trust Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-5xl font-bold text-emerald-600 mb-3">Voices of Trust</h2>
                        <p className="text-slate-500 text-sm font-medium max-w-2xl mx-auto">Real stories from doctors and patients sharing their positive experiences with our healthcare platform.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Professionals */}
                        <div>
                            <div className="flex items-center gap-2 mb-6 px-4">
                                <Users size={20} className="text-emerald-600" />
                                <h3 className="text-sm font-bold text-slate-800">Medical Professionals</h3>
                            </div>
                            <div className="space-y-4">
                                {testimonials.filter(t => t.type === 'professional').map((t, i) => (
                                    <TestimonialCard key={i} {...t} />
                                ))}
                            </div>
                        </div>

                        {/* Patients */}
                        <div>
                            <div className="flex items-center gap-2 mb-6 px-4">
                                <UserCircle size={20} className="text-emerald-500" />
                                <h3 className="text-sm font-bold text-slate-800">Patients</h3>
                            </div>
                            <div className="space-y-4">
                                {testimonials.filter(t => t.type === 'patient').map((t, i) => (
                                    <TestimonialCard key={i} {...t} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-emerald-50 rounded-[3rem] p-8 lg:p-12 border border-emerald-100 shadow-sm relative overflow-hidden">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">Connect <span className="text-emerald-600">With Us</span></h2>
                                <p className="text-slate-500 text-sm font-medium mb-8">Have questions? Reach out and we'll help you schedule your care.</p>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 capitalize mb-1">Call Center</p>
                                            <p className="text-base font-bold text-slate-800 tracking-tight">+91 8090410 873</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 capitalize mb-1">Email Support</p>
                                            <p className="text-base font-bold text-slate-800 tracking-tight">support@medicare.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Your Name" className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-200" />
                                    <input type="email" placeholder="Email Address" className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-200" />
                                </div>
                                <input type="text" placeholder="Subject" className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-200" />
                                <textarea placeholder="Message" rows="4" className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-200 resize-none"></textarea>
                                <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-200/50 hover:bg-emerald-700 transition-all">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-emerald-50/50 pt-20 pb-10 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-200/20 blur-[80px] rounded-full"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 lg:col-span-1">
                            <div className="flex items-center gap-2.5 mb-6">
                                <div className="h-8 w-8 border-2 border-emerald-500 rounded-full flex items-center justify-center p-0.5">
                                    <div className="h-full w-full bg-emerald-100 rounded-full flex items-center justify-center">
                                        <Stethoscope className="h-4 w-4 text-emerald-600" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-bold text-emerald-600 leading-none">MediCare</span>
                                    <span className="text-[9px] font-semibold text-slate-400 capitalize">Healthcare Solutions</span>
                                </div>
                            </div>
                            <p className="text-slate-500 text-xs leading-relaxed mb-6 font-medium">
                                Your trusted partner in healthcare innovation. We're committed to providing exceptional care with cutting-edge technology.
                            </p>
                            <div className="space-y-3">
                                <p className="flex items-center gap-2.5 text-xs font-bold text-slate-600"><Phone size={14} className="text-emerald-600" /> +91 8090410 873</p>
                                <p className="flex items-center gap-2.5 text-xs font-bold text-slate-600"><Mail size={14} className="text-emerald-600" /> info@medicare.com</p>
                                <p className="flex items-center gap-2.5 text-xs font-bold text-slate-600"><MapPin size={14} className="text-emerald-600" /> Lucknow, India</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-slate-800 mb-6 capitalize">Quick Links</h4>
                            <ul className="space-y-3">
                                {['Home', 'Doctors', 'Services', 'Contact'].map((label, i) => (
                                    <li key={i}>
                                        <a href={`#${label.toLowerCase()}`} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors">
                                            <div className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                <CheckCircle2 size={8} />
                                            </div>
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-slate-800 mb-6 capitalize">Our Services</h4>
                            <ul className="space-y-3">
                                {services.slice(0, 6).map((service, i) => (
                                    <li key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        {service.name}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-slate-800 mb-6 capitalize">Stay Connected</h4>
                            <p className="text-slate-500 text-[11px] font-medium mb-4 italic">Subscribe for wellness insights delivered to your inbox.</p>
                            <div className="relative mb-6">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 pr-20 focus:outline-none focus:ring-1 focus:ring-emerald-200 text-xs font-medium"
                                />
                                <button className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition-colors">
                                    Join
                                </button>
                            </div>
                            <div className="flex gap-2">
                                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                    <div key={i} className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all cursor-pointer">
                                        <Icon size={14} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm font-semibold text-slate-400 italic">© 2026 MediCare Healthcare.</p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">Designed By:</span>
                            <span className="text-xs font-bold text-emerald-600 capitalize">Hexagon Digital</span>
                        </div>
                        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="h-8 w-8 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-110 transition-transform">
                            <ArrowRight size={16} className="-rotate-90" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const TestimonialCard = ({ name, role, img, text }) => (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative group hover:shadow-lg transition-all">
        <div className="flex items-center gap-3 mb-4">
            <img
                src={img}
                alt={name}
                className="h-10 w-10 rounded-full border border-emerald-100"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff&bold=true`;
                }}
            />
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-none">{name}</h4>
                        <p className="text-[10px] font-semibold text-slate-400 capitalize mt-1 tracking-tight">{role}</p>
                    </div>
                    <div className="flex text-emerald-400 gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} size={10} fill="currentColor" />)}
                    </div>
                </div>
            </div>
        </div>
        <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">"{text}"</p>
    </div>
);

const CalendarIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

export default LandingPage;
