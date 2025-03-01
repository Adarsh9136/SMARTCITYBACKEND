const Shop = require('../models/product/shopModel');

// Add a new shop
exports.addShop = async (req, res) => {
  const { name, description, addressLine1, addressLine2, city, state, pincode, country, contactNumber, categories, location } = req.body;

  try {
    const newShop = new Shop({
      name,
      description,
      owner: req.user.userId, // Owner is the logged-in user
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
      contactNumber,
      categories,
      location,
    });

    await newShop.save();
    res.status(201).json({ message: 'Shop added successfully', shop: newShop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding shop', error: error.message });
  }
};

// Update an existing shop
exports.updateShop = async (req, res) => {
  const { shopId, name, description, addressLine1, addressLine2, city, state, pincode, country, contactNumber, categories, location } = req.body;

  try {
    const shop = await Shop.findOne({ _id: shopId, owner: req.user.userId }); // Ensure only the owner can update

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found or unauthorized' });
    }

    // Update shop fields
    if (name) shop.name = name;
    if (description) shop.description = description;
    if (addressLine1) shop.addressLine1 = addressLine1;
    if (addressLine2) shop.addressLine2 = addressLine2;
    if (city) shop.city = city;
    if (state) shop.state = state;
    if (pincode) shop.pincode = pincode;
    if (country) shop.country = country;
    if (contactNumber) shop.contactNumber = contactNumber;
    if (categories) shop.categories = categories;
    if (location) shop.location = location;

    await shop.save();
    res.status(200).json({ message: 'Shop updated successfully', shop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating shop', error: error.message });
  }
};

// Approve a shop (Admin only)
exports.approveShop = async (req, res) => {
  const { shopId } = req.body;

  try {
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    if(shop.isApproved){
        shop.isApproved = false;
        await shop.save();
        return res.status(200).json({ message: 'Shop rejected successfully', shop });
    }

    shop.isApproved = true;
    await shop.save();

    res.status(200).json({ message: 'Shop approved successfully', shop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error approving shop', error: error.message });
  }
};

// Get a shop by ID
exports.getShopById = async (req, res) => {
  const { shopId } = req.params;

  try {
    const shop = await Shop.findById(shopId).populate('categories owner'); // Populate related data
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.status(200).json({ shop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving shop', error: error.message });
  }
};

// Get all shops by user ID (owner)
exports.getMyShops = async (req, res) => {

 const userId = req.user.userId;

  try {
    const shops = await Shop.find({ owner: userId }).populate('categories');
    res.status(200).json({ shops });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving shops', error: error.message });
  }
};

// Get all shops (Admin or public use)
exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate('categories owner');
    res.status(200).json({ shops });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving shops', error: error.message });
  }
};

// Get shops by multiple category IDs
exports.getShopsByCategories = async (req, res) => {
  const { categoryIds } = req.body; // Expecting an array of category IDs

  try {
    const shops = await Shop.find({
      categories: { $in: categoryIds }
    });
    res.status(200).json(shops); // Return the list of shops
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching shops by categories' });
  }
};

// Search shops with filters (e.g., name, description, city, etc.)
exports.searchShops = async (req, res) => {
  const { name, description, isApproved } = req.query; // Expect query parameters

  try {
    let searchCriteria = {};

    // Build search criteria dynamically based on available filters
    if (name) searchCriteria.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    if (description) searchCriteria.description = { $regex: description, $options: 'i' };
    if (isApproved !== undefined) searchCriteria.isApproved = isApproved; // Boolean check

    // Perform search using the criteria
    const shops = await Shop.find(searchCriteria);

    res.status(200).json(shops); // Return the matching shops
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching for shops' });
  }
};

exports.searchShopQuery = async (req, res) => {
    const { queryParam } = req.query; // Single query parameter
  
    try {
      let searchCriteria = {};
  
      // Check if the queryParam exists and search by name or description
      if (queryParam) {
        searchCriteria.name = { $regex: queryParam, $options: 'i' }; // Case-insensitive search by name
        searchCriteria.description = { $regex: queryParam, $options: 'i' }; // Case-insensitive search by description
      }
  
      // Perform the search using the search criteria
      const shops = await Shop.find({
        $or: [ // Searching by either name or description
          { name: { $regex: queryParam, $options: 'i' } },
          { description: { $regex: queryParam, $options: 'i' } }
        ]
      });
  
      res.status(200).json(shops); // Return the matching shops
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error searching for shops', error: error.message });
    }
  };
  