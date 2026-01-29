/** Backend API base URL. Set NEXT_PUBLIC_API_URL in production. */
export const backendUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://65.1.107.13:5001";

/**
 * App base URL for emails and links. Works locally and when deployed.
 * - Local: NEXT_PUBLIC_APP_URL or http://localhost:3000
 * - Vercel: NEXT_PUBLIC_VERCEL_URL (auto) or set NEXT_PUBLIC_APP_URL
 * - Other hosts: set NEXT_PUBLIC_APP_URL to your production URL
 */
export const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.APP_URL ||
  (typeof process.env.VERCEL_URL === "string"
    ? `https://${process.env.VERCEL_URL}`
    : undefined) ||
  "http://localhost:3000";
