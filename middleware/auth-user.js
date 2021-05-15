'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

exports.authenticateUser = async (req, res, next) => {
    const login = auth(req);
    let message;

    if (login) {
        const user = await User.findOne({
            where: { emailAddress: login.name }
        });

        if (user) {
            const authenticated = bcrypt.compareSync(login.pass, user.password);
            if (authenticated) {
                req.currentUser = user;
            } else {
                message = `Authentication failed for emailAddress: ${user.emailAddress}`;
            }
        } else {
            message = `User not found for emailAddress: ${login.name}`;
        }
    } else {
        message = 'Auth not found';
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
};
