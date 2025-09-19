const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');
const { validateAppointment } = require('../middleware/validation');

// @route   POST /api/appointments
// @desc    Create new appointment
router.post('/', validateAppointment, async (req, res) => {
  try {
    const { doctorId, date, timeSlot, symptoms } = req.body;
    // For demo, get user from first User in DB
    const User = require('../models/User');
    const user = await User.findOne();
    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: user ? user._id : undefined,
      date,
      timeSlot,
      symptoms
    });
    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/appointments
// @desc    Get user appointments
router.get('/', async (req, res) => {
  try {
    // For demo, get user from first User in DB
    const User = require('../models/User');
    const user = await User.findOne();
    let query = {};
    if (user && user.role === 'patient') {
      query.patient = user._id;
    } else if (user && user.role === 'doctor') {
      query.doctor = user._id;
    }
    const appointments = await Appointment.find(query).populate('doctor patient');
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/appointments
// @desc    Create new appointment
router.post('/', validateAppointment, async (req, res) => {
  try {
    const { doctorId, date, timeSlot, symptoms } = req.body;
    
    const appointment = await Appointment.create({
      doctor: doctorId,
      date,
      timeSlot,
      symptoms
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/appointments
// @desc    Get user appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
