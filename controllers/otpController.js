const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure that your .env variables are loaded
const generateRandomOtp = require('../utils/generateOTP'); // Your OTP generation logic

const Otp = require('../models/otpModel');

// Create a transporter for Gmail using nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Gmail service
  auth: {
    user: process.env.EMAIL_USER, // Email from your .env
    pass: process.env.EMAIL_PASS, // Email password (or app-specific password)
    
  }
});

// Helper function to send OTP email
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email
    to: email, // Recipient's email
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}. Please use it to complete your registration.`
  };
  console.log('OTP SENDING.......');

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully!');
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Error sending OTP email');
  }
};

// Signup Controller
exports.generateOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if OTP already exists for the email
    let otpRecord = await Otp.findOne({ email });
    const ipAddress = req.ip; 
    if (otpRecord) {
      // If OTP already exists, update it with a new one
      otpRecord.otp = generateRandomOtp();
      otpRecord.attempts = 0;  // Reset the attempts on new OTP generation
      otpRecord.createdAt = Date.now(); // Update the timestamp
      otpRecord.ipAddress = ipAddress;

    } else {
      // Create a new OTP record
      otpRecord = new Otp({
        email: email,
        otp: generateRandomOtp(),
        attempts: 0,
        ipAddress: ipAddress 
      });
    }

    // Save OTP record
    await otpRecord.save();

    // Send the OTP via email
    await sendOtpEmail(email, otpRecord.otp);


    return res.status(200).json({ message: 'OTP generated successfully', otp: otpRecord.otp, data:otpRecord });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}

// Validate OTP Controller
exports.validateOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const ipAddress = req.ip; 
    // Find OTP record by email
    const otpRecord = await Otp.findOne({ phone });
    
    if (!otpRecord) {
      return res.status(400).json({ message: 'No OTP record found for this email' });
    }

    // Check if OTP has expired (for example, expire after 5 minutes)
    const otpAge = (Date.now() - otpRecord.createdAt) / 1000 / 60; // In minutes
    if (otpAge > 5) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Check if OTP matches
    if (otp !== otpRecord.otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      // Check if max attempts exceeded
      if (otpRecord.attempts >= 3) {
        return res.status(400).json({ message: 'Too many failed attempts. Generate New OTP.' });
      }

      return res.status(400).json({ message: 'Invalid OTP. Try again.' });
    }

    // OTP is valid, reset attempts counter
    otpRecord.attempts = 0;
    otpRecord.ipAddress = ipAddress; 
    await otpRecord.save();

    return res.status(200).json({ message: 'OTP validated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}
