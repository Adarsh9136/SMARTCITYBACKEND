const express = require('express');

const { 
  addShop, 
  updateShop, 
  approveShop, 
  getShopById, 
  getMyShops, 
  getAllShops, 
  getShopsByCategories, 
  searchShops,
  searchShopQuery 
} = require('../controllers/shopController');
const authMiddleware = require('../middleware/authMiddleware');
const restrictTo = require('../middleware/authRestrict'); // Middleware to restrict access by roles

const router = express.Router();

// Route to add a new shop
router.post('/add', authMiddleware, addShop); // Only authenticated users can add shops

// Route to update an existing shop
router.put('/update', authMiddleware, updateShop); // Only authenticated users can update their own shops

// Route to approve a shop (Admin only)
router.put('/approve', authMiddleware, restrictTo(['ADMIN']), approveShop); // Only Admins can approve

// Route to get a shop by ID
router.get('/id/:shopId', getShopById); // Publicly accessible (or can be restricted as needed)

// Route to get all shops by user ID (owner)
router.get('/user', authMiddleware, getMyShops); // Only the owner can retrieve their shops

// Route to get all shops (public use)
router.get('/all', getAllShops); // Public route to get all shops

// Route to get shops by multiple category IDs
router.get('/by-categories', getShopsByCategories); // Takes an array of category IDs in the request body

// Route to search shops with filters (name, description, city, etc.)
router.get('/search', searchShops); // Allows searching based on query parameters (e.g., ?name=shop&city=NewYork)

router.get('/searchquery', searchShopQuery); // Allows searching based on query parameters (e.g., ?name=shop&city=NewYork)

module.exports = router;
