import * as Joi from 'joi';

const secret = (schema: Joi.Schema) => schema.meta({ secret: true });

export const configSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  APP_HOST: Joi.string().required(),
  APP_PORT: Joi.number().required(),
  SUPABASE_URL: Joi.string().required(),
  SUPABASE_API_KEY: secret(Joi.string().required()),
}); 