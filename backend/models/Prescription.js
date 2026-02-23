const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    medicines: [
        {
            name: { type: String, required: true },
            dosage: { type: String, required: true },
            duration: { type: String, required: true },
        }
    ],
    notes: {
        type: String,
    },
    reports: [
        {
            name: String,
            url: String,
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
