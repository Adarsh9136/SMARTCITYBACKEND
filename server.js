// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const session = require('express-session');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');  
const otpRoutes = require('./routes/otpRoutes');  
const categoryRoutes = require('./routes/categoryRoutes');  
const shopRoutes = require('./routes/shopRoutes');
const requestRoutes = require('./routes/product/requestRoutes');
const needRoutes = require('./routes/product/needRoutes');
const productReviewRoutes = require('./routes/product/productReviewRoutes');
const serviceRoutes = require('./routes/service/serviceRoutes');
const serviceRoleRoutes = require('./routes/service/serviceRoleRoutes');
const serviceUserRoutes = require('./routes/service/serviceUserRoutes');
const userServiceRatingRoutes = require('./routes/service/userServiceRatingRoutes');

const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();

const app = express();

// Enable CORS for your frontend URL
const corsOptions = {
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // If you need cookies or credentials with the request
};

// Use CORS middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/products', productRoutes);  
app.use('/api/users', authMiddleware, userRoutes);       // Protect user routes
app.use('/api/category', categoryRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/request', requestRoutes); 
app.use('/api/need', needRoutes); 
app.use('/api/productReview', productReviewRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/serviceRole', serviceRoleRoutes);
app.use('/api/serviceUser', serviceUserRoutes);
app.use('/api/serviceUserRating', userServiceRatingRoutes);


const PORT = process.env.PORT || 5000;
const HOST = '192.168.1.6';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
