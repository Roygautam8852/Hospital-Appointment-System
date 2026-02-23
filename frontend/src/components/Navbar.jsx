import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HeartPulse, Menu, X, User, LogOut, LayoutDashboard, ChevronDown, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleScroll = (id) => {
        setIsOpen(false);
        if (location.pathname !== '/') {
            navigate('/', { state: { scrollTo: id } });
            return;
        }
        const element = document.getElementById(id);
        if (element) {
            const offset = 60;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-1.5' : 'bg-transparent py-3'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="h-9 w-9 border-2 border-emerald-500 rounded-full flex items-center justify-center p-0.5 group-hover:scale-110 transition-transform">
                            <div className="h-full w-full bg-emerald-50 rounded-full flex items-center justify-center">
                                <Stethoscope className="h-4 w-4 text-emerald-600" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-black text-emerald-600 leading-none">MediCare</span>
                            <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Healthcare Solutions</span>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                        {[
                            { id: 'home', label: 'Home' },
                            { id: 'doctors', label: 'Doctors' },
                            { id: 'services', label: 'Services' },
                            { id: 'contact', label: 'Contact' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleScroll(item.id)}
                                className="relative px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:text-emerald-600 transition-colors group uppercase tracking-widest"
                            >
                                {item.label}
                                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full rounded-full`}></span>
                            </button>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:flex items-center space-x-2">

                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="p-0.5 rounded-full bg-white border border-slate-100 hover:border-emerald-200 transition-all shadow-sm hover:scale-105 active:scale-95 group"
                                >
                                    <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black text-[11px] shadow-md">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-50 py-1 animate-in fade-in zoom-in duration-200 overflow-hidden">
                                        <Link to={`/${user.role}/dashboard`} className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                            <LayoutDashboard size={14} /> Dashboard
                                        </Link>
                                        <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-red-600 hover:bg-red-50 transition-colors">
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="px-5 py-2 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all shadow-md shadow-emerald-100">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-slate-100 py-4 px-4 space-y-3 shadow-xl animate-in slide-in-from-top duration-300">
                    <div className="space-y-1">
                        {['Home', 'Doctors', 'Services', 'Contact'].map((label) => (
                            <button
                                key={label}
                                onClick={() => handleScroll(label.toLowerCase())}
                                className="block w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-slate-50 flex flex-col gap-2">
                        {!user && (
                            <>
                                <Link to="/login" onClick={() => setIsOpen(false)} className="px-4 py-3 bg-emerald-600 text-white rounded-lg text-center font-black text-xs uppercase shadow-md">Login</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
