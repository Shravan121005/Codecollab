const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { Project } = require('../models'); // Import Project model

// @route   POST api/projects
// @desc    Create a new project
// @access  Private
router.post(
  '/',
  [
    authMiddleware,
    [check('name', 'Project name is required').not().isEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Define the default file structure here, in our application logic.
      const defaultFiles = [
        {
          filename: 'index.js',
          content: 'console.log("Hello, World!");',
          language: 'javascript'
        }
      ];

      // Sequelize will use the 'ownerId' from the association we defined
      const project = await Project.create({
        name: req.body.name,
        ownerId: req.user.id, // req.user.id comes from the authMiddleware
        files: defaultFiles // Manually set the files on creation
      });

      res.json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/projects
// @desc    Get all projects for the logged-in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { ownerId: req.user.id },
      order: [['createdAt', 'DESC']], // Order by creation date descending
    });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // Find the project by its primary key (id) and the owner's id
        const project = await Project.findOne({
            where: {
                id: req.params.id,
                ownerId: req.user.id
            }
        });

        // If project doesn't exist or doesn't belong to the user
        if (!project) {
            return res.status(404).json({ msg: 'Project not found or user not authorized' });
        }

        // Delete the project
        await project.destroy();

        res.json({ msg: 'Project removed' });

    } catch (err) {
        console.error(err.message);
        // Check for specific error types if needed, e.g., invalid UUID format
        if (err.name === 'SequelizeDatabaseError') {
             return res.status(400).json({ msg: 'Invalid project ID format' });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router;

