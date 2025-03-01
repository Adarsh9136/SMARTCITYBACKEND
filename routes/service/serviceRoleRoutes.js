const express = require('express');
const {
  addServiceRole,
  getAllServiceRoles,
  getServiceRoleById,
  editServiceRole,
  deleteServiceRole
} = require('../../controllers/service/serviceRoleController');
const authMiddleware = require('../../middleware/authMiddleware'); // Ensure only authorized users can modify roles

const router = express.Router();

// Add a new service role (protected route)
router.post('/', authMiddleware, addServiceRole);

// Get all service roles (public)
router.get('/', getAllServiceRoles);

// Get a single service role by ID (public)
router.get('/:roleId', getServiceRoleById);

// Edit a service role (protected)
router.put('/:roleId', authMiddleware, editServiceRole);

// Delete a service role (protected)
router.delete('/:roleId', authMiddleware, deleteServiceRole);

module.exports = router;
