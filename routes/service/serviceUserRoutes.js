const express = require('express');
const { 
  addServiceUser, 
  getAllServiceUsers, 
  getServiceUsersByRoleId,
  updateApprovalStatus
} = require('../../controllers/service/serviceUserController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

//   Create a new service user
router.post('/', authMiddleware, addServiceUser);

//   Get all service users
router.get('/', authMiddleware, getAllServiceUsers);

//   Get service users by role ID
router.get('/role/:roleId', authMiddleware, getServiceUsersByRoleId);

//   Approve or reject a service user
router.put('/approve', authMiddleware, updateApprovalStatus);

module.exports = router;
