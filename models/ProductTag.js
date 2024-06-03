// ProductTag is used as a junction table to help facilitate the many-to-many relationship between Products and Tags.

// Require Model and DataTypes from sequelize library.
const { Model, DataTypes } = require('sequelize');

// Require database connection from config.js.
const sequelize = require('../config/connection');

class ProductTag extends Model { }

ProductTag.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'product',
                key: 'id',
                unique: false
            }
        },
        tag_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tag',
                key: 'id',
                unique: false
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'product_tag',
    }
);

module.exports = ProductTag;