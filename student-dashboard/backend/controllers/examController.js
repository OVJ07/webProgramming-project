const Exam = require('../models/examModel');

// Create new exam
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

// Get all exams for user
const getExams = async (req, res) => {
  try {
    const exams = await Exam.find({ userId: req.user._id });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete exam
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

// Get upcoming exams
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
