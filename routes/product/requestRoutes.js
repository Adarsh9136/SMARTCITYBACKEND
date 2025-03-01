const express = require('express');
const {
  createRequest,
  updateRequestStatus,
  editRequest,
  deleteRequest,
  getUserRequests,
  getRequestsByCategoryIds,
  getAllRequests
} = require('../../controllers/product/requestController');
const authMiddleware = require('../../middleware/authMiddleware'); // Import the authMiddleware

const router = express.Router();

// Create a new request (protected route)
router.post('/', authMiddleware, createRequest);

// Update request status (protected route)
router.put('/status', authMiddleware, updateRequestStatus);

// Edit an existing request (protected route)
router.put('/edit', authMiddleware, editRequest);

// Delete a request (protected route)
router.delete('/:requestId', authMiddleware, deleteRequest);

// Get all requests for a user (protected route)
router.get('/my-request', authMiddleware, getUserRequests);

// Get requests by categories list (protected route)
router.get('/categories', authMiddleware, getRequestsByCategoryIds);

// Get requests by categories list (protected route)
router.get('/all', authMiddleware, getAllRequests);

module.exports = router;
