/**
 * One-time HTTP setup so the admin session rides in an httpOnly cookie instead
 * of localStorage. The cookie is set by the backend at login and sent back
 * automatically — but only if requests opt into credentials. This wires that
 * in globally so no individual call site has to change.
 *
 * Imported once from main.jsx, before the app renders.
 */
import axios from "axios";

// Our backend origin (same value the app already uses for API calls).
const API_ORIGIN = (() => {
  const raw = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");
  try {
    return raw ? new URL(raw).origin : "";
  } catch {
    return "";
  }
})();

// axios is only ever used against our backend here, so this is safe globally.
axios.defaults.withCredentials = true;

// Send the cookie on fetch() calls to our own backend (or relative URLs).
// Third-party fetches (if any) are left untouched so their CORS isn't broken.
if (typeof window !== "undefined" && window.fetch && !window.__fetchCredsPatched) {
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    try {
      const url = typeof input === "string" ? input : input && input.url;
      const isOurApi =
        url &&
        (url.startsWith("/") ||
          (API_ORIGIN && url.startsWith(API_ORIGIN)) ||
          url.startsWith(window.location.origin));
      if (isOurApi && init.credentials == null) {
        init = { ...init, credentials: "include" };
      }
    } catch {
      /* fall through with the request unchanged */
    }
    return originalFetch(input, init);
  };
  window.__fetchCredsPatched = true;
}
