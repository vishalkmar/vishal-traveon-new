import DOMPurify from "dompurify";

/**
 * Cleans an HTML string before it is passed to dangerouslySetInnerHTML.
 * Strips <script>, inline event handlers (onclick, ...), javascript: URLs and
 * other XSS vectors, while keeping ordinary formatting tags.
 *
 * Use this for ANY HTML that originates from the database/API, so that even a
 * compromised admin account or a bad API feed cannot inject running scripts.
 */
export function sanitizeHtml(dirty) {
  if (dirty == null) return "";
  return DOMPurify.sanitize(String(dirty), {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["style", "iframe", "form", "object", "embed"],
    FORBID_ATTR: ["style", "srcset"],
  });
}

/** Convenience for `dangerouslySetInnerHTML={safeHtml(value)}`. */
export function safeHtml(dirty) {
  return { __html: sanitizeHtml(dirty) };
}
