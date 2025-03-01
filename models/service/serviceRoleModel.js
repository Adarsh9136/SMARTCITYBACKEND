const mongoose = require('mongoose');

const serviceRoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }, // Optional 
  isApproved: { type: Boolean, default: false }, // Admin approval status
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ServiceRole', serviceRoleSchema);
