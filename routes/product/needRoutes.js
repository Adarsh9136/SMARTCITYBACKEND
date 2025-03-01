const express = require('express');
const {
  addNeed,
  editNeed,
  getMyNeeds,
  getShopNeedsById,
  changeNeedStatus,
  deleteNeed
} = require('../../controllers/product/needController');
const authMiddleware = require('../../middleware/authMiddleware'); // Import the authMiddleware

const router = express.Router();

// Add a new need (protected route)
router.post('/', authMiddleware, addNeed);

// Edit an existing need (protected route)
router.put('/:needId', authMiddleware, editNeed);

// Change the status of a need (protected route)
router.put('/status/:needId', authMiddleware, changeNeedStatus);

// Delete a need (protected route)
router.delete('/:needId', authMiddleware, deleteNeed);

// Get all needs for the current user (protected route)
router.get('/my-needs', authMiddleware, getMyNeeds);

// Get needs by shop ID (protected route)
router.get('/shop', authMiddleware, getShopNeedsById);


module.exports = router;
