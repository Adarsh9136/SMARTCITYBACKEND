const express = require('express');
const { 
    addProduct, 
    getProductById, 
    getAllProducts,
    getProductByCategory,
    getProductByShop, 
    updateProduct,
    searchProducts,
    filterProducts 
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');  
const restrictTo = require('../middleware/authRestrict');  

const router = express.Router();

router.post('/product', authMiddleware, restrictTo(['SHOPKEEPER']), addProduct);

// Route to get all products  remove this in future
router.get('/products', getAllProducts);

// Route to get product by its ID
router.get('/product/:id', getProductById);

// Route to get products by category (category ID passed as parameter)
router.get('/category/:categoryId', getProductByCategory);

// Route to get products by shop (shop ID passed as parameter)
router.get('/shop/:shopId', getProductByShop);

// Route to update product (only accessible by the user who created the product)
router.put('/product/:id', authMiddleware, restrictTo(['SHOPKEEPER']), updateProduct);

router.get('/search', getProductByShop);

router.get('/filter', getProductByShop);

module.exports = router;
