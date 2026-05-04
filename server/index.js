const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const messageRoutes = require('./routes/messages');

const app = express();

/* ── Middleware ── */
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

/* ── Rate Limiting ──
   Relaxed for a personal portfolio:
   - Auth: 50 attempts per 15 min (you won't hit this normally)
   - Contact form: 10 messages per hour per IP (prevents spam)
*/
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 50,                      // 50 attempts — plenty for personal use
  message: { message: 'Too many login attempts. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // 1 hour
  max: 10,                      // 10 messages per hour per IP
  message: { message: 'Too many messages sent. Please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false
});

/* ── Routes ── */
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', contactLimiter, messageRoutes);

/* ── Health Check ── */
app.get('/', (req, res) => res.send('Server is running ✅'));

/* ── Start ── */
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  });