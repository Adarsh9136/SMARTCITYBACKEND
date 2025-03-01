const ServiceUser = require('../../models/service/serviceUserModel');

//    Add a new service user
const addServiceUser = async (req, res) => {
  const { userId, roles } = req.body;

  try {
    const newServiceUser = new ServiceUser({
      userId,
      roles,
      isApproved: false,
    });

    await newServiceUser.save();
    res.status(201).json({ message: 'Service user added successfully', serviceUser: newServiceUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding service user', error: error.message });
  }
};

//    Get all service users
const getAllServiceUsers = async (req, res) => {
  try {
    const serviceUsers = await ServiceUser.find()
      .populate('userId', 'name email')
      .populate('roles', 'name');

    res.status(200).json(serviceUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching service users', error: error.message });
  }
};

//    Get all service users by role ID
const getServiceUsersByRoleId = async (req, res) => {
  const { roleId } = req.params;

  try {
    const serviceUsers = await ServiceUser.find({ roles: roleId })
      .populate('userId', 'name email')
      .populate('roles', 'name');

    if (!serviceUsers.length) {
      return res.status(404).json({ message: 'No service users found for this role' });
    }

    res.status(200).json(serviceUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching service users by role', error: error.message });
  }
};

//    Approve or Reject a Service User
const updateApprovalStatus = async (req, res) => {
  const { serviceUserId, isApproved } = req.body;

  try {
    const serviceUser = await ServiceUser.findById(serviceUserId);
    if (!serviceUser) {
      return res.status(404).json({ message: 'Service user not found' });
    }

    serviceUser.isApproved = isApproved;
    await serviceUser.save();

    res.status(200).json({ message: 'Approval status updated successfully', serviceUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating approval status', error: error.message });
  }
};

module.exports = {
  addServiceUser,
  getAllServiceUsers,
  getServiceUsersByRoleId,
  updateApprovalStatus,
};
