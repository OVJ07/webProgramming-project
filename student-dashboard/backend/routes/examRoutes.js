const express = require('express');
const { 
  createExam, 
  getExams, 
  deleteExam,
  getUpcomingExams
} = require('../controllers/examController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createExam)
  .get(protect, getExams);

router.route('/upcoming')
  .get(protect, getUpcomingExams);

router.route('/:id')
  .delete(protect, deleteExam);

module.exports = router;
