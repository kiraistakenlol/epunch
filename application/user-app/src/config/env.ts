/// <reference types="vite/client" />

import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_COGNITO_USER_POOL_ID: z.string().optional(),
  VITE_COGNITO_USER_POOL_CLIENT_ID: z.string().optional(),
  VITE_AWS_REGION: z.string(),
  VITE_COGNITO_DOMAIN: z.string().optional(),
  VITE_COGNITO_REDIRECT_SIGN_IN: z.string().url().optional(),
  VITE_COGNITO_REDIRECT_SIGN_OUT: z.string().url().optional(),
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
  cognito: {
    userPoolId: env.VITE_COGNITO_USER_POOL_ID,
    userPoolClientId: env.VITE_COGNITO_USER_POOL_CLIENT_ID,
    region: env.VITE_AWS_REGION,
    domain: env.VITE_COGNITO_DOMAIN,
    redirectSignIn: env.VITE_COGNITO_REDIRECT_SIGN_IN || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'),
    redirectSignOut: env.VITE_COGNITO_REDIRECT_SIGN_OUT || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'),
  },
  app: {
    environment: env.NODE_ENV,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
  },
} as const;

export default config; 