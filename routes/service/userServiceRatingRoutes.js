const express = require('express');
const { 
  addServiceReview, 
  getAllReviews, 
  getReviewsByServiceUser, 
  getReviewsByService,
  deleteReview,
  editServiceReview,
  getReviewsByRoleId
} = require('../../controllers/service/userServiceRatingController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

//    Add a service review
router.post('/', authMiddleware, addServiceReview);

//    Get all reviews
router.get('/', authMiddleware, getAllReviews);

//    Get reviews for a specific service user
router.get('/user/:serviceUserId', authMiddleware, getReviewsByServiceUser);

//    Get reviews for a specific service
router.get('/service/:serviceId', authMiddleware, getReviewsByService);

//    Delete a review
router.delete('/:reviewId', authMiddleware, deleteReview);

//    Edit a review
router.put('/:reviewId', authMiddleware, editServiceReview);

router.get('/role/:roleId', authMiddleware, getReviewsByRoleId);

module.exports = router;
