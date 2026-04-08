const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['reminder', 'payment', 'report', 'security', 'info', 'prescription', 'status'],
        default: 'info',
    },
    read: { type: Boolean, default: false },
    // Deduplication: track which real-world event created this notification
    sourceType: {
        type: String,
        enum: ['appointment', 'prescription', 'system'],
        default: 'system',
    },
    sourceId: { type: mongoose.Schema.Types.ObjectId },
    // Sub-type for same sourceId (e.g. 'reminder' vs 'payment' for same appointment)
    sourceEvent: { type: String },
}, { timestamps: true });

// Unique constraint: one notification per user+source+event combination
notificationSchema.index({ user: 1, sourceId: 1, sourceEvent: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Notification', notificationSchema);
