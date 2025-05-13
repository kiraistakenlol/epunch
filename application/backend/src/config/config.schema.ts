import * as Joi from 'joi';

const secret = (schema: Joi.Schema) => schema.meta({ secret: true });

export const configSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  APP_HOST: Joi.string().required(),
  APP_PORT: Joi.number().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: secret(Joi.string().required()),
  DB_DATABASE: Joi.string().required(),
  DB_SSL_ENABLED: Joi.boolean().required(),
}); 