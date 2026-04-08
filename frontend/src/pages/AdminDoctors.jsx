import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import axios from 'axios';
import {
    UserPlus, Search, Edit2, Trash2, X, Check, Stethoscope,
    Mail, Phone, DollarSign, Award, ChevronLeft, ChevronRight,
    AlertTriangle, Loader2, Star, Clock, Shield, Camera, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost:5000/api';
const UPLOADS_URL = 'http://localhost:5000/uploads/';

const specializations = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology',
    'Gynecology', 'Ophthalmology', 'ENT', 'Psychiatry', 'Oncology',
    'Radiology', 'Anesthesiology', 'General Surgery', 'Internal Medicine',
    'Emergency Medicine', 'Urology', 'Nephrology', 'Gastroenterology',
    'Endocrinology', 'Pulmonology'
];

const initialForm = {
    name: '', email: '', password: '', phone: '',
    specialization: '', experience: '', consultationFee: '', about: ''
};

const statusBadge = (doc) => (
    <span style={{
        padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700,
        background: 'rgba(16,185,129,0.15)', color: '#10b981'
    }}>Active</span>
);

export default function AdminDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterSpec, setFilterSpec] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editDoc, setEditDoc] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 8, ...(search && { search }), ...(filterSpec && { specialization: filterSpec }) };
            const { data } = await axios.get(`${API}/admin/doctors`, { headers: getHeaders(), params });
            if (data.success) {
                setDoctors(data.data);
                setTotalPages(data.pages);
                setTotal(data.total);
            }
        } catch (_) {}
        setLoading(false);
    };

    useEffect(() => { fetchDoctors(); }, [page, search, filterSpec]);

    const openAdd = () => { 
        setForm(initialForm); 
        setEditDoc(null); 
        setError(''); 
        setImage(null);
        setImagePreview(null);
        setShowModal(true); 
    };

    const openEdit = (doc) => {
        setForm({
            name: doc.name || '', email: doc.email || '', password: '',
            phone: doc.phone || '', specialization: doc.specialization || '',
            experience: doc.experience || '', consultationFee: doc.consultationFee || '', about: doc.about || ''
        });
        setEditDoc(doc);
        setError('');
        setImage(null);
        setImagePreview(doc.profileImage ? UPLOADS_URL + doc.profileImage : null);
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
        setSubmitting(true);

        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (key === 'password' && editDoc && !form[key]) return;
            formData.append(key, form[key]);
        });
        if (image) formData.append('profileImage', image);

        try {
            if (editDoc) {
                await axios.put(`${API}/admin/doctors/${editDoc._id}`, formData, { 
                    headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data' } 
                });
                setSuccess('Doctor updated successfully!');
            } else {
                if (!form.name || !form.email || !form.password || !form.specialization) {
                    setError('Name, email, password and specialization are required.');
                    setSubmitting(false);
                    return;
                }
                await axios.post(`${API}/admin/doctors`, formData, { 
                    headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data' } 
                });
                setSuccess('Doctor added successfully!');
            }
            setShowModal(false);
            fetchDoctors();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
        setSubmitting(false);
    };

    const handleDelete = async (id) => {
        setDeleting(true);
        try {
            await axios.delete(`${API}/admin/doctors/${id}`, { headers: getHeaders() });
            setSuccess('Doctor removed successfully!');
            setDeleteConfirm(null);
            fetchDoctors();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Delete failed.');
        }
        setDeleting(false);
    };

    const inputStyle = {
        width: '100%', boxSizing: 'border-box',
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10, padding: '11px 14px', color: 'white', fontSize: 13,
        fontFamily: 'inherit', outline: 'none'
    };
    const labelStyle = { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 };

    return (
        <DashboardLayout>
            <style>{`
                input::placeholder, textarea::placeholder, select option { color: rgba(255,255,255,0.2); }
                select option { background: #1a1d27; }
                input:focus, textarea:focus, select:focus { border-color: rgba(16,185,129,0.5) !important; background: rgba(16,185,129,0.06) !important; }
            `}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, margin: 0 }}>Doctor Management</h1>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: '6px 0 0' }}>{total} doctors registered in system</p>
                </div>
                <button onClick={openAdd} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '12px 22px', background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none', borderRadius: 12, color: 'white', fontSize: 13,
                    fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(16,185,129,0.35)'
                }}>
                    <UserPlus size={16} /> Add New Doctor
                </button>
            </div>

            {/* Success / Error Toast */}
            <AnimatePresence>
                {success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: '12px 18px', marginBottom: 20, zIndex: 100 }}>
                        <Check size={16} color="#10b981" />
                        <span style={{ color: '#6ee7b7', fontSize: 13, fontWeight: 600 }}>{success}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 22 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        style={{ ...inputStyle, paddingLeft: 40 }}
                    />
                </div>
                <select value={filterSpec} onChange={e => { setFilterSpec(e.target.value); setPage(1); }}
                    style={{ ...inputStyle, width: 220, cursor: 'pointer' }}>
                    <option value="">All Specializations</option>
                    {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            {/* Table wrapper */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ padding: '0 0', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                {['Doctor', 'Specialization', 'Experience', 'Fee', 'Status', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
                                    <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 10px', display: 'block' }} />
                                    Loading doctors...
                                </td></tr>
                            ) : doctors.length === 0 ? (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '60px 0' }}>
                                    <Stethoscope size={36} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 12px', display: 'block' }} />
                                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No doctors found.</p>
                                    <button onClick={openAdd} style={{ marginTop: 12, padding: '8px 20px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, color: '#10b981', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                        Add first doctor
                                    </button>
                                </td></tr>
                            ) : doctors.map((doc, i) => (
                                <motion.tr key={doc._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ height: 40, width: 40, borderRadius: 12, background: 'rgba(16,185,129,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {doc.profileImage ? (
                                                    <img src={UPLOADS_URL + doc.profileImage} alt={doc.name} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <span style={{ color: '#10b981', fontWeight: 800, fontSize: 15 }}>{doc.name?.[0]}</span>
                                                )}
                                            </div>
                                            <div>
                                                <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0 }}>Dr. {doc.name}</p>
                                                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '2px 0 0' }}>{doc.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <span style={{ padding: '4px 12px', background: 'rgba(16,185,129,0.15)', borderRadius: 20, color: '#10b981', fontSize: 12, fontWeight: 600 }}>
                                            {doc.specialization || 'N/A'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                                        {doc.experience ? `${doc.experience} yrs` : '—'}
                                    </td>
                                    <td style={{ padding: '16px 20px', color: '#10b981', fontSize: 13, fontWeight: 700 }}>
                                        {doc.consultationFee ? `₹${doc.consultationFee}` : '—'}
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>{statusBadge(doc)}</td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button onClick={() => openEdit(doc)} style={{ height: 34, width: 34, borderRadius: 9, background: 'rgba(59,130,246,0.15)', border: 'none', color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => setDeleteConfirm(doc)} style={{ height: 34, width: 34, borderRadius: 9, background: 'rgba(239,68,68,0.15)', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Page {page} of {totalPages}</p>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                style={{ padding: '8px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: 'none', color: page === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                                <ChevronLeft size={14} /> Prev
                            </button>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                style={{ padding: '8px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: 'none', color: page === totalPages ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)', cursor: page === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                                Next <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            style={{ background: '#131722', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '32px', width: '100%', maxWidth: 640, maxHeight: '95vh', overflowY: 'auto' }}>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
                                <div>
                                    <h2 style={{ color: 'white', fontSize: 20, fontWeight: 800, margin: 0 }}>
                                        {editDoc ? 'Edit Doctor' : 'Add New Doctor'}
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: '4px 0 0' }}>
                                        {editDoc ? `Editing Dr. ${editDoc.name}` : 'Register a new doctor to the system'}
                                    </p>
                                </div>
                                <button onClick={() => setShowModal(false)} style={{ height: 36, width: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={16} />
                                </button>
                            </div>

                            {error && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 20 }}>
                                    <AlertTriangle size={14} color="#f87171" />
                                    <span style={{ color: '#fca5a5', fontSize: 13 }}>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'flex', gap: 28, marginBottom: 24 }}>
                                    {/* Profile Image Section */}
                                    <div style={{ flexShrink: 0 }}>
                                        <label style={labelStyle}>Profile Photo</label>
                                        <div style={{ position: 'relative', width: 120, height: 120, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = '#10b981'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                                            onClick={() => document.getElementById('image-upload').click()}
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
                                        <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, textAlign: 'center', marginTop: 8 }}>JPG, PNG or WEBP<br/>Max 5MB</p>
                                    </div>

                                    {/* Main Fields Section */}
                                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px' }}>
                                        <div style={{ gridColumn: '1/-1' }}>
                                            <label style={labelStyle}>Full Name *</label>
                                            <input style={inputStyle} placeholder="Dr. John Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Email Address {!editDoc && '*'}</label>
                                            <input style={{ ...inputStyle, ...(editDoc ? { opacity: 0.5 } : {}) }} type="email" placeholder="doctor@hospital.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required={!editDoc} disabled={!!editDoc} />
                                        </div>
                                        {!editDoc ? (
                                            <div>
                                                <label style={labelStyle}>Password *</label>
                                                <input style={inputStyle} type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                                            </div>
                                        ) : (
                                            <div>
                                                <label style={labelStyle}>Phone Number</label>
                                                <input style={inputStyle} placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px 16px', marginBottom: 16 }}>
                                    {editDoc && (
                                        <div style={{ gridColumn: '1/2' }}>
                                            {/* Space taken by phone when editing, so we shift things */}
                                        </div>
                                    )}
                                    <div style={{ gridColumn: editDoc ? '1/2' : 'span 1' }}>
                                         {!editDoc && (
                                             <>
                                                <label style={labelStyle}>Phone Number</label>
                                                <input style={inputStyle} placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                             </>
                                         )}
                                    </div>
                                    <div style={{ gridColumn: editDoc ? 'span 1' : 'span 1' }}>
                                        <label style={labelStyle}>Specialization *</label>
                                        <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} required>
                                            <option value="">Select...</option>
                                            {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Experience (Years)</label>
                                        <input style={inputStyle} type="number" placeholder="10" min="0" max="60" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Consultation Fee (₹)</label>
                                        <input style={inputStyle} type="number" placeholder="500" min="0" value={form.consultationFee} onChange={e => setForm({ ...form, consultationFee: e.target.value })} />
                                    </div>
                                    <div style={{ gridColumn: '1/-1' }}>
                                        <label style={labelStyle}>About / Bio</label>
                                        <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} placeholder="Brief professional background..." value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                                    <button type="button" onClick={() => setShowModal(false)}
                                        style={{ flex: 1, padding: '13px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={submitting}
                                        style={{ flex: 2, padding: '13px', borderRadius: 12, background: submitting ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
                                        {submitting ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : <><Check size={16} /> {editDoc ? 'Save Changes' : 'Add Doctor'}</>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            style={{ background: '#131722', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: '32px', width: '100%', maxWidth: 420, textAlign: 'center' }}>
                            <div style={{ height: 60, width: 60, borderRadius: 18, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#f87171' }}>
                                <AlertTriangle size={28} />
                            </div>
                            <h3 style={{ color: 'white', fontSize: 18, fontWeight: 800, margin: '0 0 10px' }}>Remove Doctor?</h3>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 28px' }}>
                                Are you sure you want to remove <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Dr. {deleteConfirm.name}</strong>? This action cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button onClick={() => setDeleteConfirm(null)}
                                    style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button onClick={() => handleDelete(deleteConfirm._id)} disabled={deleting}
                                    style={{ flex: 1, padding: '12px', borderRadius: 12, background: deleting ? 'rgba(239,68,68,0.3)' : 'linear-gradient(135deg, #dc2626, #ef4444)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    {deleting ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Removing...</> : <><Trash2 size={15} /> Remove</>}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </DashboardLayout>
    );
}
