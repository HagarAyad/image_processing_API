import { query, ValidationError } from 'express-validator';

const fileNameValidator = query('fileName')
  .notEmpty()
  .withMessage('fileName is required')
  .isString()
  .withMessage('fileName must be string');

const heightValidator = query('height')
  .notEmpty()
  .withMessage('Height is required')
  .isNumeric()
  .withMessage('Height must be number');

const widthValidator = query('width')
  .notEmpty()
  .withMessage('Width is required')
  .isNumeric()
  .withMessage('Width must be number');

const validationErrorFormatter = ({ msg, param }: ValidationError) => {
  return `${param}: ${msg}`;
};

export {
  fileNameValidator,
  heightValidator,
  widthValidator,
  validationErrorFormatter,
};
