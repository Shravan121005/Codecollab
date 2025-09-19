'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProjectMember extends Model {
    static associate(models) {
      // Junction tables often don't need associations here
    }
  }
  ProjectMember.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  }, {
    sequelize,
    modelName: 'ProjectMember',
  });
  return ProjectMember;
};
