const express = require('express');
const {
    getAppointments,
    bookAppointment,
    updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All routes protected

router.get('/', getAppointments);
router.post('/', authorize('patient', 'admin'), bookAppointment);
router.put('/:id', updateAppointmentStatus);

module.exports = router;
