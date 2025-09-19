const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Project = sequelize.define('Project', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ownerId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
    });

    Project.associate = (models) => {
        Project.belongsTo(models.User, {
            foreignKey: 'ownerId',
            onDelete: 'CASCADE',
        });
        // Add the alias here to match your queries
        Project.hasMany(models.File, {
            foreignKey: 'projectId',
            as: 'files',
        });
    };

    return Project;
};

