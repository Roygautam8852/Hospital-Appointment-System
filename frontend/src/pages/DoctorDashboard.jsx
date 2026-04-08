import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CheckCircle, AlertCircle, BarChart3, TrendingUp, Users, MessageCircle, Phone, Video, ArrowUpRight, Star, MapPin, Award, Bell, Plus, Settings2, LineChart, PieChart, Activity, LogOut, ChevronRight, RefreshCw, ArrowLeft } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-600', label: 'Completed' },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-600', label: 'Confirmed' },
    accepted: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-600', label: 'Confirmed' },
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-600', label: 'Pending' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-600', label: 'Cancelled' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-600', label: 'Rejected' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${config.bg} ${config.text}`}>
      <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
      {config.label}
    </span>
  );
};

// Empty State Component
const EmptyState = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-4"
  >
    <div className="rounded-full bg-slate-700/50 p-5 mb-4">
      <Icon className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-xl font-semibold text-slate-100 mb-1">{title}</h3>
    <p className="text-slate-400 text-center max-w-sm">{description}</p>
  </motion.div>
);

// Enhanced Stat Card Component with light theme
const StatCard = ({ icon: Icon, label, value, trend, trendUp = true, color }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className={`rounded-2xl border border-white p-6 bg-white shadow-sm hover:shadow-lg transition-all ${color}`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-600 text-sm font-medium uppercase tracking-wide">{label}</p>
        <h3 className="text-4xl font-bold text-slate-900 mt-3">{value}</h3>
        {trend && (
          <div className={`flex items-center mt-4 gap-1.5 text-sm font-semibold ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
            <ArrowUpRight className={`w-4 h-4 ${!trendUp ? 'rotate-180' : ''}`} />
            {trendUp ? '+' : '-'}{Math.abs(trend)}% this month
          </div>
        )}
      </div>
      <div className={`rounded-xl p-4 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

// Enhanced Appointment Card Component
const AppointmentCard = ({ appointment, onAction }) => {
  const appointmentDate = new Date(appointment.date);
  const isToday = appointmentDate.toDateString() === new Date().toDateString();
  const isTomorrow = new Date(appointmentDate).toDateString() === new Date(Date.now() + 86400000).toDateString();
  const isPast = appointmentDate < new Date();

  const getTimeStatus = () => {
    const now = new Date();
    const diffMinutes = Math.floor((appointmentDate - now) / 60000);
    if (diffMinutes < 0) return 'Past';
    if (diffMinutes < 15) return 'Starting Soon';
    if (diffMinutes < 60) return `In ${diffMinutes}m`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `In ${diffHours}h`;
    return 'Upcoming';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
    >
      <div className="p-6">
        {/* Header with Patient Info */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-semibold text-lg">
              {(appointment.patient?.name || appointment.patientName || 'P').charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">
                {appointment.patient?.name || appointment.patientName || 'Patient'}
              </h3>
              <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                <MapPin size={14} />
                {appointment.patient?.email || appointment.patientEmail || 'No email'}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={appointment.status} />
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
              appointment.status === 'pending' ? 'bg-red-100 text-red-700' :
              appointment.status === 'confirmed' || appointment.status === 'accepted' ? 'bg-green-100 text-green-700' :
              appointment.status === 'completed' ? 'bg-blue-100 text-blue-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {getTimeStatus()}
            </span>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5 text-slate-700">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Date</p>
              <p className="text-sm font-semibold text-slate-900">
                {appointmentDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Time</p>
              <p className="text-sm font-semibold text-slate-900">
                {appointment.time || appointmentDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Reason/Case */}
        {(appointment.reason || appointment.department) && (
          <div className="mb-5 pb-5 border-b border-slate-200">
            <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wide">Department / Reason</p>
            <p className="text-sm text-slate-700 leading-relaxed">{appointment.reason || appointment.department}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isPast && appointment.status === 'pending' && (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAction('confirm', appointment._id)}
                className="flex-1 px-3 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} />
                Confirm
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAction('reject', appointment._id)}
                className="flex-1 px-3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-semibold transition-colors"
              >
                Decline
              </motion.button>
            </>
          )}
          {appointment.status === 'confirmed' && !isPast && (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAction('video', appointment._id)}
                className="flex-1 px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" />
                Join Call
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAction('reschedule', appointment._id)}
                className="flex-1 px-3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-semibold transition-colors"
              >
                Reschedule
              </motion.button>
            </>
          )}
          {appointment.status === 'completed' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAction('prescription', appointment._id)}
              className="flex-1 px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Add Prescription
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Quick Actions Sidebar Component
const QuickActionsSidebar = ({ appointmentCount }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-4"
  >
    {/* Alerts Card */}
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-slate-200 p-6 bg-white shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Bell size={18} className="text-amber-500" />
          Alerts
        </h3>
        <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-lg">
          {appointmentCount}
        </span>
      </div>
      <p className="text-sm text-slate-600">Pending appointments requiring attention</p>
    </motion.div>

    {/* Quick Actions Grid */}
    <div className="grid grid-cols-2 gap-3">
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-lg border border-slate-200 p-4 bg-white hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group"
      >
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
          <Phone className="w-5 h-5 text-blue-600" />
        </div>
        <span className="text-xs font-semibold text-slate-700">Start Call</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-lg border border-slate-200 p-4 bg-white hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group"
      >
        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
          <MessageCircle className="w-5 h-5 text-purple-600" />
        </div>
        <span className="text-xs font-semibold text-slate-700">Messages</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-lg border border-slate-200 p-4 bg-white hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group"
      >
        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
          <Calendar className="w-5 h-5 text-emerald-600" />
        </div>
        <span className="text-xs font-semibold text-slate-700">Schedule</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-lg border border-slate-200 p-4 bg-white hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group"
      >
        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
          <BarChart3 className="w-5 h-5 text-amber-600" />
        </div>
        <span className="text-xs font-semibold text-slate-700">Analytics</span>
      </motion.button>
    </div>

    {/* Performance Card */}
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-emerald-200 p-6 bg-emerald-50 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-slate-600 font-medium">Your Rating</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-900">4.8</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-600">Based on 128 reviews</p>
    </motion.div>
  </motion.div>
);

// Main Doctor Dashboard Component
export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    acceptedAppointments: 0,
    completionRate: 0,
    acceptanceRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/appointments?limit=100`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        console.log('Appointments API Response:', data);
        const appointmentsData = data.data || data.appointments || [];
        setAppointments(appointmentsData);
        calculateStats(appointmentsData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Calculate statistics
  const calculateStats = (appointmentsData) => {
    const total = appointmentsData.length;
    const completed = appointmentsData.filter(a => a.status === 'completed').length;
    const pending = appointmentsData.filter(a => a.status === 'pending').length;
    const confirmed = appointmentsData.filter(a => a.status === 'confirmed').length;

    setStats({
      totalAppointments: total,
      completedAppointments: completed,
      pendingAppointments: pending,
      acceptedAppointments: confirmed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      acceptanceRate: total > 0 ? Math.round(((confirmed + completed) / total) * 100) : 0,
    });
  };

  // Handle appointment actions
  const handleAppointmentAction = async (action, appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      let endpoint = `${API_BASE_URL}/appointments/${appointmentId}`;
      let payload = {};

      if (action === 'confirm') {
        payload = { status: 'confirmed' };
      } else if (action === 'reject') {
        payload = { status: 'cancelled' };
      } else if (action === 'complete') {
        payload = { status: 'completed' };
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Refresh appointments
        const aptsResponse = await fetch(`${API_BASE_URL}/appointments?limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await aptsResponse.json();
        const appointmentsData = data.data || [];
        setAppointments(appointmentsData);
        calculateStats(appointmentsData);
      }
    } catch (err) {
      console.error('Error updating appointment:', err);
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'accepted') return apt.status === 'confirmed';
    return apt.status === activeFilter;
  });

  // Generate chart data from real appointments
  const generateTrendData = () => {
    const last7Days = {};
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayKey = date.toISOString().split('T')[0];
      last7Days[dayKey] = 0;
    }

    // Count appointments for each day
    appointments.forEach(apt => {
      try {
        // Try multiple field names for appointment date
        const dateStr = apt.appointmentDate || apt.date || apt.appointmentTime;
        if (dateStr) {
          const apptDate = new Date(dateStr);
          const dayKey = apptDate.toISOString().split('T')[0];
          if (last7Days.hasOwnProperty(dayKey)) {
            last7Days[dayKey]++;
          }
        }
      } catch (e) {
        console.warn('Error parsing appointment date:', e);
      }
    });

    const trendData = Object.values(last7Days);
    return {
      labels: dayLabels,
      data: trendData
    };
  };

  const generateStatusData = () => {
    const completed = appointments.filter(a => a.status === 'completed').length;
    const pending = appointments.filter(a => a.status === 'pending').length;
    const confirmed = appointments.filter(a => a.status === 'confirmed').length;
    
    return {
      labels: ['Completed', 'Pending', 'Confirmed'],
      data: [completed, pending, confirmed]
    };
  };

  const trendData = generateTrendData();
  const statusData = generateStatusData();

  // Get upcoming appointments (next 3)
  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.appointmentDate) > new Date() && apt.status !== 'cancelled')
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 3);

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pt-6 pb-12">
      {/* Background blur effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-6 mb-10 border-b border-slate-200 pb-8"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <motion.button
                whileHover={{ scale: 1.05, x: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="mt-1 p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all shadow-sm"
                title="Back to Home"
              >
                <ArrowLeft size={22} className="text-emerald-600" />
              </motion.button>
              <div>
                <p className="text-emerald-600 text-sm font-bold uppercase tracking-wider mb-2">Live Dashboard</p>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Doctor Command Center</h1>
                <p className="text-slate-600">
                  Welcome back, <span className="font-semibold text-slate-900">Dr. {localStorage.getItem('doctorName') || 'Smith'}</span> • {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-5 py-3 text-slate-900 font-semibold shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group"
            >
              <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-300" />
              Refresh
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-6"
        >
          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Calendar}
              label="Total Appointments"
              value={stats.totalAppointments}
              trend={12}
              color="bg-blue-50"
            />
            <StatCard
              icon={CheckCircle}
              label="Completed"
              value={stats.completedAppointments}
              trend={8}
              color="bg-emerald-50"
            />
            <StatCard
              icon={Clock}
              label="Pending"
              value={stats.pendingAppointments}
              trendUp={false}
              color="bg-amber-50"
            />
            <StatCard
              icon={Users}
              label="Acceptance Rate"
              value={`${stats.acceptanceRate}%`}
              trend={5}
              color="bg-purple-50"
            />
          </motion.div>

          {/* Charts & Analytics Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Appointment Trends Chart */}
            <motion.div 
              whileHover={{ y: -2 }}
              className="rounded-2xl border border-white p-6 bg-white shadow-sm hover:shadow-lg transition-all lg:col-span-2"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <LineChart size={20} className="text-emerald-600" />
                Appointment Trends
              </h3>
              <div className="h-80">
                <Line 
                  data={{
                    labels: trendData.labels,
                    datasets: [{
                      label: 'Appointments',
                      data: trendData.data,
                      borderColor: '#10b981',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      borderWidth: 3,
                      tension: 0.4,
                      fill: true,
                      pointRadius: 6,
                      pointBackgroundColor: '#10b981',
                      pointBorderColor: 'white',
                      pointBorderWidth: 2,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: { color: '#64748b', font: { size: 12 } }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(226, 232, 240, 0.3)' }
                      },
                      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(226, 232, 240, 0.3)' } }
                    }
                  }}
                />
              </div>
            </motion.div>

            {/* Status Split Chart */}
            <motion.div 
              whileHover={{ y: -2 }}
              className="rounded-2xl border border-white p-6 bg-white shadow-sm hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <PieChart size={20} className="text-amber-600" />
                Status Split
              </h3>
              <div className="h-80">
                <Pie 
                  data={{
                    labels: statusData.labels,
                    datasets: [{
                      data: statusData.data,
                      backgroundColor: ['#fbbf24', '#3b82f6', '#10b981'],
                      borderColor: 'white',
                      borderWidth: 2,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { color: '#64748b', font: { size: 12 }, padding: 20 }
                      }
                    }
                  }}
                />
              </div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Appointments Section */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <div className="rounded-2xl border border-white bg-white shadow-sm overflow-hidden hover:shadow-lg transition-all">
                {/* Header */}
                <div className="border-b border-slate-200 p-6 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-slate-900">Your Appointments</h2>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 text-sm font-semibold rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      {stats.pendingAppointments} Pending
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {['all', 'pending', 'confirmed', 'completed'].map(filter => (
                      <motion.button
                        key={filter}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveFilter(filter === 'confirmed' ? 'accepted' : filter)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                          (activeFilter === filter || (activeFilter === 'accepted' && filter === 'confirmed'))
                            ? 'bg-emerald-500 text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {filter}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-medium">Loading appointments...</p>
                      </div>
                    </div>
                  ) : error ? (
                    <EmptyState
                      icon={AlertCircle}
                      title="Error Loading Appointments"
                      description={error}
                    />
                  ) : filteredAppointments.length === 0 ? (
                    <EmptyState
                      icon={Calendar}
                      title="No Appointments Found"
                      description={`You don't have any ${activeFilter !== 'all' ? activeFilter : ''} appointments yet.`}
                    />
                  ) : (
                    <motion.div
                      className="space-y-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {filteredAppointments.map((appointment, index) => (
                        <motion.div key={appointment._id || index} variants={itemVariants}>
                          <AppointmentCard
                            appointment={appointment}
                            onAction={handleAppointmentAction}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div variants={itemVariants}>
              <QuickActionsSidebar appointmentCount={stats.pendingAppointments} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Fix: Add RefreshCw import if not already there
// Note: Make sure to add RefreshCw to the imports at the top if it's not already included
