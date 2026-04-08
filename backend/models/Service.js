const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Activity' },
    image: { type: String },
    category: {
        type: String,
        enum: ['diagnostic', 'surgical', 'therapeutic', 'emergency', 'preventive', 'consultation', 'other'],
        default: 'other'
    },
    price: { type: Number, default: 0 },
    duration: { type: String, default: '30 mins' },
    isActive: { type: Boolean, default: true },
    department: { type: String },
    availableDays: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', serviceSchema);
