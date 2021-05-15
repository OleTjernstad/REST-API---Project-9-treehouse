'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.myAssociation = this.hasMany(models.Course, {
                foreignKey: {
                    fieldName: 'userId',
                    allowNull: false
                }
            });
        }
    }
    User.init(
        {
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'firstName is required'
                    },
                    notEmpty: {
                        msg: 'firstName is required'
                    }
                }
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'lastName is required'
                    },
                    notEmpty: {
                        msg: 'lastName is required'
                    }
                }
            },
            emailAddress: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notNull: {
                        msg: 'emailAddress is required'
                    },
                    isEmail: {
                        msg: 'emailAddress is not valid'
                    }
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'password is required'
                    },
                    min: {
                        args: 6,
                        msg: 'password must be 6 characters or longer'
                    }
                },
                set(val) {
                    const hashedPassword = bcrypt.hashSync(val, 10);
                    this.setDataValue('password', hashedPassword);
                }
            }
        },
        {
            sequelize,
            modelName: 'User'
        }
    );

    return User;
};
