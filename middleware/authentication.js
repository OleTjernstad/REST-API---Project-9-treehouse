'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

/**
 * Authenticate the request in basic auth
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
exports.authenticateUser = async (req, res, next) => {
    const login = auth(req);
    let message;

    /**
     * Check if login information is provided
     */
    if (login) {
        const user = await User.findOne({
            where: { emailAddress: login.name }
        });

        /**
         * Check if user exists in db
         */
        if (user) {
            /**
             * Compare login and the hashed password
             */
            const authenticated = bcrypt.compareSync(login.pass, user.password);
            if (authenticated) {
                req.currentUser = user;
            } else {
                message = 'Authentication failed';
            }
        } else {
            message = 'User not found ';
        }
    } else {
        message = 'Auth not found';
    }

    /**
     * If message is set response with a access Denied
     */
    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
};
