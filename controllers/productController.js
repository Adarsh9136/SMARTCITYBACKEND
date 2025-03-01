const Product = require('../models/product/productModel');

// Add product
const addProduct = async (req, res) => {
  const { name, description, price, shop, category } = req.body;
  const user = req.user.userId;
  try {
    const newProduct = new Product({ name, user, description, price, shop, category });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('shop', 'name address')  // Populate shop details
      .populate('category', 'name'); // Populate category details

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Product not found', error: error.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('shop', 'name')   // Populate shop details
      .populate('category', 'name'); // Populate category details

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get products by category
const getProductByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await Product.find({ category: categoryId })
      .populate('shop', 'name') // Populate shop details
      .populate('category', 'name'); // Populate category details

    if (!products.length) {
      return res.status(404).json({ message: 'No products found in this category' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'No products found in this category', error: error.message });
  }
};

// Get products by shop
const getProductByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const products = await Product.find({ shop: shopId })
      .populate('category', 'name'); // Populate category details

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this shop' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products by shop', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  try {
    const product = await Product.findById(req.params.id); // Assuming product id is passed as URL parameter
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user making the request is the owner of the product
    const userIdFromRequest = req.user.userId; // The user ID from the decoded JWT token

    if (product.user.toString() !== userIdFromRequest.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this product' });
    }

    // Update product details
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;

    await product.save(); // Save the updated product

    res.status(200).json({
      message: 'Product updated successfully',
      product: product, // Include the updated product data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Search products with query parameters (name, description, price)
const searchProducts = async (req, res) => {
  const { queryParam } = req.query; // Single query parameter

  try {
    let searchCriteria = {};


    // Perform search using the criteria
    const products = await Product.find({
            $or: [ // Searching by either name or description
              { name: { $regex: queryParam, $options: 'i' } },
              { description: { $regex: queryParam, $options: 'i' } }
            ]
          });

    res.status(200).json(products); // Return the matching products
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching for products', error: error.message });
  }
};

// Filter products by a specific parameter (e.g., price range or category)
const filterProducts = async (req, res) => {
  const { priceMin, priceMax, category, shop } = req.query; // Expect query parameters

  try {
    let filterCriteria = {};

    // Build filter criteria dynamically based on available filters
    if (priceMin) filterCriteria.price = { $gte: priceMin }; // Filter by minimum price
    if (priceMax) filterCriteria.price = { ...filterCriteria.price, $lte: priceMax }; // Filter by maximum price
    if (category) filterCriteria.category = category; // Filter by category
    if (shop) filterCriteria.shop = shop; // Filter by shop

    // Perform the filter using the criteria
    const products = await Product.find(filterCriteria)
      .populate('shop', 'name')   // Populate shop details
      .populate('category', 'name'); // Populate category details

    res.status(200).json(products); // Return the filtered products
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error filtering products', error: error.message });
  }
};

module.exports = { addProduct, getProductById, getAllProducts, updateProduct, getProductByCategory, getProductByShop,
  searchProducts,
  filterProducts
 };
