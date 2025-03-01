const express = require('express');
const {
  addReview,
  editReview,
  deleteReview,
  getProductReviews
} = require('../../controllers/product/productReviewController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

// Add a review for a product (Protected Route)
router.post('/', authMiddleware, addReview);

// Edit a review (Protected Route)
router.put('/:reviewId', authMiddleware, editReview);

// Delete a review (Protected Route)
router.delete('/:reviewId', authMiddleware, deleteReview);

// Get all reviews for a specific product
router.get('/:productId', getProductReviews);

module.exports = router;
