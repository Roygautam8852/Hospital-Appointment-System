const express = require('express');
const router = express.Router();
const {
    getMedicalRecords,
    getMedicalRecord,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
    getRecordsByType,
    getActivityLog,
} = require('../controllers/medicalRecordsController');
const { protect } = require('../middleware/authMiddleware');

// Specific routes MUST come before parameterized routes
router.get('/activity/log', protect, getActivityLog);
router.get('/filter/by-type', protect, getRecordsByType);

// Main routes
router.route('/')
    .get(protect, getMedicalRecords)
    .post(protect, createMedicalRecord);

// Parameterized routes come last
router.route('/:id')
    .get(protect, getMedicalRecord)
    .put(protect, updateMedicalRecord)
    .delete(protect, deleteMedicalRecord);

module.exports = router;
