const validateAppointment = (req, res, next) => {
  const { doctorId, date, timeSlot, symptoms } = req.body;

  // Check for required fields
  if (!doctorId || !date || !timeSlot || !symptoms) {
    return res.status(400).json({
      success: false,
      error: 'Please provide all required fields'
    });
  }

  // Validate date (allow today and future for demo)
  const appointmentDate = new Date(date);
  const now = new Date();
  now.setHours(0,0,0,0);
  if (appointmentDate < now) {
    return res.status(400).json({
      success: false,
      error: 'Appointment date must be today or in the future'
    });
  }

  // Validate time slot format
  const validTimeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];
  if (!validTimeSlots.includes(timeSlot)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid time slot'
    });
  }

  next();
};

const validateRegistration = (req, res, next) => {
  // For demo: allow any details, skip validation
  next();
};

module.exports = {
  validateAppointment,
  validateRegistration
};
