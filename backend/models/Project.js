const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // We remove the complex defaultValue. We will set the initial files in our route handler instead.
  files: {
    type: DataTypes.JSONB,
    // We allow it to be null initially, as we'll populate it on creation.
    allowNull: true, 
  },
  // The 'ownerId' foreign key will be added automatically by the association in models/index.js
});

module.exports = Project;

