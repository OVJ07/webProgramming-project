const express = require('express');
const { 
  createAttendance, 
  getAttendance, 
  updateAttendance, 
  deleteAttendance 
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createAttendance)
  .get(protect, getAttendance);

router.route('/:id')
  .put(protect, updateAttendance)
  .delete(protect, deleteAttendance);

module.exports = router;
