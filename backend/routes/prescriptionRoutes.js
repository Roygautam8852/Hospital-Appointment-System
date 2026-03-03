const express = require('express');
const router = express.Router();
const { getPrescriptions, createPrescription } = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getPrescriptions)
    .post(protect, createPrescription);

module.exports = router;
