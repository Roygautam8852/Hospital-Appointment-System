const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['prescription', 'lab_report', 'imaging', 'other'],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    category: {
        type: String,
        enum: ['Cardiology', 'Neurology', 'Radiology', 'Haematology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General'],
        default: 'General',
    },
    fileUrl: {
        type: String,
    },
    fileName: {
        type: String,
    },
    fileSize: {
        type: String,
        default: '0 KB',
    },
    security: {
        type: String,
        enum: ['Encrypted', 'Verified'],
        default: 'Encrypted',
    },
    status: {
        type: String,
        enum: ['active', 'archived', 'reviewed', 'pending'],
        default: 'active',
    },
    medicines: [
        {
            name: String,
            dosage: String,
            duration: String,
        }
    ],
    labResults: {
        testName: String,
        resultValue: String,
        normalRange: String,
        unit: String,
    },
    imagingDetails: {
        bodyPart: String,
        imaging: String,
        findings: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
