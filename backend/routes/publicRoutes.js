const express = require('express');
const router = express.Router();
const { getAllServices } = require('../controllers/serviceController');

// Public routes for landing page
router.get('/services', getAllServices);

module.exports = router;
