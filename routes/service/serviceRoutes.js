const express = require('express');
const {
  addService,
  editService,
  getMyServices,
  changeServiceStatus,
  deleteService,
  getServicesByRole
} = require('../../controllers/service/serviceController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

// Add a new service request (Protected Route)
router.post('/', authMiddleware, addService);

// Edit an existing service request (Protected Route)
router.put('/:serviceId', authMiddleware, editService);

// Change the status of a service request (Protected Route)
router.put('/status/:serviceId', authMiddleware, changeServiceStatus);

// Delete a service request (Protected Route)
router.delete('/:serviceId', authMiddleware, deleteService);

// Get all service requests of the current user (Protected Route)
router.get('/my-services', authMiddleware, getMyServices);

// Get all services by role (Public Route)
router.get('/role/:roleId', getServicesByRole);

module.exports = router;
