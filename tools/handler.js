/**
 * AsyncHandler to add try catch to routes
 * @param {function} cb CallBack Function to run
 * @returns
 */
const asyncHandler = (cb) => {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    };
};

module.exports = asyncHandler;
