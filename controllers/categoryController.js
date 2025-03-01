const Category = require('../models/product/categoryModel');

// Add a new category
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const newCategory = new Category({ name, description });
    await newCategory.save();

    res.status(201).json({ message: 'Category added successfully', category: newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an existing category
exports.updateCategory = async (req, res) => {
  try {
    const { id, name, description } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();

    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve a category (Admin only)
exports.approveCategory = async (req, res) => {
  try {
    const { id } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if(category.isApproved){
      category.isApproved = false;

      await category.save();

      return res.status(200).json({ message: 'Category rejected successfully', category });
    }
    category.isApproved = true;
    await category.save();

    res.status(200).json({ message: 'Category approved successfully', category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Get all categories from the database

    res.status(200).json({ categories }); // Return the categories as a response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving categories', error: error.message });
  }
};