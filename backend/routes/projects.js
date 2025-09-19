const express = require('express');
const router = express.Router();
const { Project, File } = require('../models'); // Now importing File model as well
const authMiddleware = require('../middleware/authMiddleware');

// Helper function to determine language from filename
const getLanguageFromFilename = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    const langMap = {
        js: 'javascript',
        jsx: 'javascript',
        ts: 'typescript',
        tsx: 'typescript',
        py: 'python',
        java: 'java',
        c: 'c',
        cpp: 'cpp',
        cs: 'csharp',
        html: 'html',
        css: 'css',
        json: 'json',
        md: 'markdown',
    };
    return langMap[extension] || 'plaintext';
};

// @route   POST api/projects
// @desc    Create a new project
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    const { name } = req.body;
    const ownerId = req.user.id;

    try {
        // Create the project
        const newProject = await Project.create({
            name,
            ownerId,
        });

        // Create a default file associated with this new project
        await File.create({
            filename: 'index.js',
            content: `// Welcome to your new project!\nconsole.log('Hello, ${name}!');`,
            language: 'javascript',
            projectId: newProject.id, // Link the file to the project
        });

        res.status(201).json(newProject);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/projects
// @desc    Get all projects for a user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        const projects = await Project.findAll({
            where: { ownerId: req.user.id },
            order: [['createdAt', 'DESC']],
        });
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/projects/:id
// @desc    Get a single project by ID with its files
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findOne({
            where: { id: req.params.id, ownerId: req.user.id },
            include: {
                model: File,
                as: 'files', // Use the alias defined in the association
            },
        });

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        res.json(project);
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
        const project = await Project.findOne({
            where: { id: req.params.id, ownerId: req.user.id },
        });

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        await project.destroy();
        res.json({ msg: 'Project removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/projects/:projectId/files
// @desc    Add a new file to a project
// @access  Private
router.post('/:projectId/files', authMiddleware, async (req, res) => {
    const { filename } = req.body;
    const { projectId } = req.params;
    try {
        const project = await Project.findOne({
            where: { id: projectId, ownerId: req.user.id },
        });
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }
        const newFile = await File.create({
            filename,
            projectId: parseInt(projectId),
            content: `// New file: ${filename}`,
            language: getLanguageFromFilename(filename), // Use the helper function
        });
        res.status(201).json(newFile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

