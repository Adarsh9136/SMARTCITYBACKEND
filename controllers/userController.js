const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Get user profile (protected route)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Get the user from the decoded JWT payload
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user); // Return user details without the password
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile (protected route)
exports.updateUserProfile = async (req, res) => {
  const { name, email, password, role, profilePicture } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user details
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    if (role) user.role = role;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save(); // Save the updated user
    user.password = undefined;

    res.status(200).json({
      message: 'Profile updated successfully',
      user: user, // Include the updated user data without the password
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add product to favourites
exports.addToFavourites = async (req, res) => {
  try {
    const { productId } = req.body; // Product ID to add
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.favourites.includes(productId)) {
      return res.status(400).json({ message: 'Product already in favourites' });
    }

    user.favourites.push(productId);
    await user.save();

    res.status(200).json({ message: 'Product added to favourites', favourites: user.favourites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove product from favourites
exports.removeFromFavourites = async (req, res) => {
  try {
    const { productId } = req.body; // Product ID to remove
    const user = await User.findById(req.user.userId);


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.favourites.includes(productId)) {
      return res.status(400).json({ message: 'Product not in favourites' });
    }

    user.favourites = user.favourites.filter((id) => id.toString() !== productId); // Remove the productId
    await user.save();

    res.status(200).json({ message: 'Product removed from favourites', favourites: user.favourites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add Role to User
exports.addUserRole = async (req, res) => {
  const { newRole } = req.body;

  // Validate role input
  const validRoles = ['CUSTOMER', 'SHOPKEEPER', 'SERVICEPERSON'];
  if (!validRoles.includes(newRole)) {
    return res.status(400).json({ message: 'Invalid role specified.' });
  }

  try {
    // Find the user by ID
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the role already exists
    if (user.role.includes(newRole)) {
      return res.status(400).json({ message: 'Role already exists for this user.' });
    }

    // Add the new role
    user.role.push(newRole);
    await user.save();

    const token = jwt.sign(
      { 
        userId: user._id,
        name: user.name,
        email: user.email, 
        phone: user.phone, 
        role: user.role 
      }, // The user's unique ID
      process.env.JWT_SECRET, // Secret key (should be stored in .env)
      { expiresIn: '1h' } // The token will expire in 1 hour
    );    

    res.status(200).json({
      message: 'Role added successfully.',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
      token: token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Unable to add role.' });
  }
};
