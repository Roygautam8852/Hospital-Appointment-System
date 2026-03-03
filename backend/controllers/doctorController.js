const User = require('../models/User');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' });
        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get doctors by department
// @route   GET /api/doctors/department/:dept
// @access  Public
exports.getDoctorsByDept = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor', specialization: req.params.dept });
        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
