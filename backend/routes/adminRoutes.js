const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getDashboardStats,
    getAllDoctors,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorById,
    getAllPatients,
    deletePatient,
    getAllAppointments,
    updateAppointmentStatus,
    sendBroadcastNotification,
    getSystemSettings,
} = require('../controllers/adminController');
const upload = require('../middleware/uploadMiddleware');
const serviceController = require('../controllers/serviceController');

// All admin routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard-stats', getDashboardStats);

// Doctors
router.get('/doctors', getAllDoctors);
router.post('/doctors', upload.single('profileImage'), addDoctor);
router.get('/doctors/:id', getDoctorById);
router.put('/doctors/:id', upload.single('profileImage'), updateDoctor);
router.delete('/doctors/:id', deleteDoctor);

// Patients
router.get('/patients', getAllPatients);
router.delete('/patients/:id', deletePatient);

// Appointments
router.get('/appointments', getAllAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);

// Services
router.get('/services', serviceController.getAllServices);
router.post('/services', upload.single('image'), serviceController.createService);
router.put('/services/:id', upload.single('image'), serviceController.updateService);
router.delete('/services/:id', serviceController.deleteService);

// Notifications Broadcast
router.post('/broadcast', sendBroadcastNotification);

// System Settings
router.get('/settings', getSystemSettings);

module.exports = router;
