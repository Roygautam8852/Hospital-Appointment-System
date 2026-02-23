import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, HeartPulse, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleScroll = (id) => {
        setIsOpen(false);
        if (location.pathname !== '/') {
            navigate(`/#${id}`);
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <HeartPulse className="h-8 w-8 text-primary-600" />
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                                CarePulse
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <button onClick={() => handleScroll('home')} className="text-slate-600 hover:text-primary-600 font-medium select-none">Home</button>
                        <button onClick={() => handleScroll('services')} className="text-slate-600 hover:text-primary-600 font-medium select-none">Services</button>
                        <button onClick={() => handleScroll('doctors')} className="text-slate-600 hover:text-primary-600 font-medium select-none">Doctors</button>
                        <button onClick={() => handleScroll('about')} className="text-slate-600 hover:text-primary-600 font-medium select-none">About</button>

                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-all"
                                >
                                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">{user.name.split(' ')[0]}</span>
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in duration-200">
                                        <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Identity</p>
                                            <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary-50 text-[10px] font-black uppercase tracking-tighter text-primary-600 border border-primary-100 italic">
                                                {user.role} Status
                                            </span>
                                        </div>

                                        <Link to={`/${user.role}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-colors">
                                            <LayoutDashboard size={18} />
                                            System Dashboard
                                        </Link>

                                        <Link to={`/${user.role}/profile`} className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-colors">
                                            <User size={18} />
                                            Medical Profile
                                        </Link>

                                        <div className="h-px bg-slate-50 my-1"></div>

                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut size={18} />
                                            Terminate Session
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium">Login</Link>
                                <Link to="/signup" className="btn-primary">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-slate-200 py-4 px-4 space-y-4 shadow-lg animate-in slide-in-from-top duration-300">
                    <button onClick={() => handleScroll('home')} className="block w-full text-left text-slate-600 hover:text-primary-600 font-medium font-medium">Home</button>
                    <button onClick={() => handleScroll('services')} className="block w-full text-left text-slate-600 hover:text-primary-600 font-medium">Services</button>
                    <button onClick={() => handleScroll('doctors')} className="block w-full text-left text-slate-600 hover:text-primary-600 font-medium">Doctors</button>
                    <button onClick={() => handleScroll('about')} className="block w-full text-left text-slate-600 hover:text-primary-600 font-medium">About</button>
                    {user ? (
                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-3 px-2 mb-4">
                                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                    <p className="text-xs text-slate-500">{user.role.toUpperCase()}</p>
                                </div>
                            </div>
                            <Link to={`/${user.role}/dashboard`} onClick={() => setIsOpen(false)} className="block px-2 py-2 text-slate-600 hover:text-primary-600 font-medium">Dashboard</Link>
                            <Link to={`/${user.role}/profile`} onClick={() => setIsOpen(false)} className="block px-2 py-2 text-slate-600 hover:text-primary-600 font-medium">My Profile</Link>
                            <button onClick={logout} className="block w-full text-left px-2 py-2 text-red-600 font-medium">Logout</button>
                        </div>
                    ) : (
                        <div className="pt-4 border-t border-slate-100 space-y-4">
                            <Link to="/login" onClick={() => setIsOpen(false)} className="block text-slate-600 hover:text-primary-600 font-medium">Login</Link>
                            <Link to="/signup" onClick={() => setIsOpen(false)} className="block btn-primary text-center">Sign Up</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
