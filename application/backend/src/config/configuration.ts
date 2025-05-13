export default () => ({
  nodeEnv: process.env.NODE_ENV,
  app: {
    host: process.env.APP_HOST,
    port: parseInt(process.env.APP_PORT || '', 10),
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    apiKey: process.env.SUPABASE_API_KEY,
  }
}); 