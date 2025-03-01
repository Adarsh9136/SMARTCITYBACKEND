const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
  description: { type: String },
  isApproved: { type: Boolean, default: false }, // Admin approval status

   // Separate address fields
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, required: true },

  contactNumber: { type: String, required: true },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // List of category references
  isApproved: { type: Boolean, default: false }, // Admin approval status
  location: {
    type: {
      type: String,
      enum: ['Point'], // GeoJSON type
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere', // For geospatial queries
    },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Shop', shopSchema);
