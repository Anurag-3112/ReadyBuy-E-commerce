import logger from "../logger/logger.js";

const errorHandler = (
    err,
    req,
    res,
    next
) => {

    const statusCode = err.statusCode || 500;

    console.error(err);          // <-- add this
    console.error(err.stack);    // <-- add this

    logger.error(err.stack || err.message);

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });

};

export default errorHandler;