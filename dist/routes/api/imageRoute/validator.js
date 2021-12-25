"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationErrorFormatter = exports.widthValidator = exports.heightValidator = exports.fileNameValidator = void 0;
const express_validator_1 = require("express-validator");
const fileNameValidator = (0, express_validator_1.query)('fileName')
    .notEmpty()
    .withMessage('fileName is required')
    .isString()
    .withMessage('fileName must be string');
exports.fileNameValidator = fileNameValidator;
const heightValidator = (0, express_validator_1.query)('height')
    .notEmpty()
    .withMessage('Height is required')
    .isNumeric()
    .withMessage('Height must be number');
exports.heightValidator = heightValidator;
const widthValidator = (0, express_validator_1.query)('width')
    .notEmpty()
    .withMessage('Width is required')
    .isNumeric()
    .withMessage('Width must be number');
exports.widthValidator = widthValidator;
const validationErrorFormatter = ({ msg, param }) => {
    return `${param}: ${msg}`;
};
exports.validationErrorFormatter = validationErrorFormatter;
