import * as Joi from 'joi';

const secret = (schema: Joi.Schema) => schema.meta({ secret: true });

export const configSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  APP_HOST: Joi.string().required(),
  APP_PORT: Joi.number().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: secret(Joi.string().required()),
  AWS_COGNITO_USER_POOL_ID: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: secret(Joi.string().required()),
  AWS_SECRET_ACCESS_KEY: secret(Joi.string().required()),
  S3_MERCHANT_FILES_BUCKET_NAME: Joi.string().required(),
}); 