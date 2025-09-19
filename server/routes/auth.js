const express = require('express');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const router = express.Router();
// Register endpoint (demo: allows any details)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, specialization, experience } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new User({ name, email, password, role, specialization, experience });
    await user.save();
  // Return a fake token for demo purposes
  res.status(201).json({ message: 'User registered successfully', token: 'demo-jwt-token', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint (demo: auto-register if not exists, skip password check)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, password, name: email.split('@')[0] });
      await user.save();
    }
    // For demo, skip password check and JWT
  // Return a fake token for demo purposes
  res.json({ message: 'Login successful', token: 'demo-jwt-token', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user (demo: returns first user)
router.get('/me', async (req, res) => {
  try {
    const user = await User.findOne();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor's available time slots
router.get('/doctors/:id/time-slots', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select('availableTimeSlots');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    // Get booked appointments for the doctor
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookedAppointments = await Appointment.find({
      doctor: req.params.id,
      date: { $gte: today },
      status: { $ne: 'cancelled' }
    }).select('date timeSlot');
    const availableSlots = {};
    const next7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0];
    });
    next7Days.forEach(date => {
      availableSlots[date] = doctor.availableTimeSlots.filter(slot => {
        return !bookedAppointments.some(app =>
          app.date.toISOString().split('T')[0] === date &&
          app.timeSlot === slot
        );
      });
    });
    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
// DEMO: Seed 10 doctors if not present
async function seedDemoDoctors() {
  const count = await User.countDocuments({ role: 'doctor' });
  if (count < 10) {
    const specializations = [
      'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
      'Neurology', 'Oncology', 'Pediatrics', 'Psychiatry', 'Orthopedics', 'General Medicine'
    ];
    for (let i = count; i < 10; i++) {
      await User.create({
        name: `Dr. Demo${i+1}`,
        email: `doctor${i+1}@demo.com`,
        password: 'demo',
        role: 'doctor',
        specialization: specializations[i % specializations.length],
        experience: 5 + i,
        availableTimeSlots: [
          '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
          '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
        ]
      });
    }
  }
}
seedDemoDoctors();

// Get doctor details by ID
router.get('/doctors/:id', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booked slots for a doctor on a date
router.get('/appointments/slots/:doctorId', async (req, res) => {
  try {
    const { date } = req.query;
    const start = new Date(date);
    start.setHours(0,0,0,0);
    const end = new Date(date);
    end.setHours(23,59,59,999);
    const appointments = await Appointment.find({
      doctor: req.params.doctorId,
      date: { $gte: start, $lte: end },
      status: { $ne: 'cancelled' }
    }).select('timeSlot');
    const bookedSlots = appointments.map(a => a.timeSlot);
    res.json(bookedSlots);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});