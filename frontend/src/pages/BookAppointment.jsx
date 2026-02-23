import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Calendar as CalendarIcon,
    Clock,
    User,
    Stethoscope,
    ChevronRight,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

const BookAppointment = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        doctor: '',
        department: '',
        date: '',
        time: '',
        reason: '',
    });

    const departments = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine'];
    const [doctors, setDoctors] = useState([
        { _id: '1', name: 'Dr. Sarah Wilson', specialization: 'Cardiology' },
        { _id: '2', name: 'Dr. Michael Chen', specialization: 'Neurology' },
        { _id: '3', name: 'Dr. Emily Blunt', specialization: 'Pediatrics' },
    ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/appointments', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStep(3); // Success step
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Book an Appointment</h1>
                    <p className="text-slate-500 font-medium italic">"Your health journey begins with a single click."</p>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-center mb-12">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {s < 3 && step > s ? '✓' : s}
                            </div>
                            {s < 3 && <div className={`w-16 h-1 mx-2 rounded-full ${step > s ? 'bg-primary-600' : 'bg-slate-200'}`}></div>}
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <Stethoscope className="text-primary-600" /> Select Specialty
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {departments.map((dept) => (
                                <button
                                    key={dept}
                                    onClick={() => {
                                        setFormData({ ...formData, department: dept });
                                        setStep(2);
                                    }}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all hover:border-primary-500 hover:shadow-md group ${formData.department === dept ? 'border-primary-600 bg-primary-50' : 'border-slate-100'}`}
                                >
                                    <p className={`font-bold ${formData.department === dept ? 'text-primary-600' : 'text-slate-700'}`}>{dept}</p>
                                    <p className="text-xs text-slate-400 mt-1">Specialized care available</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
                        <div className="space-y-8">
                            <section>
                                <h3 className="font-bold flex items-center gap-2 mb-6">
                                    <User size={20} className="text-primary-600" /> Choose Your Doctor
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {doctors.map((doc) => (
                                        <label key={doc._id} className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.doctor === doc._id ? 'border-primary-600 bg-primary-50' : 'border-slate-100 hover:bg-slate-50'}`}>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="radio"
                                                    name="doctor"
                                                    required
                                                    onChange={() => setFormData({ ...formData, doctor: doc._id })}
                                                    checked={formData.doctor === doc._id}
                                                />
                                                <div>
                                                    <p className="font-bold text-slate-900">{doc.name}</p>
                                                    <p className="text-xs text-slate-500">{doc.specialization}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-primary-600 bg-white px-3 py-1 rounded-full border border-primary-100 shadow-sm">$50 Fee</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Date</label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="date"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <select
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        >
                                            <option value="">Select Slot</option>
                                            <option>09:00 AM</option>
                                            <option>10:30 AM</option>
                                            <option>02:00 PM</option>
                                            <option>04:30 PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Visit</label>
                                <textarea
                                    required
                                    rows="3"
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Tell us briefly why you are booking this visit..."
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex gap-4">
                                <button type="button" onClick={() => setStep(1)} className="flex-1 btn-secondary py-4">Back</button>
                                <button type="submit" className="flex-[2] btn-primary py-4">Confirm Appointment</button>
                            </div>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 text-center"
                    >
                        <div className="h-20 w-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                            <CheckCircle2 size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Appointment Booked Successfully!</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                            Your appointment has been sent to the doctor for confirmation. You will receive a notification shortly.
                        </p>
                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/patient/dashboard')}
                                className="w-full btn-primary py-4"
                            >
                                Go to Dashboard
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                className="w-full text-slate-500 font-bold hover:text-slate-700 underline underline-offset-4"
                            >
                                Book Another Appointment
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default BookAppointment;
