const MedicalRecord = require('../models/MedicalRecord');

// @desc    Get all medical records for a patient
// @route   GET /api/medical-records
// @access  Private
exports.getMedicalRecords = async (req, res) => {
    try {
        let query;
        
        if (req.user.role === 'patient') {
            query = MedicalRecord.find({ patient: req.user._id })
                .populate('doctor', 'name specialization');
        } else if (req.user.role === 'doctor') {
            query = MedicalRecord.find({ doctor: req.user._id })
                .populate('patient', 'name email');
        } else {
            query = MedicalRecord.find()
                .populate('patient', 'name')
                .populate('doctor', 'name specialization');
        }

        const records = await query.sort('-createdAt');

        // Calculate file sizes if not present
        const formattedRecords = records.map(record => ({
            ...record.toObject(),
            fileSize: record.fileSize || '0.5 MB',
        }));

        res.status(200).json({
            success: true,
            count: formattedRecords.length,
            data: formattedRecords,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single medical record
// @route   GET /api/medical-records/:id
// @access  Private
exports.getMedicalRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id)
            .populate('doctor', 'name specialization email phone')
            .populate('patient', 'name email phone');

        if (!record) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        // Check authorization
        if (req.user.role === 'patient' && record.patient._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this record' });
        }

        res.status(200).json({
            success: true,
            data: record,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a medical record
// @route   POST /api/medical-records
// @access  Private (Doctor)
exports.createMedicalRecord = async (req, res) => {
    try {
        if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Only doctors can create records' });
        }

        req.body.doctor = req.user._id;

        const record = await MedicalRecord.create(req.body);
        
        const populatedRecord = await record.populate('doctor', 'name specialization');

        res.status(201).json({
            success: true,
            data: populatedRecord,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a medical record
// @route   PUT /api/medical-records/:id
// @access  Private
exports.updateMedicalRecord = async (req, res) => {
    try {
        let record = await MedicalRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        // Check authorization
        if (req.user.role === 'doctor' && record.doctor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this record' });
        }

        record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('doctor', 'name specialization');

        res.status(200).json({
            success: true,
            data: record,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a medical record
// @route   DELETE /api/medical-records/:id
// @access  Private
exports.deleteMedicalRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        // Check authorization
        if (req.user.role === 'doctor' && record.doctor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this record' });
        }

        await MedicalRecord.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Record deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get records by type
// @route   GET /api/medical-records/filter/by-type?type=prescription
// @access  Private
exports.getRecordsByType = async (req, res) => {
    try {
        const { type } = req.query;
        let query = { patient: req.user._id };

        if (type) {
            query.type = type;
        }

        const records = await MedicalRecord.find(query)
            .populate('doctor', 'name specialization')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: records.length,
            data: records,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get activity log for medical records
// @route   GET /api/medical-records/activity/log
// @access  Private
exports.getActivityLog = async (req, res) => {
    try {
        const records = await MedicalRecord.find({ patient: req.user._id })
            .select('title type createdAt updatedAt')
            .sort('-updatedAt')
            .limit(20);

        const activity = records.map(record => ({
            id: record._id,
            action: `${record.type.replace('_', ' ').toUpperCase()} — ${record.title}`,
            time: getTimeAgo(record.createdAt),
            timestamp: record.createdAt,
            type: record.type,
            tag: record.type === 'prescription' ? 'Authorized' : 'Verified',
        }));

        res.status(200).json({
            success: true,
            data: activity,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Helper function to format time difference
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "min ago";
    return Math.floor(seconds) + "s ago";
}
