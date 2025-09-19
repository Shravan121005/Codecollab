'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
      // This defines the relationship.
      // The foreign key 'projectId' will be automatically created.
      File.belongsTo(models.Project, {
        foreignKey: 'projectId',
        onDelete: 'CASCADE'
      });
    }
  }
  File.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'javascript'
    },
    content: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    // We explicitly define projectId here to ensure it's always required.
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Projects', // table name
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'File',
  });
  return File;
};

