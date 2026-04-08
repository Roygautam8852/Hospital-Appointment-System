import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import axios from 'axios';
import {
    Plus, Search, Edit2, Trash2, X, Check, Heart,
    Activity, AlertTriangle, Loader2, ToggleLeft, ToggleRight,
    DollarSign, Clock, Tag, Building, Camera, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost:5000/api';
const UPLOADS_URL = 'http://localhost:5000/uploads/';

const CATEGORIES = ['diagnostic', 'surgical', 'therapeutic', 'emergency', 'preventive', 'consultation', 'other'];
const CATEGORY_COLORS = {
    diagnostic: '#3b82f6', surgical: '#ef4444', therapeutic: '#8b5cf6',
    emergency: '#f59e0b', preventive: '#10b981', consultation: '#06b6d4', other: '#64748b'
};

const ICONS = ['Activity', 'Heart', 'Stethoscope', 'Shield', 'Zap', 'Eye', 'Brain', 'Bone', 'Baby', 'Microscope'];

const initialForm = { name: '', description: '', icon: 'Activity', category: 'other', price: '', duration: '30 mins', department: '', availableDays: [] };
const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AdminServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editService, setEditService] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [filterCategory, setFilterCategory] = useState('');

    const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

    const fetchServices = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API}/admin/services`, { headers: getHeaders() });
            if (data.success) setServices(data.data);
        } catch (_) {}
        setLoading(false);
    };

    useEffect(() => { fetchServices(); }, []);

    const openAdd = () => { 
        setForm(initialForm); 
        setEditService(null); 
        setError(''); 
        setImage(null);
        setImagePreview(null);
        setShowModal(true); 
    };

    const openEdit = (svc) => {
        setForm({ name: svc.name, description: svc.description, icon: svc.icon || 'Activity', category: svc.category, price: svc.price || '', duration: svc.duration || '30 mins', department: svc.department || '', availableDays: svc.availableDays || [] });
        setEditService(svc);
        setError('');
        setImage(null);
        setImagePreview(svc.image ? (svc.image.startsWith('http') ? svc.image : UPLOADS_URL + svc.image) : null);
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.name || !form.description) { setError('Name and description are required.'); return; }
        setSubmitting(true);

        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (Array.isArray(form[key])) {
                form[key].forEach(val => formData.append(`${key}[]`, val));
            } else {
                formData.append(key, form[key]);
            }
        });
        if (image) formData.append('image', image);

        try {
            if (editService) {
                await axios.put(`${API}/admin/services/${editService._id}`, formData, { 
                    headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data' } 
                });
                setSuccess('Service updated successfully!');
            } else {
                await axios.post(`${API}/admin/services`, formData, { 
                    headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data' } 
                });
                setSuccess('Service added successfully!');
            }
            setShowModal(false);
            fetchServices();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
        setSubmitting(false);
    };

    const toggleActive = async (svc) => {
        try {
            await axios.put(`${API}/admin/services/${svc._id}`, { isActive: !svc.isActive }, { headers: getHeaders() });
            setServices(prev => prev.map(s => s._id === svc._id ? { ...s, isActive: !s.isActive } : s));
        } catch (_) {}
    };

    const handleDelete = async (id) => {
        setDeleting(true);
        try {
            await axios.delete(`${API}/admin/services/${id}`, { headers: getHeaders() });
            setSuccess('Service removed!');
            setDeleteConfirm(null);
            fetchServices();
            setTimeout(() => setSuccess(''), 3000);
        } catch (_) {}
        setDeleting(false);
    };

    const toggleDay = (day) => {
        setForm(f => ({ ...f, availableDays: f.availableDays.includes(day) ? f.availableDays.filter(d => d !== day) : [...f.availableDays, day] }));
    };

    const filtered = services.filter(s =>
        (search === '' || s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase())) &&
        (filterCategory === '' || s.category === filterCategory)
    );

    const inputStyle = { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px', color: 'white', fontSize: 13, fontFamily: 'inherit', outline: 'none' };
    const labelStyle = { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 };

    return (
        <DashboardLayout>
            <style>{`input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); } select option { background: #1a1d27; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, margin: 0 }}>Services Management</h1>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: '6px 0 0' }}>{services.length} hospital services configured</p>
                </div>
                <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 22px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 12, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(16,185,129,0.35)' }}>
                    <Plus size={16} /> Add Service
                </button>
            </div>

            <AnimatePresence>
                {success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: '12px 18px', marginBottom: 20 }}>
                        <Check size={16} color="#10b981" />
                        <span style={{ color: '#6ee7b7', fontSize: 13, fontWeight: 600 }}>{success}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 22 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 42 }} />
                </div>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                    style={{ ...inputStyle, width: 200, cursor: 'pointer' }}>
                    <option value="">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
            </div>

            {/* Services Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <Loader2 size={32} style={{ color: '#10b981', animation: 'spin 1s linear infinite', margin: '0 auto 12px', display: 'block' }} />
                    <p style={{ color: 'rgba(255,255,255,0.3)' }}>Loading services...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <Heart size={40} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 14px', display: 'block' }} />
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>No services found.</p>
                    <button onClick={openAdd} style={{ marginTop: 14, padding: '10px 24px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, color: '#6ee7b7', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        Add your first service
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
                    {filtered.map((svc, i) => {
                        const catColor = CATEGORY_COLORS[svc.category] || '#64748b';
                        const svcImg = svc.image ? (svc.image.startsWith('http') ? svc.image : UPLOADS_URL + svc.image) : null;
                        
                        return (
                            <motion.div key={svc._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '22px', position: 'relative', overflow: 'hidden', opacity: svc.isActive ? 1 : 0.6 }}>
                                <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at 100% 0%, ${catColor}20 0%, transparent 70%)` }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                                    <div style={{ height: 44, width: 44, borderRadius: 12, background: svcImg ? 'transparent' : `${catColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: catColor, overflow: 'hidden' }}>
                                        {svcImg ? <img src={svcImg} alt={svc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Activity size={20} />}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <button onClick={() => toggleActive(svc)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: svc.isActive ? '#10b981' : 'rgba(255,255,255,0.3)', display: 'flex', padding: 0 }}>
                                            {svc.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                                        </button>
                                        <button onClick={() => openEdit(svc)} style={{ height: 32, width: 32, borderRadius: 8, background: 'rgba(59,130,246,0.15)', border: 'none', color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Edit2 size={13} />
                                        </button>
                                        <button onClick={() => setDeleteConfirm(svc)} style={{ height: 32, width: 32, borderRadius: 8, background: 'rgba(239,68,68,0.15)', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>

                                <h3 style={{ color: 'white', fontSize: 15, fontWeight: 800, margin: '0 0 6px' }}>{svc.name}</h3>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 14px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{svc.description}</p>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    <span style={{ padding: '4px 10px', background: `${catColor}20`, borderRadius: 20, color: catColor, fontSize: 11, fontWeight: 700, textTransform: 'capitalize' }}>{svc.category}</span>
                                    {svc.price > 0 && <span style={{ padding: '4px 10px', background: 'rgba(16,185,129,0.15)', borderRadius: 20, color: '#10b981', fontSize: 11, fontWeight: 700 }}>₹{svc.price}</span>}
                                    {svc.duration && <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.06)', borderRadius: 20, color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600 }}>{svc.duration}</span>}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto' }}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                            style={{ background: '#131722', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '32px', width: '100%', maxWidth: 640, maxHeight: '95vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
                                <h2 style={{ color: 'white', fontSize: 20, fontWeight: 800, margin: 0 }}>{editService ? 'Edit Service' : 'Add New Service'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ height: 36, width: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={16} />
                                </button>
                            </div>

                            {error && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 18 }}>
                                    <AlertTriangle size={14} color="#f87171" />
                                    <span style={{ color: '#fca5a5', fontSize: 13 }}>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'flex', gap: 28, marginBottom: 24 }}>
                                    {/* Image Section */}
                                    <div style={{ flexShrink: 0 }}>
                                        <label style={labelStyle}>Service Image</label>
                                        <div style={{ position: 'relative', width: 140, height: 140, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = '#10b981'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                                            onClick={() => document.getElementById('svc-image-upload').click()}
                                        >
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ textAlign: 'center' }}>
                                                    <Camera size={24} color="rgba(255,255,255,0.2)" style={{ marginBottom: 6 }} />
                                                    <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 700, margin: 0 }}>UPLOAD</p>
                                                </div>
                                            )}
                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                                                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                                onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                            >
                                                <Upload size={20} color="white" />
                                            </div>
                                        </div>
                                        <input id="svc-image-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                    </div>

                                    {/* Form Fields Section */}
                                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px' }}>
                                        <div style={{ gridColumn: '1/-1' }}>
                                            <label style={labelStyle}>Service Name *</label>
                                            <input style={inputStyle} placeholder="e.g. MRI Scan" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                                        </div>
                                        <div style={{ gridColumn: '1/-1' }}>
                                            <label style={labelStyle}>Description *</label>
                                            <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} placeholder="Brief description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px 16px' }}>
                                    <div>
                                        <label style={labelStyle}>Category</label>
                                        <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Department</label>
                                        <input style={inputStyle} placeholder="e.g. Radiology" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Price (₹)</label>
                                        <input style={inputStyle} type="number" placeholder="0" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Duration</label>
                                        <input style={inputStyle} placeholder="e.g. 30 mins" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Available Days</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                            {ALL_DAYS.map(day => (
                                                <button key={day} type="button" onClick={() => toggleDay(day)}
                                                    style={{ padding: '5px 10px', borderRadius: 15, fontSize: 10, fontWeight: 700, cursor: 'pointer', background: form.availableDays.includes(day) ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', border: form.availableDays.includes(day) ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.1)', color: form.availableDays.includes(day) ? '#6ee7b7' : 'rgba(255,255,255,0.4)', transition: 'all 0.1s' }}>
                                                    {day.slice(0, 3)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                                    <button type="button" onClick={() => setShowModal(false)}
                                        style={{ flex: 1, padding: '13px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={submitting}
                                        style={{ flex: 2, padding: '13px', borderRadius: 12, background: submitting ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
                                        {submitting ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : <><Check size={16} /> {editService ? 'Save Changes' : 'Add Service'}</>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirm */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            style={{ background: '#131722', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: '32px', width: '100%', maxWidth: 400, textAlign: 'center' }}>
                            <div style={{ height: 56, width: 56, borderRadius: 16, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: '#f87171' }}>
                                <AlertTriangle size={26} />
                            </div>
                            <h3 style={{ color: 'white', fontSize: 18, fontWeight: 800, margin: '0 0 10px' }}>Delete Service?</h3>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 28px' }}>
                                Delete "<strong style={{ color: 'rgba(255,255,255,0.7)' }}>{deleteConfirm.name}</strong>"? This cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                <button onClick={() => handleDelete(deleteConfirm._id)} disabled={deleting}
                                    style={{ flex: 1, padding: '12px', borderRadius: 12, background: deleting ? 'rgba(239,68,68,0.3)' : 'linear-gradient(135deg, #dc2626, #ef4444)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    {deleting ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={15} />}
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
