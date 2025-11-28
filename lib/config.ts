/**
 * Client-safe configuration
 * 
 * This file can be safely imported in client-side code.
 * Only uses NEXT_PUBLIC_ environment variables which are available in client bundles.
 */

function requireEnvOptional(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

export const config = {
  app: {
    url: requireEnvOptional("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  },
  firebaseMessaging: {
    vapidKey: requireEnvOptional("NEXT_PUBLIC_FIREBASE_VAPID_KEY", ""),
  },
} as const;




