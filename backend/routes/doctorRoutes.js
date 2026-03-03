const express = require('express');
const { getDoctors, getDoctorsByDept } = require('../controllers/doctorController');

const router = express.Router();

router.get('/', getDoctors);
router.get('/department/:dept', getDoctorsByDept);

module.exports = router;
