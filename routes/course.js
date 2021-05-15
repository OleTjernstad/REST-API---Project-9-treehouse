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
    '/:id',
    asyncHandler(async (req, res, next) => {
        const course = await Course.findByPk(req.params.id, {
            include: [
                {
                    model: User
                }
            ]
        });
        res.json({ course });
    })
);

router.post(
    '',
    asyncHandler(async (req, res, next) => {
        let course;
        try {
            course = await Course.create(req.body);
            res.location(`/api/courses/${course.id}`);
            res.status(201).end();
        } catch (error) {
            console.log(error);
            if (
                error.name === 'SequelizeValidationError' ||
                error.name === 'SequelizeUniqueConstraintError'
            ) {
                const errors = error.errors.map((err) => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }
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
