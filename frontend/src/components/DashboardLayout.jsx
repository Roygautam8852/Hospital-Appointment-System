import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 flex relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[20%] w-[40%] h-[40%] bg-primary-600/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            <Sidebar role={user?.role} />
            <main className="flex-1 ml-56 pt-20 p-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
