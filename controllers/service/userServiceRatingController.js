const ServiceReview = require('../../models/service/userServiceRatingModel');
const ServiceUser = require('../../models/service/serviceUserModel');

//    Add a new service review
const addServiceReview = async (req, res) => {
  const { serviceUserId, serviceId, reviewText, rating } = req.body;
  const userId = req.user.userId; // Extract user from auth middleware

  try {
    // Validate if service user exists
    const serviceUserExists = await ServiceUser.findById(serviceUserId);
    if (!serviceUserExists) {
      return res.status(404).json({ message: 'Service user not found' });
    }

    // Create a new review
    const newReview = new ServiceReview({
      userId,
      serviceUserId,
      serviceId,
      reviewText,
      rating,
    });

    await newReview.save();
    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};

//    Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await ServiceReview.find()
      .populate('userId', 'name')
      .populate('serviceUserId', 'userId')
      .populate('serviceId', 'serviceDetails');

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

//    Get all reviews for a service user
const getReviewsByServiceUser = async (req, res) => {
  const { serviceUserId } = req.params;

  try {
    const reviews = await ServiceReview.find({ serviceUserId })
      .populate('userId', 'name')
      .populate('serviceId', 'serviceDetails');

    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found for this service user' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

//    Get reviews for a specific service
const getReviewsByService = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const reviews = await ServiceReview.find({ serviceId })
      .populate('userId', 'name')
      .populate('serviceUserId', 'userId');

    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found for this service' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

//    Delete a review
const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await ServiceReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure the review belongs to the user
    if (review.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this review' });
    }

    await review.deleteOne();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};

//  Edit a service review
const editServiceReview = async (req, res) => {
    const { reviewId } = req.params;
    const { reviewText, rating } = req.body;
    const userId = req.user.userId; // Authenticated user
  
    try {
      const review = await ServiceReview.findById(reviewId);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      // Ensure the user who created the review is editing it
      if (review.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized to edit this review' });
      }
  
      // Update review fields
      if (reviewText) review.reviewText = reviewText;
      if (rating) {
        if (rating < 1 || rating > 5) {
          return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        review.rating = rating;
      }
  
      await review.save();
      res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating review', error: error.message });
    }
  };

  const getReviewsByRoleId = async (req, res) => {
    const { roleId } = req.params;
  
    try {
      // Find service users assigned to the given role
      const serviceUsers = await ServiceUser.find({ roles: roleId }).select('_id');
  
      if (!serviceUsers.length) {
        return res.status(404).json({ message: 'No service users found for this role' });
      }
  
      const serviceUserIds = serviceUsers.map((user) => user._id);
  
      // Find reviews for those service users
      const reviews = await ServiceReview.find({ serviceUserId: { $in: serviceUserIds } })
        .populate('userId', 'name') // Fetch user details
        .populate('serviceUserId', 'userId') // Fetch service user details
        .populate('serviceId', 'serviceDetails') // Fetch service details
        .sort({ createdAt: -1 });
  
      if (!reviews.length) {
        return res.status(404).json({ message: 'No reviews found for this role' });
      }
  
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching reviews by role ID', error: error.message });
    }
  };
  
  
module.exports = {
  addServiceReview,
  getAllReviews,
  getReviewsByServiceUser,
  getReviewsByService,
  deleteReview,
  editServiceReview,
  getReviewsByRoleId,
};
