const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const asyncHandler = require('../tools/handler');

const { User } = require('../models');

router.get(
    '',
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

module.exports = router;
