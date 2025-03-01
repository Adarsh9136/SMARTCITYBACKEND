const Service = require('../../models/service/serviceModel');

// Add a new service request
const addService = async (req, res) => {
  const { role, serviceDetails, contactMethod } = req.body;
  const user = req.user.userId;

  try {
    const newService = new Service({
      user,
      role,
      serviceDetails,
      contactMethod,
    });

    await newService.save();
    res.status(201).json({ message: 'Service request added successfully', service: newService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding service request', error: error.message });
  }
};

// Edit a service request
const editService = async (req, res) => {
  const { serviceId } = req.params;
  const { role, serviceDetails, contactMethod, status } = req.body;

  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    // Ensure the user is the one who created the request
    if (service.user.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to edit this request' });
    }

    // Update service details
    if (role) service.role = role;
    if (serviceDetails) service.serviceDetails = serviceDetails;
    if (contactMethod) service.contactMethod = contactMethod;
    if (status) service.status = status;

    await service.save();
    res.status(200).json({ message: 'Service request updated successfully', service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating service request', error: error.message });
  }
};

// Get all services of the current user
const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ user: req.user.userId })
      .populate('role', 'name')  // Populate role details
      .populate('user', 'name'); // Populate user details

    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

// Change the status of a service request
const changeServiceStatus = async (req, res) => {
  const { serviceId } = req.params;
  const {  status } = req.body;

  try {
    const validStatuses = ['pending', 'accepted', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    service.status = status;
    await service.save();

    res.status(200).json({ message: 'Service status updated successfully', service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error changing service status', error: error.message });
  }
};

// Delete a service request
const deleteService = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    // Ensure the user is the one who created the request
    if (service.user.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this request' });
    }

    await service.deleteOne();
    res.status(200).json({ message: 'Service request deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting service request', error: error.message });
  }
};

// Get all service requests by role
const getServicesByRole = async (req, res) => {
    const { roleId } = req.params;
  
    try {
      const services = await Service.find({ role: roleId })
        .populate('role', 'name')  // Populate role details
        .populate('user', 'name'); // Populate user details
  
      if (!services.length) {
        return res.status(404).json({ message: 'No services found for this role' });
      }
  
      res.status(200).json(services);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching services by role', error: error.message });
    }
  };
  
  module.exports = {
    addService,
    editService,
    getMyServices,
    changeServiceStatus,
    deleteService,
    getServicesByRole
  };