const Prescription = require('../models/Prescription');

// @desc    Get all prescriptions for a patient
// @route   GET /api/prescriptions
// @access  Private
exports.getPrescriptions = async (req, res) => {
    try {
        let query;
        if (req.user.role === 'patient') {
            query = Prescription.find({ patient: req.user.id }).populate('doctor', 'name specialization');
        } else if (req.user.role === 'doctor') {
            query = Prescription.find({ doctor: req.user.id }).populate('patient', 'name');
        } else {
            query = Prescription.find().populate('patient doctor', 'name');
        }

        const prescriptions = await query.sort('-createdAt');

        res.status(200).json({
            success: true,
            count: prescriptions.length,
            data: prescriptions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor)
exports.createPrescription = async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        req.body.doctor = req.user.id;

        const prescription = await Prescription.create(req.body);

        res.status(201).json({
            success: true,
            data: prescription
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
