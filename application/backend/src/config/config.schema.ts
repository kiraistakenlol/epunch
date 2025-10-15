import * as Joi from 'joi';

const secret = (schema: Joi.Schema) => schema.meta({ secret: true });

export const configSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  APP_HOST: Joi.string().required(),
  APP_PORT: Joi.number().required(),
  API_PREFIX: Joi.string().default('api/v1'),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: secret(Joi.string().required()),
  DB_SSL: Joi.string().valid('true', 'false').default('false'),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: secret(Joi.string().required()),
  GOOGLE_REDIRECT_URI: Joi.string().required(),
  JWT_SECRET: secret(Joi.string().min(32).required()),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  UPLOADS_DIRECTORY: Joi.string().default('./uploads'),
}); 