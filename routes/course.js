const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middleware/authentication');

const asyncHandler = require('../tools/handler');

const { Course, User } = require('../models');

/**
 * get all courses route "/api/courses"
 */
router.get(
    '',
    asyncHandler(async (req, res, next) => {
        const courses = await Course.findAll({
            attributes: [
                'title',
                'description',
                'estimatedTime',
                'materialsNeeded'
            ],
            include: [
                {
                    model: User,
                    attributes: ['firstName', 'lastName', 'emailAddress']
                }
            ]
        });
        res.json({ courses });
    })
);

/**
 * Get course by id, "/api/courses/:id"
 */
router.get(
    '/:id',
    asyncHandler(async (req, res, next) => {
        const course = await Course.findByPk(req.params.id, {
            attributes: [
                'title',
                'description',
                'estimatedTime',
                'materialsNeeded'
            ],
            include: [
                {
                    model: User,
                    attributes: ['firstName', 'lastName', 'emailAddress']
                }
            ]
        });
        /**
         * Check if course id exist in db
         */
        if (course) {
            res.json({ course });
        } else {
            res.status(404).json({ errors: ['Course not found'] });
        }
    })
);

/**
 * Post new course route "/api/courses" Requires login
 */
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
            /**
             * Check if there are validation errors
             */
            if (error.name === 'SequelizeValidationError') {
                const errors = error.errors.map((err) => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }
    })
);

/**
 * Update course "/api/courses/:id" Requires login
 */
router.put(
    '/:id',
    authenticateUser,
    asyncHandler(async (req, res, next) => {
        try {
            let course = await Course.findByPk(req.params.id, {
                include: [
                    {
                        model: User
                    }
                ]
            });
            /**
             * Check if course id exists in db
             */
            if (course) {
                /**
                 * Check if current user and the owner of the course is the same
                 */
                if (course.User.id == req.currentUser.id) {
                    course = await Course.update(req.body, {
                        where: { id: req.body.id }
                    });
                    res.status(204).end();
                } else {
                    // If currentUser don't own the course send a 403
                    res.status(403).end();
                }
            } else {
                res.status(404).json({ errors: ['Course not found'] });
            }
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeValidationError') {
                const errors = error.errors.map((err) => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }
    })
);

/**
 * Delete the course by id "/api/courses/:id" requires login
 */
router.delete(
    '/:id',
    authenticateUser,
    asyncHandler(async (req, res, next) => {
        try {
            const course = await Course.findByPk(req.params.id, {
                include: [
                    {
                        model: User
                    }
                ]
            });

            /**
             * Check if the course exists in db
             */
            if (course) {
                /**
                 * Check if current user and course owner is the same
                 */
                if (course.User.id == req.currentUser.id) {
                    await course.destroy();
                    res.status(204).end();
                } else {
                    res.status(403).end();
                }
            } else {
                res.status(404).json({ errors: ['Course not found'] });
            }
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeValidationError') {
                const errors = error.errors.map((err) => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }
    })
);

module.exports = router;
