"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
const handleValidationError = (err) => {
    const errorSource = [];
    const errors = Object.values(err.errors);
    errors.forEach((errorObject) => {
        errorSource.push({
            path: errorObject.path,
            message: errorObject.message,
        });
    });
    return {
        statusCode: 400,
        message: "Validation Error",
        errorSources: errorSource,
    };
};
exports.handleValidationError = handleValidationError;
