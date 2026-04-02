/**
 * Single origin for API paths. Supports both:
 * - VITE_API_URL=https://host.com          → https://host.com/api/v1
 * - VITE_API_URL=https://host.com/api      → https://host.com/api/v1
 */
export function getApiV1Base() {
  let base = (import.meta.env.VITE_API_URL || "http://localhost:4000").trim();
  base = base.replace(/\/+$/, "");
  if (base.endsWith("/api")) {
    return `${base}/v1`;
  }
  return `${base}/api/v1`;
}
