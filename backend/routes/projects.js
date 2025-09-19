const express = require('express');
const router = express.Router();
const { Project, User, File, ProjectMember } = require('../models');
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

        await ProjectMember.create({ projectId: newProject.id, userId: req.user.id });

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
// Get all projects a user is a member of
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Find all projects that include the current user as a member.
        const projects = await Project.findAll({
            include: [{
                model: User,
                as: 'members', // Use the alias defined in the Project model association
                where: { id: req.user.id },
                attributes: [], // We don't need the user details, just the link
                through: { attributes: [] } // Don't include the junction table details in the output
            }],
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
        const project = await Project.findByPk(req.params.id, {
            include: [
                { model: File, as: 'files' },
                { model: User, as: 'members', attributes: ['id', 'name', 'email'] } // Also fetch members
            ]
        });
        const isMember = project && project.members.some(member => member.id === req.user.id);
        if (!isMember) {
            return res.status(404).json({ msg: 'Project not found or access denied' });
        }
        res.json(project);
    } catch (err) { res.status(500).send('Server Error'); }
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
// Add a new file to a project (any member can)
router.post('/:projectId/files', authMiddleware, async (req, res) => {
    const { filename } = req.body;
    const { projectId } = req.params;

    try {
        // Security Check: Verify the user is a member of the project
        const isMember = await ProjectMember.findOne({
            where: { projectId: parseInt(projectId), userId: req.user.id }
        });
        if (!isMember) {
            return res.status(403).json({ msg: 'You must be a member of this project to add files.' });
        }

        const newFile = await File.create({
            filename,
            projectId: parseInt(projectId),
            content: `// New file: ${filename}`,
            language: getLanguageFromFilename(filename),
        });
        res.status(201).json(newFile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ** NEW ENDPOINT TO ADD A MEMBER **
router.post('/:projectId/members', authMiddleware, async (req, res) => {
    const { email } = req.body;
    const { projectId } = req.params;
    try {
        const project = await Project.findByPk(projectId);
        // Security check: Only the owner can add members
        if (!project || project.ownerId !== req.user.id) {
            return res.status(403).json({ msg: 'Permission denied' });
        }
        const userToAdd = await User.findOne({ where: { email } });
        if (!userToAdd) {
            return res.status(404).json({ msg: 'User not found' });
        }
        await ProjectMember.create({ projectId, userId: userToAdd.id });
        const member = { id: userToAdd.id, name: userToAdd.name, email: userToAdd.email };
        res.status(201).json(member);
    } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;

