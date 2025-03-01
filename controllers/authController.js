const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const Otp = require('../models/otpModel');

// Signup Controller
exports.signup = async (req, res) => {
  const { name, phone, email, password, role, otp } = req.body;

  if (!name || !phone || !email || !password || !role || !otp) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const ipAddress = req.ip; 

    const isOtpValid = await validateOtpFn(email, otp, ipAddress);

    if (!isOtpValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Create a new user
    const newUser = new User({ name, phone, email, password, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Find the user by phone
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token (with user ID as the payload)
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

    // Send back the token as a response
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout Handler
exports.logoutUser = (req, res) => {
  // To logout, simply remove the token on the client side (no session management on the server)
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

// OTP Validation Function
const validateOtpFn = async (email, otp, ipAddress) => {
  try {
    // Find OTP record by phone
    const otpRecord = await Otp.findOne({ email });
    
    if (!otpRecord) {
      return false;
    }

    // Check if OTP has expired (for example, expire after 5 minutes)
    const otpAge = (Date.now() - otpRecord.createdAt) / 1000 / 60; // In minutes
    if (otpAge > 5) {
      return false;
    }

    // Check if OTP matches
    if (otp !== otpRecord.otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      // Check if max attempts exceeded
      if (otpRecord.attempts >= 3) {
        return false;
      }

      return false;
    }

    // OTP is valid, reset attempts counter
    otpRecord.attempts = 0;
    otpRecord.ipAddress = ipAddress;
    await otpRecord.save();

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
