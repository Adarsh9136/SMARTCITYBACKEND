const mongoose = require('mongoose');

const needSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to User who requested the product
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  }, // Reference to the Product the user is interested in
  shop: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Shop', 
    required: true 
  }, // Reference to the Shop selling the product
  contactMethod: { 
    type: String, 
    enum: ['call', 'message'], 
    required: true, 
    default: 'call' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'contacted', 'closed'], 
    default: 'pending' 
  }, // Status of the request (pending, contacted, or closed)
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('Need', needSchema);
