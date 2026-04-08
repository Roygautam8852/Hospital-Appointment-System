import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DoctorLogin from './pages/DoctorLogin';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorPatients from './pages/DoctorPatients';
import DoctorMedicalFiles from './pages/DoctorMedicalFiles';
import DoctorProfile from './pages/DoctorProfile';
import DoctorSettings from './pages/DoctorSettings';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDoctors from './pages/AdminDoctors';
import AdminPatients from './pages/AdminPatients';
import AdminAppointments from './pages/AdminAppointments';
import AdminServices from './pages/AdminServices';
import AdminRevenue from './pages/AdminRevenue';
import AdminSettings from './pages/AdminSettings';
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
        '/signup',
        '/doctor-login',
        '/admin-login'
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
                <Route
                    path="/doctor-login"
                    element={
                        <PublicRoute>
                            <DoctorLogin />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/admin-login"
                    element={
                        <PublicRoute>
                            <AdminLogin />
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
                <Route
                    path="/doctor/appointments"
                    element={
                        <PrivateRoute roles={['doctor']}>
                            <DoctorAppointments />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/doctor/patients"
                    element={
                        <PrivateRoute roles={['doctor']}>
                            <DoctorPatients />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/doctor/medical-files"
                    element={
                        <PrivateRoute roles={['doctor']}>
                            <DoctorMedicalFiles />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/doctor/profile"
                    element={
                        <PrivateRoute roles={['doctor']}>
                            <DoctorProfile />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/doctor/settings"
                    element={
                        <PrivateRoute roles={['doctor']}>
                            <DoctorSettings />
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
                <Route
                    path="/admin/doctors"
                    element={
                        <PrivateRoute roles={['admin']}>
                            <AdminDoctors />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/patients"
                    element={
                        <PrivateRoute roles={['admin']}>
                            <AdminPatients />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/appointments"
                    element={
                        <PrivateRoute roles={['admin']}>
                            <AdminAppointments />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/services"
                    element={
                        <PrivateRoute roles={['admin']}>
                            <AdminServices />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/revenue"
                    element={
                        <PrivateRoute roles={['admin']}>
                            <AdminRevenue />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/settings"
                    element={
                        <PrivateRoute roles={['admin']}>
                            <AdminSettings />
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
