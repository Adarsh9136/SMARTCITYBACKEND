const Need = require('../../models/product/needModel');

// Add a new need
const addNeed = async (req, res) => {
  const { product, shop, contactMethod } = req.body;
  const user = req.user.userId;

  try {
    const newNeed = new Need({
      user,
      product,
      shop,
      contactMethod,
    });

    await newNeed.save();
    res.status(201).json({ message: 'Need added successfully', need: newNeed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding need', error: error.message });
  }
};

// Edit a need
const editNeed = async (req, res) => {
  const { needId } = req.params;
  const { product, shop, contactMethod, status } = req.body;

  try {
    const need = await Need.findById(needId);
    if (!need) {
      return res.status(404).json({ message: 'Need not found' });
    }

    // Ensure the user is the one who created the need
    if (need.user.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to edit this need' });
    }

    // Update the need
    if (product) need.product = product;
    if (shop) need.shop = shop;
    if (contactMethod) need.contactMethod = contactMethod;
    if (status) need.status = status;

    await need.save();
    res.status(200).json({ message: 'Need updated successfully', need });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error editing need', error: error.message });
  }
};

// Get all needs of the current user
const getMyNeeds = async (req, res) => {
  try {
    const needs = await Need.find({ user: req.user.userId })
      .populate('product', 'name')   // Populate product details
      .populate('shop', 'name')      // Populate shop details
      .populate('user', 'name');     // Populate user details

    res.status(200).json(needs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching needs', error: error.message });
  }
};

// Get all needs for a specific shop
const getShopNeedsById = async (req, res) => {
  const { shopId } = req.body;

  try {
    const needs = await Need.find({ shop: shopId })
      .populate('product', 'name')
      .populate('user', 'name');

    res.status(200).json(needs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching needs for this shop', error: error.message });
  }
};

// Change the status of a need
const changeNeedStatus = async (req, res) => {
  const { needId } = req.params;  // Extract needId from params
  const { status } = req.body;     // Extract status from body
  try {
    const validStatuses = ['pending', 'contacted', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const need = await Need.findById(needId);
    if (!need) {
      return res.status(404).json({ message: 'Need not found' });
    }

    // // Ensure the user is the one who created the need
    // if (need.user.toString() !== req.user.userId.toString()) {
    //   return res.status(403).json({ message: 'You are not authorized to update this need' });
    // }
    // shop can also change

    need.status = status;
    await need.save();

    res.status(200).json({ message: 'Need status updated successfully', need });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error changing need status', error: error.message });
  }
};

const deleteNeed = async (req, res) => {
  const { needId } = req.params;

  try {
    const need = await Need.findById(needId);
    if (!need) {
      return res.status(404).json({ message: 'Need not found' });
    }

    // Ensure the user is the one who created the need
    if (need.user.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this need' });
    }

    await need.deleteOne(); // Fix: Use deleteOne instead of remove

    res.status(200).json({ message: 'Need deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting need', error: error.message });
  }
};


module.exports = {
  addNeed,
  editNeed,
  getMyNeeds,
  getShopNeedsById,
  changeNeedStatus,
  deleteNeed,
};
