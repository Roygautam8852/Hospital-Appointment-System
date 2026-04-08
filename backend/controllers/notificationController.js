const Notification = require('../models/Notification');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// ─── Helper: generate & persist notifications from live data ─────────────────
const syncNotifications = async (userId) => {
    const now = new Date();
    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    // 1. Fetch patient's appointments and prescriptions in parallel
    const [appointments, prescriptions] = await Promise.all([
        Appointment.find({ patient: userId }).populate('doctor', 'name specialization'),
        Prescription.find({ patient: userId }).populate('doctor', 'name').sort({ createdAt: -1 }),
    ]);

    const ops = [];

    for (const appt of appointments) {
        const docName = appt.doctor?.name || 'your doctor';
        const apptDate = new Date(appt.date);
        const dateStr = apptDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

        // Upcoming reminder (within 48 hours, not cancelled)
        if (appt.status !== 'cancelled' && apptDate >= now && apptDate <= in48h) {
            ops.push({
                updateOne: {
                    filter: { user: userId, sourceId: appt._id, sourceEvent: 'reminder' },
                    update: {
                        $setOnInsert: {
                            user: userId,
                            title: 'Appointment Reminder',
                            message: `Your appointment with ${docName} is scheduled for ${dateStr} at ${appt.time}. Please arrive 10 minutes early.`,
                            type: 'reminder',
                            sourceType: 'appointment',
                            sourceId: appt._id,
                            sourceEvent: 'reminder',
                            read: false,
                        },
                    },
                    upsert: true,
                },
            });
        }

        // Payment confirmed
        if (appt.paymentStatus === 'paid' && appt.amount) {
            ops.push({
                updateOne: {
                    filter: { user: userId, sourceId: appt._id, sourceEvent: 'payment' },
                    update: {
                        $setOnInsert: {
                            user: userId,
                            title: 'Payment Confirmed',
                            message: `Payment of ₹${appt.amount} for consultation with ${docName} on ${dateStr} has been confirmed. Receipt has been sent to your email.`,
                            type: 'payment',
                            sourceType: 'appointment',
                            sourceId: appt._id,
                            sourceEvent: 'payment',
                            read: false,
                        },
                    },
                    upsert: true,
                },
            });
        }

        // Appointment confirmed by doctor
        if (appt.status === 'confirmed') {
            ops.push({
                updateOne: {
                    filter: { user: userId, sourceId: appt._id, sourceEvent: 'confirmed' },
                    update: {
                        $setOnInsert: {
                            user: userId,
                            title: 'Appointment Confirmed',
                            message: `${docName} has confirmed your appointment on ${dateStr} at ${appt.time}. See you there!`,
                            type: 'status',
                            sourceType: 'appointment',
                            sourceId: appt._id,
                            sourceEvent: 'confirmed',
                            read: false,
                        },
                    },
                    upsert: true,
                },
            });
        }

        // Appointment cancelled
        if (appt.status === 'cancelled') {
            ops.push({
                updateOne: {
                    filter: { user: userId, sourceId: appt._id, sourceEvent: 'cancelled' },
                    update: {
                        $setOnInsert: {
                            user: userId,
                            title: 'Appointment Cancelled',
                            message: `Your appointment with ${docName} scheduled for ${dateStr} has been cancelled. Please rebook at your convenience.`,
                            type: 'status',
                            sourceType: 'appointment',
                            sourceId: appt._id,
                            sourceEvent: 'cancelled',
                            read: false,
                        },
                    },
                    upsert: true,
                },
            });
        }

        // Appointment completed
        if (appt.status === 'completed') {
            ops.push({
                updateOne: {
                    filter: { user: userId, sourceId: appt._id, sourceEvent: 'completed' },
                    update: {
                        $setOnInsert: {
                            user: userId,
                            title: 'Consultation Completed',
                            message: `Your consultation with ${docName} on ${dateStr} is complete. Please rate your experience and check your prescription in Medical Records.`,
                            type: 'info',
                            sourceType: 'appointment',
                            sourceId: appt._id,
                            sourceEvent: 'completed',
                            read: false,
                        },
                    },
                    upsert: true,
                },
            });
        }
    }

    // Prescriptions
    for (const rx of prescriptions) {
        const docName = rx.doctor?.name || 'your doctor';
        ops.push({
            updateOne: {
                filter: { user: userId, sourceId: rx._id, sourceEvent: 'prescription' },
                update: {
                    $setOnInsert: {
                        user: userId,
                        title: 'Prescription Updated',
                        message: `${docName} has issued a new prescription with ${rx.medicines?.length || 0} medication(s). View it in your Medical Records.`,
                        type: 'prescription',
                        sourceType: 'prescription',
                        sourceId: rx._id,
                        sourceEvent: 'prescription',
                        read: false,
                    },
                },
                upsert: true,
            },
        });
    }

    if (ops.length > 0) {
        await Notification.bulkWrite(ops, { ordered: false });
    }
};

// ─── Controllers ─────────────────────────────────────────────────────────────

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
    try {
        // Auto-generate from live appointment/prescription data
        await syncNotifications(req.user.id);

        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { read: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
        res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
        res.status(200).json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete all notifications for user
// @route   DELETE /api/notifications
// @access  Private
exports.deleteAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ user: req.user.id });
        res.status(200).json({ success: true, message: 'All notifications cleared' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get unread count (for badge in sidebar)
// @route   GET /api/notifications/unread-count
// @access  Private
exports.getUnreadCount = async (req, res) => {
    try {
        await syncNotifications(req.user.id);
        const count = await Notification.countDocuments({ user: req.user.id, read: false });
        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
