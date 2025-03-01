// routes/userRoutes.js
const express = require('express');
const { getUserProfile, updateUserProfile, addToFavourites, removeFromFavourites, addUserRole } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');  // Import the authMiddleware

const router = express.Router();

// Get user profile (protected route)
router.get('/profile', getUserProfile);

// Update user profile (protected route)
router.put('/profile', updateUserProfile);

// Add product to favourites
router.put('/favourites/add', addToFavourites);

// Remove product from favourites
router.put('/favourites/remove', removeFromFavourites);

router.patch('/add-role', addUserRole);

module.exports = router;
