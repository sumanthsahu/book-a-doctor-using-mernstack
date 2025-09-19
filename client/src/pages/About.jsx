import { Container, Typography, Box } from '@mui/material';

export default function About() {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmU6XjCDW3ZKiDVif2rV5cce8IhOXTaTZyfw&s" alt="Medical field" style={{ maxWidth: '100%', height: 220, borderRadius: 12, objectFit: 'cover' }} />
        </Box>
        <Typography variant="h3" color="primary" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Welcome to Book-A-Doctor! Our mission is to make healthcare accessible and convenient for everyone. We connect patients with experienced doctors across various specializations, enabling easy appointment booking and seamless communication.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Our platform is designed to provide 24/7 availability, expert medical advice, and a user-friendly experience. Whether you need a routine checkup or specialized care, Book-A-Doctor is here to help you find the right healthcare professional quickly and securely.
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom sx={{ mt: 4 }}>
          Why Choose Us?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          - Trusted network of certified doctors across 10+ specialties<br />
          - Secure and private booking process<br />
          - Real-time appointment management and reminders<br />
          - Patient-first approach and continuous support<br />
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom sx={{ mt: 4 }}>
          Meet Our Team
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Our team consists of passionate healthcare professionals, experienced engineers, and dedicated support staff. We work together to ensure you receive the best care and service possible.
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom sx={{ mt: 4 }}>
          Our Values
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          - Compassion<br />
          - Integrity<br />
          - Innovation<br />
          - Accessibility<br />
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom sx={{ mt: 4 }}>
          Contact Us
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Have questions or feedback? Reach out to us at <b>support@book-a-doctor.com</b> or call <b>+1-800-555-BOOK</b>.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Thank you for choosing us for your healthcare needs!
        </Typography>
      </Box>
    </Container>
  );
}
