const httpStatus = require("http-status-codes");

module.exports = {
    pageNotFoundError: (req, res) => {
        let errorCode = httpStatus.NOT_FOUND;
        if(res.locals.error === undefined) {
            res.locals.error = null;
        }
        res.status(errorCode);
        res.render("error");
    },
    internalServerError: (error, req, res, next) => {
        let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
        console.log(`ERROR occurred: ${error.stack}`)
        res.status(errorCode);
        next(error);
    }
};