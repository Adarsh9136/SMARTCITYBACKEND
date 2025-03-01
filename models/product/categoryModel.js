const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  isApproved: { type: Boolean, default: false }, // Admin approval status
  createdAt: { type: Date, default: Date.now },
  image: { type: String }
});

module.exports = mongoose.model('Category', categorySchema);
