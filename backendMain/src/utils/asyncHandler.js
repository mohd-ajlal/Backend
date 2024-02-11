const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((next) => next(err));
    };
}

export {asyncHandler};

// const asyncHandler = (handler) => async(req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(err.code||500).json({
//             success: false,
//             message: error.message});
//     }
// }