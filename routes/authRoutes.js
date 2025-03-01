// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, login, logoutUser } = require('../controllers/authController'); // Import the logoutUser function

// Define the routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logoutUser); // Use the imported logoutUser function

module.exports = router;
