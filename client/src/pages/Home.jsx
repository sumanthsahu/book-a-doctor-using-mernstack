import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import doctorImage from '../assets/doctor-home.jpg';

export default function Home() {
  return (
    <Box
      sx={{
        pt: 8,
        pb: 6,
        minHeight: '100vh',
        backgroundImage: 'url(https://i.pinimg.com/originals/ff/b5/ab/ffb5ab50774ba5ab060e0674ff4689e2.gif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              component="h1"
              variant="h2"
              color="text.primary"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
              }}
            >
              Your Health, Our Priority
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              paragraph
              sx={{ mb: 4 }}
            >
              Book appointments with the best doctors in your area.
              Quick, easy, and secure scheduling for your healthcare needs.
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  component={RouterLink}
                  to="/doctors"
                  variant="contained"
                  size="large"
                  color="primary"
                >
                  Find a Doctor
                </Button>
              </Grid>
              <Grid item>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
                  size="large"
                >
                  Join as a Doctor
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Removed broken image. Background is now set for the whole page. */}
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ pt: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h4" color="primary" gutterBottom>
                24/7 Availability
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Book appointments anytime, anywhere. Our platform is always available
                for your healthcare needs.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h4" color="primary" gutterBottom>
                Expert Doctors
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Connect with experienced and qualified healthcare professionals
                across various specializations.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h4" color="primary" gutterBottom>
                Easy Booking
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Simple and intuitive appointment booking process. Schedule your
                visit in just a few clicks.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
