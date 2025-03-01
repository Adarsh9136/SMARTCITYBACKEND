const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // User requesting the service
  role: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ServiceRole', 
    required: true 
  }, // Role (e.g., painter, cook) of the person providing the service
  serviceDetails: {
    type: String, 
    required: true, 
  }, // Description of the service request (e.g., painting a house)
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'completed'], 
    default: 'pending' 
  }, // Status of the service request (pending, accepted, completed)
  contactMethod: { 
    type: String, 
    enum: ['call', 'message'], 
    required: true, 
    default: 'call' 
  }, // How the user prefers to be contacted (call or message)
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('Service', serviceSchema);
