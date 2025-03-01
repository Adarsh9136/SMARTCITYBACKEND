const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true }, // Reference to Shop
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to Shop
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },   
  createdAt: { type: Date, default: Date.now },
  images: { type: [String] }
});

module.exports = mongoose.model('Product', productSchema);
