import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('/api/appointments');
        setAppointments(response.data);
      } catch (err) {
        setError('Failed to fetch appointments');
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const cancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(`/api/appointments/${appointmentId}`);
      setAppointments(appointments.filter(app => app._id !== appointmentId));
    } catch (err) {
      setError('Failed to cancel appointment');
      console.error('Error canceling appointment:', err);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        
  <Grid container spacing={6} justifyContent="center" alignItems="center">
          {/* Quick Actions */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 5, height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '1.25rem' }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 2 }}
                href="/doctors"
              >
                Book New Appointment
              </Button>
              {user?.role === 'doctor' && (
                <Button
                  variant="outlined"
                  fullWidth
                  href="/availability"
                >
                  Manage Availability
                </Button>
              )}
            </Paper>
          </Grid>

          {/* Upcoming Appointments */}
          <Grid item xs={12} md={7}>
            <Paper sx={{
              p: 5,
              position: 'relative',
              minHeight: 400,
              backgroundImage: 'url(https://c8y.doxcdn.com/image/upload/c_fill,fl_progressive,h_700,q_auto,w_1400/lhlv1vbxddwmzsmwbtqh.gif)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              fontSize: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Upcoming Appointments
                </Typography>
                {appointments.length > 0 ? (
                  <List>
                    {appointments.map((appointment, index) => (
                      <Box key={appointment._id}>
                        {index > 0 && <Divider />}
                        <ListItem
                          secondaryAction={
                            <Button
                              color="error"
                              onClick={() => cancelAppointment(appointment._id)}
                            >
                              Cancel
                            </Button>
                          }
                        >
                          <ListItemText
                            primary={
                              user?.role === 'patient'
                                ? `Dr. ${appointment.doctor.name}`
                                : appointment.patient.name
                            }
                            secondary={`${format(
                              new Date(appointment.date),
                              'PPP'
                            )} at ${format(new Date(appointment.date), 'p')}`}
                          />
                        </ListItem>
                      </Box>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">
                    No upcoming appointments
                  </Typography>
                )}
              </Box>
              {/* Overlay for readability */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(255,255,255,0.7)',
                zIndex: 1,
              }} />
            </Paper>
          </Grid>

          {/* Statistics or Additional Info */}
          {user?.role === 'doctor' && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Practice Overview
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {appointments.length}
                      </Typography>
                      <Typography variant="body1">
                        Upcoming Appointments
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {appointments.filter(app => 
                          new Date(app.date).toDateString() === new Date().toDateString()
                        ).length}
                      </Typography>
                      <Typography variant="body1">
                        Today's Appointments
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {/* This would come from the backend in a real app */}
                        4.8
                      </Typography>
                      <Typography variant="body1">
                        Average Rating
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}
