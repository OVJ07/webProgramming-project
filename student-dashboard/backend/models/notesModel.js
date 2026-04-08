const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    enum: ['WEBDEV', 'CAO', 'PROBABILITY', 'DAA', 'TOC', 'MPMC'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);
