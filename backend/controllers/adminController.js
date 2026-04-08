const User = require('../models/User');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Notification = require('../models/Notification');

// ─── DASHBOARD STATS ────────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
    try {
        const totalDoctors = await User.countDocuments({ role: 'doctor' });
        const totalPatients = await User.countDocuments({ role: 'patient' });
        const totalAppointments = await Appointment.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
        const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
        const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
        const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

        // Revenue from completed appointments
        const revenueData = await Appointment.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$fee' } } }
        ]);
        const totalRevenue = revenueData[0]?.total || 0;

        // Monthly appointments for chart
        const monthlyAppointments = await Appointment.aggregate([
            {
                $group: {
                    _id: { month: { $month: '$date' }, year: { $year: '$date' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 }
        ]);

        // Top specializations
        const topSpecializations = await User.aggregate([
            { $match: { role: 'doctor', specialization: { $ne: null } } },
            { $group: { _id: '$specialization', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 }
        ]);

        // Recent appointments
        const recentAppointments = await Appointment.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('patient', 'name email')
            .populate('doctor', 'name specialization');

        // New patients this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const newPatientsThisMonth = await User.countDocuments({
            role: 'patient',
            createdAt: { $gte: startOfMonth }
        });

        res.status(200).json({
            success: true,
            data: {
                totalDoctors,
                totalPatients,
                totalAppointments,
                pendingAppointments,
                completedAppointments,
                confirmedAppointments,
                cancelledAppointments,
                totalRevenue,
                monthlyAppointments,
                topSpecializations,
                recentAppointments,
                newPatientsThisMonth,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── DOCTOR MANAGEMENT ───────────────────────────────────────────────────────
exports.getAllDoctors = async (req, res) => {
    try {
        const { search, specialization, page = 1, limit = 10 } = req.query;
        const query = { role: 'doctor' };
        if (search) query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
        if (specialization) query.specialization = specialization;

        const total = await User.countDocuments(query);
        const doctors = await User.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: doctors, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addDoctor = async (req, res) => {
    try {
        const { name, email, password, phone, specialization, experience, consultationFee, about } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, message: 'Doctor with this email already exists' });

        const doctorData = {
            name, email, password, phone, role: 'doctor',
            specialization, experience: parseInt(experience),
            consultationFee: parseFloat(consultationFee), about
        };

        if (req.file) {
            doctorData.profileImage = req.file.filename;
        }

        const doctor = await User.create(doctorData);

        res.status(201).json({ success: true, message: 'Doctor added successfully', data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const allowedFields = ['name', 'phone', 'specialization', 'experience', 'consultationFee', 'about', 'availability'];
        const updates = {};
        allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

        if (req.file) {
            updates.profileImage = req.file.filename;
        }

        const doctor = await User.findOneAndUpdate({ _id: id, role: 'doctor' }, updates, { new: true, runValidators: true });
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

        res.status(200).json({ success: true, message: 'Doctor updated successfully', data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await User.findOneAndDelete({ _id: id, role: 'doctor' });
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

        res.status(200).json({ success: true, message: 'Doctor removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' });
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
        res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── PATIENT MANAGEMENT ──────────────────────────────────────────────────────
exports.getAllPatients = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const query = { role: 'patient' };
        if (search) query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];

        const total = await User.countDocuments(query);
        const patients = await User.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: patients, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await User.findOneAndDelete({ _id: id, role: 'patient' });
        if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
        res.status(200).json({ success: true, message: 'Patient removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── APPOINTMENT MANAGEMENT ──────────────────────────────────────────────────
exports.getAllAppointments = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, search } = req.query;
        const query = {};
        if (status && status !== 'all') query.status = status;

        let appointments = await Appointment.find(query)
            .populate('patient', 'name email phone')
            .populate('doctor', 'name specialization')
            .sort({ createdAt: -1 });

        if (search) {
            const s = search.toLowerCase();
            appointments = appointments.filter(a =>
                a.patient?.name?.toLowerCase().includes(s) ||
                a.doctor?.name?.toLowerCase().includes(s)
            );
        }

        const total = appointments.length;
        const paginated = appointments.slice((page - 1) * limit, page * limit);

        res.status(200).json({ success: true, data: paginated, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true })
            .populate('patient', 'name email')
            .populate('doctor', 'name specialization');
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── SERVICES MANAGEMENT ─────────────────────────────────────────────────────
// Stored in DB as a special 'services' config document (using Notification model repurposed, or simple in-memory + JSON)
// For production we'll use a dedicated simple approach with a Service model.
// Since we don't have a Service model yet, we'll track services via a JSON approach.

// ─── BROADCAST NOTIFICATION ──────────────────────────────────────────────────
exports.sendBroadcastNotification = async (req, res) => {
    try {
        const { title, message, targetRole } = req.body;
        const query = targetRole && targetRole !== 'all' ? { role: targetRole } : {};
        const users = await User.find(query).select('_id');

        const notifications = users.map(u => ({
            userId: u._id,
            title,
            message,
            type: 'system',
            isRead: false,
        }));

        await Notification.insertMany(notifications);
        res.status(200).json({ success: true, message: `Broadcast sent to ${users.length} users` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── SYSTEM SETTINGS ────────────────────────────────────────────────────────
exports.getSystemSettings = async (req, res) => {
    // Return hospital configuration (can be stored in DB later)
    res.status(200).json({
        success: true,
        data: {
            hospitalName: 'MediCare Pro Hospital',
            email: 'hospital123@gmail.com',
            phone: '+91 98765 43210',
            address: '123 Health Street, Medical City, India',
            website: 'www.medicarepro.com',
            workingHours: '8:00 AM – 8:00 PM',
            emergencyContact: '+91 99999 00000',
            establishedYear: '2010',
            bedCapacity: '500',
            accreditation: 'NABH Accredited',
        }
    });
};
