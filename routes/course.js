const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middleware/auth-user');

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
    authenticateUser,
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
    '/:id',
    authenticateUser,
    asyncHandler(async (req, res, next) => {
        try {
            let course = await Course.findByPk(req.params.id);
            if (course) {
                course = await Course.update(req.body, {
                    where: { id: req.body.id }
                });
                res.status(204).end();
            }
            res.status(404).json({ errors: ['Course not found'] });
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

router.delete(
    '/:id',
    authenticateUser,
    asyncHandler(async (req, res, next) => {
        try {
            const course = await Course.findByPk(req.params.id);
            if (course) {
                await course.destroy();
                res.status(204).end();
            }
            res.status(404).json({ errors: ['Course not found'] });
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

module.exports = router;
