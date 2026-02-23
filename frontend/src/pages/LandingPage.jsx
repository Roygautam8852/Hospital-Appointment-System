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
    Instagram,
    Twitter,
    Facebook,
    Linkedin
} from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const services = [
    { name: 'Cardiology', desc: 'Heart care with advanced diagnostic and treatment tools.', icon: Activity, color: 'blue' },
    { name: 'Neurology', desc: 'Expert care for neurological disorders and brain health.', icon: Brain, color: 'purple' },
    { name: 'Pediatrics', desc: 'Compassionate care for your children\'s health and growth.', icon: Baby, color: 'pink' },
    { name: 'Orthopedics', desc: 'Specialized treatment for bone and joint conditions.', icon: Bone, color: 'orange' },
    { name: 'General Medicine', desc: 'Comprehensive health checkups and primary care.', icon: Stethoscope, color: 'green' },
    { name: 'ICU & Emergency', desc: '24/7 critical care with life-saving equipment.', icon: AlertTriangle, color: 'red' },
    { name: 'Diagnostics', desc: 'Advanced laboratory and imaging services for accuracy.', icon: Search, color: 'cyan' },
];

const doctors = [
    { name: 'Dr. Sarah Wilson', spec: 'Cardiologist', exp: '12 Years', rate: 4.9, img: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200' },
    { name: 'Dr. Michael Chen', spec: 'Neurologist', exp: '15 Years', rate: 4.8, img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200' },
    { name: 'Dr. Emily Blunt', spec: 'Pediatrician', exp: '8 Years', rate: 5.0, img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200' },
];

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 500); // Small delay to ensure everything is rendered
            }
        }
    }, []);

    const handleBookClick = () => {
        if (user) {
            navigate(`/${user.role}/dashboard`);
        } else {
            navigate('/login');
        }
    };

    const serviceColors = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        pink: 'bg-pink-50 text-pink-600 border-pink-100',
        orange: 'bg-orange-50 text-orange-600 border-orange-100',
        green: 'bg-green-50 text-green-600 border-green-100',
        red: 'bg-red-50 text-red-600 border-red-100',
        cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    };

    return (
        <div className="pt-16 bg-white overflow-hidden">
            {/* Background Blobs */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary-200 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-100 rounded-full blur-[100px]"></div>
            </div>

            {/* Hero Section */}
            <section id="home" className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary-50 text-primary-700 font-bold text-xs uppercase tracking-wider mb-8 border border-primary-100 glass-card">
                                <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-ping"></span>
                                🏥 Care With Compassion
                            </div>
                            <h1 className="heading-1 mb-8 leading-[1.15] text-slate-900">
                                Revolutionizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">Healthcare</span> Delivery
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                                Experience the next generation of medical care. Advanced diagnostics, expert specialists, and compassionate treatment all under one digital roof.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5">
                                <button
                                    onClick={handleBookClick}
                                    className="btn-primary flex items-center justify-center gap-3 py-4 text-lg group"
                                >
                                    Book Appointment
                                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="h-12 w-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-200">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Emergency 24/7</p>
                                        <p className="text-xl font-black text-slate-900 uppercase">911-CARE-PULSE</p>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Indicators */}
                            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-8 text-slate-400">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <img key={i} className="h-10 w-10 rounded-full border-2 border-white object-cover" src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                    ))}
                                    <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">+2k</div>
                                </div>
                                <p className="text-sm font-medium">Trusted by <span className="text-slate-900 font-bold">2,400+</span> patients monthly</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] group">
                                <img
                                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000"
                                    alt="Modern Hospital Infrastructure"
                                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            </div>

                            {/* Floating Cards */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -right-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/40 hidden sm:block"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-green-500 text-white flex items-center justify-center">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold mb-0.5">Verified Facilities</p>
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">ISO CERTIFIED</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-10 -left-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/40 hidden sm:block"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center">
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold mb-0.5">Active Staff</p>
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">250+ Professional Doctors</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-32 relative bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="heading-2 mb-6">World Class <span className="text-primary-600">Specialized</span> Care</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                            We leverage cutting-edge technology and human expertise to provide precision medicine across all major departments.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((service, idx) => {
                            const Icon = service.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:border-primary-100 transition-all group"
                                >
                                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-8 border transition-transform duration-500 group-hover:rotate-12 ${serviceColors[service.color]}`}>
                                        <Icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-black mb-4 text-slate-800 tracking-tight">{service.name}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-6 italic">"{service.desc}"</p>
                                    <button className="text-primary-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                        Learn More <ArrowRight size={14} />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section id="about" className="py-32 overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800"
                                    alt="Quality Care"
                                    className="w-full h-[600px] object-cover hover:scale-105 transition-all duration-1000"
                                />
                            </div>
                            <div className="absolute top-[-5%] right-[-5%] w-[110%] h-[110%] bg-primary-50 rounded-[3rem] -z-10 rotate-3 animate-pulse"></div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="heading-2 mb-10 leading-tight">Setting New Standards in <span className="text-primary-600">Modern Healthcare</span></h2>
                            <div className="grid sm:grid-cols-2 gap-8">
                                {[
                                    { title: 'Certified Doctors', desc: 'International certification with board-level expertise.', icon: Shield },
                                    { title: '24/7 Support', desc: 'Always available critical care and online assistance.', icon: Clock },
                                    { title: 'Advanced Tech', desc: 'equipped with Gen-3 MRI and Robotic surgical units.', icon: Activity },
                                    { title: '10+ Years History', desc: 'A decade of excellence and millions of smiles.', icon: Heart },
                                ].map((item, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        key={idx}
                                        className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all group"
                                    >
                                        <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                            <item.icon size={24} />
                                        </div>
                                        <h4 className="font-black text-slate-800 text-lg mb-2">{item.title}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Appointment CTA */}
            <section className="py-20 relative px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto rounded-[3rem] bg-slate-900 relative overflow-hidden p-12 lg:p-24 text-center text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 blur-[80px] rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full"></div>

                    <h2 className="text-3xl lg:text-5xl font-black mb-8 leading-tight">Ready to prioritize your health?<br /><span className="text-primary-400">Book your visit today.</span></h2>
                    <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto font-medium">No more waiting in long queues. Seamlessly schedule your consultation with the best doctors in minutes.</p>

                    <button
                        onClick={handleBookClick}
                        className="px-10 py-5 bg-primary-600 text-white rounded-2xl font-black tracking-widest uppercase text-sm shadow-xl shadow-primary-900/40 hover:bg-primary-500 hover:scale-105 active:scale-95 transition-all"
                    >
                        Start Booking Now
                    </button>
                </motion.div>
            </section>

            {/* Doctors Section */}
            <section id="doctors" className="py-32 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="heading-2 mb-6">Expert <span className="text-primary-600">Medical</span> Minds</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">Our specialists represent the highest echelon of medical training and patient care.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10">
                        {doctors.map((doc, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-2xl transition-all"
                            >
                                <div className="relative overflow-hidden h-80">
                                    <img src={doc.img} alt={doc.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl text-xs font-black text-primary-600 shadow-xl flex items-center gap-2">
                                        <Star size={14} fill="currentColor" /> {doc.rate}
                                    </div>
                                    <div className="absolute bottom-6 left-6 right-6 flex justify-center translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                                        <button className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary-200">View Full Profile</button>
                                    </div>
                                </div>
                                <div className="p-10 text-center">
                                    <h3 className="text-2xl font-black mb-2 text-slate-800 tracking-tight">{doc.name}</h3>
                                    <p className="text-primary-600 font-bold uppercase tracking-widest text-xs mb-6 px-4 py-1.5 bg-primary-50 inline-block rounded-full">{doc.spec}</p>
                                    <div className="flex justify-center items-center gap-8 text-sm text-slate-400 font-bold pt-6 border-t border-slate-50">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-900">{doc.exp}</span>
                                            <span className="text-[10px] uppercase">EXP</span>
                                        </div>
                                        <div className="h-8 w-[1px] bg-slate-100"></div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-900">4.9/5</span>
                                            <span className="text-[10px] uppercase">RTG</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-white pt-32 pb-12 relative overflow-hidden">
                {/* Map Visual / Background */}
                <div className="absolute top-0 right-0 w-[40%] h-full bg-primary-900/10 pointer-events-none hidden lg:block">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                        <div className="col-span-1 lg:col-span-1">
                            <div className="flex items-center space-x-3 mb-10">
                                <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center">
                                    <HeartPulse className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-3xl font-black tracking-tighter">CAREPULSE</span>
                            </div>
                            <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                                Pioneering the future of medical care with luxury experience and surgical precision.
                            </p>
                            <div className="flex gap-4">
                                {[Twitter, Instagram, Facebook, Linkedin].map((Icon, i) => (
                                    <a key={i} href="#" className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all transform hover:-translate-y-1">
                                        <Icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-black text-xl mb-10 tracking-tight">Explore</h4>
                            <ul className="space-y-6 text-slate-400 font-bold text-sm uppercase tracking-widest">
                                <li><a href="#" className="hover:text-primary-400 transition-colors">Find Specialist</a></li>
                                <li><a href="#services" className="hover:text-primary-400 transition-colors">Our Services</a></li>
                                <li><a href="#about" className="hover:text-primary-400 transition-colors">Hospital Tour</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition-colors">Medical Blog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black text-xl mb-10 tracking-tight">HQ Office</h4>
                            <ul className="space-y-8">
                                <li className="flex gap-4">
                                    <div className="h-10 w-10 flex-shrink-0 bg-white/5 rounded-xl flex items-center justify-center text-primary-400">
                                        <MapPin size={20} />
                                    </div>
                                    <p className="text-slate-400 font-medium pt-1">123 Clinical Drive, Health District<br />New York, NY 10012</p>
                                </li>
                                <li className="flex gap-4">
                                    <div className="h-10 w-10 flex-shrink-0 bg-white/5 rounded-xl flex items-center justify-center text-primary-400">
                                        <Mail size={20} />
                                    </div>
                                    <p className="text-slate-400 font-medium pt-2">contact@carepulse.com</p>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black text-xl mb-10 tracking-tight">Newsletter</h4>
                            <p className="text-slate-400 font-medium mb-8">Join our weekly medical insights newsletter.</p>
                            <form className="relative group">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:bg-white/10 transition-all font-medium"
                                />
                                <button className="absolute right-3 top-3 h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/40">
                                    <ArrowRight size={20} />
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic">© 2026 CarePulse Infrastructure. All rights reserved.</p>
                        <div className="flex gap-12 text-slate-500 text-sm font-bold uppercase tracking-widest">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const HeartPulse = ({ className }) => {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
        </svg>
    );
};

// Supporting Icons
const CheckCircle = ({ className, size }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const Star = ({ className, size, fill }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;

export default LandingPage;
