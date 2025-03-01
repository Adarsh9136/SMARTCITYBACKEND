const Request = require('../../models/product/requestModel');

// Create a new request
const createRequest = async (req, res) => {
  const { category, description, images } = req.body;

  const user = req.user.userId;

  try {
    const newRequest = new Request({
      user,
      category,
      description,
      images,
    });

    await newRequest.save();
    res.status(201).json({ message: 'Request created successfully', request: newRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating request', error: error.message });
  }
};

// Update the status of a request
const updateRequestStatus = async (req, res) => {
  const { requestId, status } = req.body;

  try {
    if (!['pending', 'contacted', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if the logged-in user is the one who created the request
    if (request.user.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this request' });
    }

    request.status = status;
    await request.save();

    res.status(200).json({ message: 'Request status updated successfully', request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating request status', error: error.message });
  }
};

// Edit a request
const editRequest = async (req, res) => {
  const { requestId, category, description, images } = req.body;

  try {
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if the logged-in user is the one who created the request
    if (request.user.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to edit this request' });
    }

    // Update the request fields
    request.category = category || request.category;
    request.description = description || request.description;
    request.images = images || request.images;

    await request.save();

    res.status(200).json({ message: 'Request updated successfully', request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating request', error: error.message });
  }
};

// Delete a request
const deleteRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if the logged-in user is the one who created the request
    if (request.user.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this request' });
    }

    await request.remove(); // Delete the request

    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting request', error: error.message });
  }
};

// Get all requests for a specific user
const getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user.userId })
      .populate('user', 'name') // Populate user details
      .populate('category', 'name'); // Populate category details

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
};
// Get all requests (Admin or Authorized User)
const getAllRequests = async (req, res) => {
    try {
      const requests = await Request.find()
        .populate('user', 'name')  // Populate user details
        .populate('category', 'name');  // Populate category details
  
      res.status(200).json(requests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching all requests', error: error.message });
    }
  };
  
  // Get requests by a list of category IDs
  const getRequestsByCategoryIds = async (req, res) => {
    const { categoryIds } = req.body; // Expecting a comma-separated list of category IDs
    
    if (!categoryIds) {
      return res.status(400).json({ message: 'Category IDs are required' });
    }

  
    try {
      const requests = await Request.find({ category: { $in: categoryIds } })
        .populate('user', 'name')  // Populate user details
        .populate('category', 'name');  // Populate category details
  
      if (requests.length === 0) {
        return res.status(404).json({ message: 'No requests found for the given category IDs' });
      }
  
      res.status(200).json(requests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching requests by category', error: error.message });
    }
  };
  
  module.exports = { 
    createRequest, 
    updateRequestStatus, 
    editRequest, 
    deleteRequest, 
    getUserRequests, 
    getAllRequests,          // New endpoint to get all requests
    getRequestsByCategoryIds // New endpoint to get requests by category IDs
  };
