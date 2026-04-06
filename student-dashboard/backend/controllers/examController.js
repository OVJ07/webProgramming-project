const Exam = require('../models/examModel');

// @desc    Create a new exam
// @route   POST /api/exams
// @access  Private
const createExam = async (req, res) => {
  try {
    const { subject, date, description } = req.body;

    const exam = await Exam.create({
      userId: req.user._id,
      subject,
      date,
      description,
    });

    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all exams for user
// @route   GET /api/exams
// @access  Private
const getExams = async (req, res) => {
  try {
    const exams = await Exam.find({ userId: req.user._id });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (exam.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get upcoming exams
// @route   GET /api/exams/upcoming
// @access  Private
const getUpcomingExams = async (req, res) => {
  try {
    const now = new Date();
    const exams = await Exam.find({
      userId: req.user._id,
      date: { $gte: now }
    }).sort({ date: 1 });

    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createExam,
  getExams,
  deleteExam,
  getUpcomingExams,
};
