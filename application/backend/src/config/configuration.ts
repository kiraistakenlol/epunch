export default () => ({
  nodeEnv: process.env.NODE_ENV,
  app: {
    host: process.env.APP_HOST,
    port: parseInt(process.env.APP_PORT || '', 10),
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    sslEnabled: process.env.DB_SSL_ENABLED === 'true',
  }
}); 