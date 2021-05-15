'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.myAssociation = this.belongsTo(models.User, {
                foreignKey: {
                    fieldName: 'userId',
                    allowNull: false
                }
            });
        }
    }
    Course.init(
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'title is required'
                    },
                    notEmpty: {
                        msg: 'title is required'
                    }
                }
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'description is required'
                    },
                    notEmpty: {
                        msg: 'description is required'
                    }
                }
            },
            estimatedTime: {
                type: DataTypes.STRING
            },
            materialsNeeded: {
                type: DataTypes.STRING
            }
        },
        {
            sequelize,
            modelName: 'Course'
        }
    );
    return Course;
};
