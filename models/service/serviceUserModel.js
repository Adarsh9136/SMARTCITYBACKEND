const mongoose = require('mongoose');

const serviceUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  isApproved: { type: Boolean, default: false }, // Admin approval status
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRole' }], // Roles the user is assigned to
  createdAt: { type: Date, default: Date.now }, // Date when the service user was created
});

module.exports = mongoose.model('ServiceUser', serviceUserSchema);
