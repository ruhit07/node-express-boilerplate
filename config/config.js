const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
const { env_mode } = require('../enums/common.enum');

dotenv.config({ path: path.join(__dirname, '../.env') });


const configEnvSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid(env_mode.PRODUCTION, env_mode.DEVELOPMENT).required(),
    PORT: Joi.number().default(3900).required(),
    
    MONGO_URI: Joi.string().required().description('Database URL'),

    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_EXPIRE: Joi.string().default('1d').required().description('days after which jwt expire'),
    JWT_COOKIE_EXPIRE: Joi.number().default(1).required().description('days after which cookie expire'),
  })
  .unknown();

const { value: configEnv, error } = configEnvSchema.prefs({ errors: { label: 'key' } }).validate(process.env);


if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}


module.exports = configEnv || {};
