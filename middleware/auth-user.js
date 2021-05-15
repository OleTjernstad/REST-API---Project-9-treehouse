'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Middleware to authenticate the request using Basic Auth.
exports.authenticateUser = async (req, res, next) => {
    const credentials = auth(req);
    let message;

    if (credentials) {
        const user = await User.findOne({
            where: { emailAddress: credentials.name }
        });

        if (user) {
            const authenticated = bcrypt.compareSync(
                credentials.pass,
                user.password
            );
            if (authenticated) {
                req.currentUser = user;
            } else {
                message = `Authentication failure for emailAddress: ${user.emailAddress}`;
            }
        } else {
            message = `User not found for emailAddress: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
};
