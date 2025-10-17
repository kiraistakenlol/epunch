export default () => ({
  nodeEnv: process.env.NODE_ENV,
  app: {
    host: process.env.APP_HOST,
    port: parseInt(process.env.APP_PORT || '', 10),
    apiPrefix: process.env.API_PREFIX || 'api/v1',
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  uploads: {
    directory: process.env.UPLOADS_DIRECTORY || './uploads',
  }
}); 