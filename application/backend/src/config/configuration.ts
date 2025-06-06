export default () => ({
  nodeEnv: process.env.NODE_ENV,
  app: {
    host: process.env.APP_HOST,
    port: parseInt(process.env.APP_PORT || '', 10),
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    cognito: {
      userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    },
    s3: {
      merchantFilesBucketName: process.env.S3_MERCHANT_FILES_BUCKET_NAME,
    },
  }
}); 