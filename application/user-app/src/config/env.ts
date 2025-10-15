/// <reference types="vite/client" />

import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_GOOGLE_CLIENT_ID: z.string(),
  VITE_GOOGLE_REDIRECT_URI: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

function parseEnv() {
  const envKeys = Object.keys(envSchema.shape) as Array<keyof typeof envSchema.shape>;
  const rawEnv = Object.fromEntries(envKeys.map(key => [key, import.meta.env[key]]));

  try {
    return envSchema.parse(rawEnv);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Environment validation failed:\n${errorMessages.join('\n')}`);
    }
    throw error;
  }
}

export const env = parseEnv();

export const config = {
  api: {
    baseUrl: env.VITE_API_URL,
  },
  google: {
    clientId: env.VITE_GOOGLE_CLIENT_ID,
    redirectUri: env.VITE_GOOGLE_REDIRECT_URI,
  },
  app: {
    environment: env.NODE_ENV,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
  },
} as const;

export default config; 