/**
 * Server-only configuration
 * 
 * This file should ONLY be imported in API routes or server components.
 * It validates server-only environment variables that are not available in client bundles.
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const serverConfig = {
  stripe: {
    secretKey: requireEnv("STRIPE_SECRET_KEY"),
    priceId: requireEnv("STRIPE_PRICE_ID"),
    webhookSecret: requireEnv("STRIPE_WEBHOOK_SECRET"),
  },
  firebase: {
    serviceAccount: requireEnv("FIREBASE_SERVICE_ACCOUNT"),
  },
} as const;

