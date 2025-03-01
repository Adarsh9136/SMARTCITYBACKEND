const express = require('express');
const { addCategory, updateCategory, approveCategory, getCategories } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const restrictTo = require('../middleware/authRestrict');

const router = express.Router();

// Add a new category (Any authenticated user)
router.post('/', authMiddleware, restrictTo(['SHOPKEEPER', 'ADMIN']), addCategory);

// Update a category (Only SHOPKEEPER or ADMIN)
router.put('/', authMiddleware, restrictTo(['SHOPKEEPER', 'ADMIN']), updateCategory);

// Approve a category (Admin only)
router.put('/approve', authMiddleware, restrictTo(['ADMIN']), approveCategory);

router.get('/', getCategories);

module.exports = router;
