import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  TextField,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Chip,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays, isAfter, isBefore, isSameDay } from 'date-fns';
import axios from 'axios';

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
];

export default function AppointmentBooking() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    const fetchDoctorAndSlots = async () => {
      try {
        // Fetch doctor details
        const doctorResponse = await axios.get(`/api/auth/doctors/${doctorId}`);
        setDoctor(doctorResponse.data);
        
        // Fetch booked slots for the selected date
        const slotsResponse = await axios.get(
          `/api/auth/appointments/slots/${doctorId}`,
          { params: { date: format(selectedDate, 'yyyy-MM-dd') } }
        );
        setBookedSlots(slotsResponse.data);
      } catch (err) {
        setError('Failed to fetch doctor information');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorAndSlots();
  }, [doctorId, selectedDate]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setSelectedTime('');
  };

  const isTimeSlotAvailable = (time) => {
    return !bookedSlots.includes(time);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTime) {
      setError('Please select a time slot');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('/api/appointments', {
        doctorId,
        date: `${format(selectedDate, 'yyyy-MM-dd')}`,
        timeSlot: selectedTime,
        symptoms
      });
      navigate('/dashboard', {
        state: { message: 'Appointment booked successfully!' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!doctor) {
    return <Typography color="error">Doctor not found</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Book Appointment
        </Typography>

        {/* Doctor Info Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar
                  alt={doctor.name}
                  src={doctor.profilePicture}
                  sx={{ width: 80, height: 80 }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="h6">
                  Dr. {doctor.name}
                </Typography>
                <Chip
                  label={doctor.specialization}
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Paper sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Date Selection */}
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    maxDate={addDays(new Date(), 30)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Symptoms */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Symptoms / Reason for Visit"
                  multiline
                  rows={4}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  helperText="Describe your symptoms or reason for booking"
                  required
                />
              </Grid>

              {/* Time Slots */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Available Time Slots
                </Typography>
                <Grid container spacing={1}>
                  {timeSlots.map((time) => (
                    <Grid item xs={6} sm={4} md={3} key={time}>
                      <Button
                        fullWidth
                        variant={selectedTime === time ? "contained" : "outlined"}
                        onClick={() => setSelectedTime(time)}
                        disabled={!isTimeSlotAvailable(time)}
                        sx={{ mb: 1 }}
                      >
                        {time}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={submitting || !selectedTime}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Book Appointment'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
