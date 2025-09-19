import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Rating,
  Avatar,
  Chip,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('');
  const navigate = useNavigate();

  const specializations = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Pediatrics',
    'Psychiatry',
    'Orthopedics',
    'General Medicine'
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('/api/auth/doctors');
        setDoctors(response.data);
      } catch (err) {
        setError('Failed to fetch doctors');
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !specialization || doctor.specialization === specialization;
    return matchesSearch && matchesSpecialization;
  });

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Find a Doctor
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search doctors by name"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Specialization</InputLabel>
              <Select
                value={specialization}
                label="Specialization"
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <MenuItem value="">All Specializations</MenuItem>
                {specializations.map((spec) => (
                  <MenuItem key={spec} value={spec}>
                    {spec}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {Array.from({ length: Math.ceil(filteredDoctors.length / 2) }).map((_, rowIdx) => {
            const rowDoctors = filteredDoctors.slice(rowIdx * 2, rowIdx * 2 + 2);
            return (
              <Grid container item spacing={4} key={rowIdx} justifyContent="center">
                {rowDoctors.map((doctor) => (
                  <Grid item xs={12} sm={6} md={5} key={doctor._id} style={{ display: 'flex' }}>
                    <Card sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 340,
                      boxShadow: 6,
                    }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            alt={doctor.name}
                            src={doctor.profilePicture || '/static/images/avatar/doctor.jpg'}
                            sx={{ width: 56, height: 56, mb: 1 }}
                          />
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              {doctor.name}
                            </Typography>
                            <Chip
                              label={doctor.specialization}
                              color="primary"
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </Box>
                        </Box>
                        <Box sx={{ mb: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              <b>Experience:</b> {doctor.experience || '10+ years'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <b>Languages:</b> {doctor.languages?.join(', ') || 'English'}
                            </Typography>
                          </Box>
                          <Box>
                            <Rating value={doctor.rating || 4.5} readOnly precision={0.5} />
                            <Typography variant="body2" color="text.secondary">
                              {doctor.reviewCount || 24} reviews
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" paragraph sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                          {doctor.description || `Experienced ${doctor.specialization} specialist with a focus on patient care and well-being.`}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => navigate(`/book-appointment/${doctor._id}`)}
                        >
                          Book Appointment
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
                {rowDoctors.length < 2 && (
                  <Grid item xs={12} sm={6} md={5} style={{ display: 'flex' }} />
                )}
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Container>
  );
}
