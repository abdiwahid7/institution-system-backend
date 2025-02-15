const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const users = require('./routes/api/users');
const auth = require('./routes/api/auth');
const assignments = require('./routes/api/assignments');
const app = express();

app.use(cors({
  credentials: true,
  origin: [
    'http://localhost:3000' // Ensure this matches your frontend URL
  ]
}));

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/Institution-system'; // Ensure the correct format and port
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/assignments', assignments);

// Start server
const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Server started on port ${port}`));