const Review = require('../../models/product/productReviewModel');

// Add a new review for a product
const addReview = async (req, res) => {
  const { product, rating, comment } = req.body;
  const user = req.user.userId;

  try {
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ product, user });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const newReview = new Review({
      product,
      user,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};

// Edit a review
const editReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure the user is the owner of the review
    if (review.user.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to edit this review' });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();
    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure the user is the owner of the review
    if (review.user.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this review' });
    }

    await review.deleteOne();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};

// Get all reviews for a product
const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name') // Populate user details
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

module.exports = {
  addReview,
  editReview,
  deleteReview,
  getProductReviews,
};
