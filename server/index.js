const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const messageRoutes = require('./routes/messages');

const app = express();

/* Middleware */
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

/* Routes */
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);

/* Health Check */
app.get('/', (req, res) => {
  res.send('Backend Running');
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    time: new Date()
  });
});

/* Port */
const PORT = process.env.PORT || 5000;

/* Start Server */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Error:', err.message);
    process.exit(1);
  });