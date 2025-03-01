const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: [String], enum: ['CUSTOMER','SHOPKEEPER','SERVICEPERSON','ADMIN'], default: 'CUSTOMER' },
  profilePicture: { type: String },
  createdAt: { type: Date, default: Date.now },

  //Associations
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

});

// Middleware to hash password before saving it to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass any error to the next middleware
  }
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
