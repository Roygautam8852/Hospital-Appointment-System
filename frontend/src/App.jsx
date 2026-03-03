import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookAppointment from './pages/BookAppointment';
import MyHistory from './pages/MyHistory';
import MedicalRecords from './pages/MedicalRecords';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center">
            <Loader2 className="animate-spin text-primary-600" size={48} />
        </div>
    );

    if (!user) return <Navigate to="/login" />;

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center">
            <Loader2 className="animate-spin text-primary-600" size={48} />
        </div>
    );

    if (user) return <Navigate to={`/${user.role}/dashboard`} />;

    return children;
};

const AppContent = () => {
    const { pathname } = useLocation();

    // Pages that should NOT have the global Navbar
    const hideNavbar = [
        '/login',
        '/signup'
    ].includes(pathname) ||
        pathname.startsWith('/patient') ||
        pathname.startsWith('/doctor') ||
        pathname.startsWith('/admin');

    return (
        <>
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <Signup />
                        </PublicRoute>
                    }
                />

                {/* Patient Routes */}
                <Route
                    path="/patient/dashboard"
                    element={
                        <PrivateRoute roles={['patient']}>
                            <PatientDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/patient/book"
                    element={
                        <PrivateRoute roles={['patient']}>
                            <BookAppointment />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/patient/history"
                    element={
                        <PrivateRoute roles={['patient']}>
                            <MyHistory />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/patient/records"
                    element={
                        <PrivateRoute roles={['patient']}>
                            <MedicalRecords />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/patient/notifications"
                    element={
                        <PrivateRoute roles={['patient']}>
                            <Notifications />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/patient/profile"
                    element={
                        <PrivateRoute roles={['patient']}>
                            <Profile />
                        </PrivateRoute>
                    }
                />

                {/* Doctor Routes */}
                <Route
                    path="/doctor/dashboard"
                    element={
                        <PrivateRoute roles={['doctor']}>
                            <DoctorDashboard />
                        </PrivateRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <PrivateRoute roles={['admin']}>
                            <AdminDashboard />
                        </PrivateRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;
