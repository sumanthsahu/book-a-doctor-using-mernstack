const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// MongoDB connection with timeout
mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 5000, // 5 second timeout
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
