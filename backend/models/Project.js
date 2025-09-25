'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsToMany(models.User, { through: models.ProjectMember, foreignKey: 'projectId', as: 'members' });
      Project.hasMany(models.File, { foreignKey: 'projectId', as: 'files' });
      Project.hasMany(models.Message, { foreignKey: 'projectId' });
    }
  }
  Project.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    ownerId: { type: DataTypes.UUID, allowNull: false },
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};

