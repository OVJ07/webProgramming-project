const Attendance = require('../models/attendanceModel');

// @desc    Create attendance record
// @route   POST /api/attendance
// @access  Private
const createAttendance = async (req, res) => {
  try {
    const { subject, present, total } = req.body;

    const attendance = await Attendance.create({
      userId: req.user._id,
      subject,
      present,
      total,
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all attendance records for user
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res) => {
  try {
    const attendances = await Attendance.find({ userId: req.user._id });
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private
const updateAttendance = async (req, res) => {
  try {
    const { subject, present, total } = req.body;
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (attendance.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    attendance.subject = subject || attendance.subject;
    attendance.present = present !== undefined ? present : attendance.present;
    attendance.total = total !== undefined ? total : attendance.total;

    const updatedAttendance = await attendance.save();
    res.json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (attendance.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendance record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
};
