const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

// POST /api/messages — public (anyone can send a message)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const msg = await Message.create({ name, email, message });
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

// GET /api/messages — protected, only returns messages for logged-in user's inbox
router.get('/', protect, async (req, res) => {
  try {
    // owner field links messages to a specific user's portfolio
    const messages = await Message.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
});

// PATCH /api/messages/:id/read — protected
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const msg = await Message.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { read: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: 'Message not found.' });
    res.json({ message: 'Marked as read', msg });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update message.' });
  }
});

// DELETE /api/messages/:id — protected
router.delete('/:id', protect, async (req, res) => {
  try {
    const msg = await Message.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!msg) return res.status(404).json({ message: 'Message not found.' });
    res.json({ message: 'Message deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete message.' });
  }
});

module.exports = router;