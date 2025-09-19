const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const File = sequelize.define('File', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        language: {
            type: DataTypes.STRING,
            defaultValue: 'javascript',
        },
        content: {
            type: DataTypes.TEXT,
            defaultValue: '',
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Projects',
                key: 'id',
            },
        },
    });

    // Define association here
    File.associate = (models) => {
        File.belongsTo(models.Project, {
            foreignKey: 'projectId',
            onDelete: 'CASCADE',
        });
    };

    return File;
};

