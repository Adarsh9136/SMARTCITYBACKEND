const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  category: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  status: { 
    type: String, 
    enum: ['pending', 'contacted', 'closed'], 
    default: 'pending' 
  }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', requestSchema);
