const express = require('express');
const router = express.Router();

const asyncHandler = require('../tools/handler');

const { Course, User } = require('../models');

router.get(
    '',
    asyncHandler(async (req, res, next) => {
        const courses = await Course.findAll({
            include: [
                {
                    model: User
                }
            ]
        });
        res.json({ courses });
    })
);

router.get(
    ':id',
    asyncHandler(async (req, res, next) => {
        res.json();
    })
);

router.post(
    '',
    asyncHandler(async (req, res, next) => {
        res.json();
    })
);

router.put(
    ':id',
    asyncHandler(async (req, res, next) => {
        res.json();
    })
);

router.delete(
    ':id',
    asyncHandler(async (req, res, next) => {
        res.json();
    })
);

module.exports = router;
