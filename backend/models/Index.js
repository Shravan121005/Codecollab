'use strict';

const sequelize = require('../config/database');
const db = {};

// Explicitly import each model and initialize it
db.User = require('./User')(sequelize);
db.Project = require('./Project')(sequelize);
db.File = require('./File')(sequelize);

// Set up associations by calling the .associate method on each model
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = require('sequelize');

module.exports = db;

