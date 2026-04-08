import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const isDoctor = user?.role === 'doctor';
    const isPatient = user?.role === 'patient';
    const isDark = isAdmin || isDoctor || isPatient;

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: isDark ? '#0c0f1a' : '#f8fafc',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif"
        }}>
            {/* Ambient glows */}
            {isDark ? (
                <>
                    <div style={{ position: 'fixed', top: '-15%', left: '20%', width: '40%', height: '40%', background: isDoctor ? 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
                    <div style={{ position: 'fixed', bottom: '-10%', right: '10%', width: '35%', height: '35%', background: isDoctor ? 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
                </>
            ) : (
                <>
                    <div className="fixed top-[-10%] left-[20%] w-[40%] h-[40%] bg-primary-600/5 rounded-full blur-[120px] pointer-events-none" />
                    <div className="fixed bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
                </>
            )}

            <Sidebar role={user?.role} />
            <main style={{
                flex: 1,
                marginLeft: 240,
                padding: '32px',
                position: 'relative',
                zIndex: 10
            }} className={isPatient ? 'patient-dark' : ''}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
