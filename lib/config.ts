// API_URL = server-side only (e.g. local backend when developing). NEXT_PUBLIC_API_URL = client + server fallback.
export const backendUrl =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
