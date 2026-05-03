const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');

// GET /api/projects — PUBLIC, no login needed
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ featured: -1, order: 1, createdAt: -1 });
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects.' });
  }
});

// GET /api/projects/:id — protected, only owner can view
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ project });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch project.' });
  }
});

// POST /api/projects — protected
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, techStack, liveUrl, githubUrl, imageUrl, featured } = req.body;
    const project = await Project.create({
      owner: req.user._id,
      title, description, techStack, liveUrl, githubUrl, imageUrl, featured
    });
    res.status(201).json({ message: 'Project created!', project });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: 'Failed to create project.' });
  }
});

// PUT /api/projects/:id — protected, only owner can update
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ message: 'Project updated!', project });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update project.' });
  }
});

// DELETE /api/projects/:id — protected, only owner can delete
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ message: 'Project deleted!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project.' });
  }
});

module.exports = router;