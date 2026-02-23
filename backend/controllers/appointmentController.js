const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
    try {
        let query;

        // If patient, show only their appointments
        if (req.user.role === 'patient') {
            query = Appointment.find({ patient: req.user.id }).populate('doctor', 'name specialization profileImage');
        }
        // If doctor, show only appointments assigned to them
        else if (req.user.role === 'doctor') {
            query = Appointment.find({ doctor: req.user.id }).populate('patient', 'name phone profileImage');
        }
        // If admin, show all
        else {
            query = Appointment.find().populate('patient doctor', 'name');
        }

        const appointments = await query;

        res.status(200).json({
            success: true,
            count: appointments.length,
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
        req.body.patient = req.user.id;

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
        res.status(500).json({ success: false, message: error.message });
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
            appointment.doctor.toString() !== req.user.id &&
            appointment.patient.toString() !== req.user.id &&
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
