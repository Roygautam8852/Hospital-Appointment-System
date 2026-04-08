const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'date', order = 'desc' } = req.query;
        const skip = (page - 1) * limit;

        let query;
        let countQuery;

        // If patient, show only their appointments
        if (req.user.role === 'patient') {
            countQuery = Appointment.countDocuments({ patient: req.user._id });
            query = Appointment.find({ patient: req.user._id })
                .populate('doctor', 'name specialization profileImage phone email')
                .skip(skip)
                .limit(Number(limit));
        }
        // If doctor, show only appointments assigned to them
        else if (req.user.role === 'doctor') {
            countQuery = Appointment.countDocuments({ doctor: req.user._id });
            query = Appointment.find({ doctor: req.user._id })
                .populate('patient', 'name phone profileImage email')
                .skip(skip)
                .limit(Number(limit));
        }
        // If admin, show all
        else {
            countQuery = Appointment.countDocuments({});
            query = Appointment.find()
                .populate('patient doctor', 'name profileImage')
                .skip(skip)
                .limit(Number(limit));
        }

        // Sorting
        if (sortBy === 'date') {
            query = query.sort({ date: order === 'asc' ? 1 : -1 });
        } else if (sortBy === 'amount') {
            query = query.sort({ amount: order === 'asc' ? 1 : -1 });
        } else if (sortBy === 'status') {
            query = query.sort({ status: 1 });
        }

        const appointments = await query;
        const total = await countQuery;
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            count: appointments.length,
            total,
            page: Number(page),
            totalPages,
            data: appointments,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Patient)
exports.bookAppointment = async (req, res) => {
    try {
        req.body.patient = req.user._id;

        // Check if doctor exists and is a doctor
        const doctor = await User.findById(req.body.doctor);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        const appointment = await Appointment.create(req.body);

        res.status(201).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        console.error('Book Appointment Error:', error);

        // Handle Mongoose Validation Error
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointmentStatus = async (req, res) => {
    try {
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Authorization check
        if (
            appointment.doctor.toString() !== req.user._id.toString() &&
            appointment.patient.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
