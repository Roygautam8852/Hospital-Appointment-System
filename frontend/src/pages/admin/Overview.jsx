import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Stethoscope, Calendar, DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';

const api = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

function StatCard({ label, value, icon: Icon, color, bg, trend }) {
  return (
    <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={color} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: 3 }}>
          <TrendingUp size={11} /> +{trend}%
        </span>
      </div>
      <div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
        <p style={{ color: 'white', fontSize: 28, fontWeight: 800, margin: 0 }}>{value}</p>
      </div>
    </div>
  );
}

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/admin/dashboard-stats', api(token))
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', trend: 8 },
    { label: 'Active Doctors', value: stats.totalDoctors, icon: Stethoscope, color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', trend: 5 },
    { label: 'Appointments', value: stats.totalAppointments, icon: Calendar, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', trend: 12 },
    { label: 'Revenue (₹)', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: '#10b981', bg: 'rgba(16,185,129,0.15)', trend: 18 },
  ] : [];

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 60 }}>Loading stats...</div>;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 28 }}>
        {cards.map((c, i) => <StatCard key={i} {...c} />)}
      </div>

      {/* Status breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 20px' }}>Appointment Status</h3>
          {[
            { label: 'Pending', value: stats?.pendingAppointments || 0, color: '#f59e0b' },
            { label: 'Confirmed', value: stats?.confirmedAppointments || 0, color: '#3b82f6' },
            { label: 'Completed', value: stats?.completedAppointments || 0, color: '#10b981' },
            { label: 'Cancelled', value: stats?.cancelledAppointments || 0, color: '#ef4444' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{s.label}</span>
              </div>
              <span style={{ color: s.color, fontWeight: 700, fontSize: 15 }}>{s.value}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: '0 0 20px' }}>Top Specializations</h3>
          {(stats?.topSpecializations || []).slice(0, 5).map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{s._id || 'General'}</span>
              <span style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{s.count} doctors</span>
            </div>
          ))}
          {(!stats?.topSpecializations?.length) && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No data yet.</p>}
        </div>
      </div>
    </div>
  );
}
