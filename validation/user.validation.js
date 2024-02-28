
const Joi = require('joi');
const { user_role } = require('../enums/common.enum');
const ErrorResponse = require('../utils/errorResponse');

const createUserSchema = (reqBody) => {
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


const updateUserSchema = (reqBody) => {
  const data = reqBody;

  const dataSchema = {
    name: Joi.string(),
    email: Joi.string().email(),
    role: Joi.string().valid(user_role.ADMIN, user_role.USER)
  };

  return new Promise((resolve, reject) => {
    const schema = Joi.object(dataSchema);
    const { value, error } = schema.validate(data, { abortEarly: false });
    if (error) reject(new ErrorResponse(error, 400, { name: "JoiValidationError", error }));
    resolve(value);
  })
};


module.exports = {
  createUserSchema,
  updateUserSchema
}