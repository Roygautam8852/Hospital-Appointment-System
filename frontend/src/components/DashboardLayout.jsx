import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role={user?.role} />
            <main className="flex-1 ml-56 pt-20 p-8">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
