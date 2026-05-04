const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');

// PUBLIC — anyone can view all projects, populated with owner name
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('owner', 'name email')
      .sort({ featured: -1, order: 1, createdAt: -1 });
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects.' });
  }
});

// PROTECTED — only logged-in user can create
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, techStack, liveUrl, githubUrl, imageUrl, featured } = req.body;
    const project = await Project.create({
      owner: req.user._id,
      title, description, techStack, liveUrl, githubUrl, imageUrl, featured,
    });
    const populated = await project.populate('owner', 'name email');
    res.status(201).json({ project: populated });
  } catch (err) {
    if (err.name === 'ValidationError')
      return res.status(400).json({ message: Object.values(err.errors)[0].message });
    res.status(500).json({ message: 'Failed to create project.' });
  }
});

// PROTECTED — only the owner can update
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (project.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorised to edit this project.' });
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('owner', 'name email');
    res.json({ project: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update project.' });
  }
});

// PROTECTED — only the owner can delete
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (project.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorised to delete this project.' });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project.' });
  }
});

module.exports = router;