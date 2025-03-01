const ServiceRole = require('../../models/service/serviceRoleModel');

// Add a new service role
const addServiceRole = async (req, res) => {
  const { name } = req.body;

  try {
    const existingRole = await ServiceRole.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: 'Service role already exists' });
    }

    const newRole = new ServiceRole({ name });
    await newRole.save();

    res.status(201).json({ message: 'Service role added successfully', role: newRole });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding service role', error: error.message });
  }
};

// Get all service roles
const getAllServiceRoles = async (req, res) => {
  try {
    const roles = await ServiceRole.find();
    res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching service roles', error: error.message });
  }
};

// Get a single service role by ID
const getServiceRoleById = async (req, res) => {
  const { roleId } = req.params;

  try {
    const role = await ServiceRole.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: 'Service role not found' });
    }
    res.status(200).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching service role', error: error.message });
  }
};

// Edit a service role
const editServiceRole = async (req, res) => {
  const { roleId } = req.params;
  const { name } = req.body;

  try {
    const role = await ServiceRole.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: 'Service role not found' });
    }

    role.name = name || role.name;
    await role.save();

    res.status(200).json({ message: 'Service role updated successfully', role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating service role', error: error.message });
  }
};

// Delete a service role
const deleteServiceRole = async (req, res) => {
  const { roleId } = req.params;

  try {
    const role = await ServiceRole.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: 'Service role not found' });
    }

    await role.deleteOne();

    res.status(200).json({ message: 'Service role deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting service role', error: error.message });
  }
};

module.exports = {
  addServiceRole,
  getAllServiceRoles,
  getServiceRoleById,
  editServiceRole,
  deleteServiceRole,
};
