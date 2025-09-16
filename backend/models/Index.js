const sequelize = require('../config/database');
const User = require('./User');
const Project = require('./Project');

// --- Define Associations ---
// A User can have many Projects
User.hasMany(Project, {
    foreignKey: {
        name: 'ownerId', // This will create an 'ownerId' column in the Project table
        allowNull: false
    },
    onDelete: 'CASCADE' // If a user is deleted, their projects are also deleted
});

// A Project belongs to a single User
Project.belongsTo(User, {
    foreignKey: 'ownerId'
});

// Export the models and the sequelize instance
const db = {
  sequelize,
  User,
  Project,
};

module.exports = db;
