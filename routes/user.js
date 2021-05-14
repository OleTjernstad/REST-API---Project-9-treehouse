const express = require('express');
const router = express.Router();

const asyncHandler = require('../tools/handler');

const { User } = require('../models');

router.get(
    '',
    asyncHandler(async (req, res, next) => {
        const user = await User.findByPk(1);

        res.json({ user });
    })
);

router.post(
    '',
    asyncHandler(async (req, res, next) => {
        let user;
        console.log(req.body);
        try {
            user = await User.create(req.body);
            res.location('/');
            res.status(201).end();
        } catch (error) {
            console.log(error);
            if (
                error.name === 'SequelizeValidationError' ||
                error.name === 'SequelizeUniqueConstraintError'
            ) {
                res.json({ error: 'error' });
            } else {
                throw error;
            }
        }
    })
);

module.exports = router;
