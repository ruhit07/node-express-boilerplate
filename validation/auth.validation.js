

const Joi = require('joi');
const ErrorResponse = require('../utils/errorResponse');
const { user_role } = require('../enums/common.enum');

const registerUserSchema = (reqBody) => {
  const data = reqBody;

  let dataSchema = {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid(user_role.ADMIN, user_role.USER).required()
  };

  return new Promise((resolve, reject) => {
    const schema = Joi.object(dataSchema);
    const { value, error } = schema.validate(data, { abortEarly: false });
    if (error) reject(new ErrorResponse(error, 400, { name: "JoiValidationError", error }));
    resolve(value);
  })
};

const loginUserSchema = (reqBody) => {
  const data = reqBody;

  let dataSchema = {
    email: Joi.string().email().required(),
    password: Joi.string().required()
  };

  return new Promise((resolve, reject) => {
    const schema = Joi.object(dataSchema);
    const { value, error } = schema.validate(data, { abortEarly: false });
    if (error) reject(new ErrorResponse(error, 400, { name: "JoiValidationError", error }));
    resolve(value);
  })
};

const updateUserDetailsSchema = (reqBody) => {
  const data = reqBody;

  const dataSchema = {
    name: Joi.string(),
    email: Joi.string().email(),
    role: Joi.string().valid(user_role.ADMIN, user_role.USER)
  };

  return new Promise((resolve, reject) => {
    const { value, error } = Joi.object(dataSchema).validate(data, { abortEarly: false });
    if (error) reject(new ErrorResponse(error, 400, { name: "JoiValidationError", error }));
    resolve(value)
  })
};

const updatePasswordSchema = (reqBody) => {
  const data = reqBody;

  let dataSchema = {
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  };

  return new Promise((resolve, reject) => {
    const schema = Joi.object(dataSchema);
    const { value, error } = schema.validate(data, { abortEarly: false });
    if (error) reject(new ErrorResponse(error, 400, { name: "JoiValidationError", error }));
    resolve(value);
  })
};

module.exports = {
  registerUserSchema,
  loginUserSchema,
  updateUserDetailsSchema,
  updatePasswordSchema
}