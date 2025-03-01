// routes/otpRoutes.js
const express = require('express');
const router = express.Router();
const { generateOtp, validateOtp } = require('../controllers/otpController'); // Import the logoutUser function

// Define the routes
router.post('/generate', generateOtp);
router.post('/validate', validateOtp);

module.exports = router;
