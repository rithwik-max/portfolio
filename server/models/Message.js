const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Links message to the portfolio owner who should receive it
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: 1000
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);