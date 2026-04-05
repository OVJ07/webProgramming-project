const express = require('express');
const { 
  createNote, 
  getNotes, 
  deleteNote 
} = require('../controllers/notesController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createNote)
  .get(protect, getNotes);

router.route('/:id')
  .delete(protect, deleteNote);

module.exports = router;
