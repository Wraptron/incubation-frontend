/**
 * Backend API URL - works for both local and production:
 * - Local dev: use http://localhost:5001 (set in .env.local or leave unset)
 * - Production: set NEXT_PUBLIC_API_URL in your hosting (e.g. Vercel) to your backend URL
 */
export const backendUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
