const mongoose = require('mongoose');

const serviceReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who is giving the review
  serviceUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceUser', required: true }, // Service user who performed the service
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }, // Service that is being reviewed
  reviewText: { type: String }, // Review content or feedback
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating for the service (optional or can be included with review)
  createdAt: { type: Date, default: Date.now }, // Date when the review was posted
});

module.exports = mongoose.model('ServiceReview', serviceReviewSchema);
