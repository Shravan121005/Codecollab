'use strict';
const sequelize = require('../config/database');
const { Sequelize } = require('sequelize');
const db = {};

// 1. Explicitly import and initialize each model definition
const userDefiner = require('./User');
const projectDefiner = require('./Project');
const fileDefiner = require('./File');
const projectMemberDefiner = require('./ProjectMember');

// 2. Call the definer functions to create the models
db.User = userDefiner(sequelize, Sequelize.DataTypes);
db.Project = projectDefiner(sequelize, Sequelize.DataTypes);
db.File = fileDefiner(sequelize, Sequelize.DataTypes);
db.ProjectMember = projectMemberDefiner(sequelize, Sequelize.DataTypes);

// 3. Set up associations by calling the .associate method on each model
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

