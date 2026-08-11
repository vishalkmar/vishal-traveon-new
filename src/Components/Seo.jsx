import { useEffect } from "react";

/**
 * Central SEO / meta manager for the public site.
 *
 * Renders nothing to the DOM tree — it imperatively upserts <title>, meta and
 * <link rel="canonical"> tags into <head> on mount / prop change. This keeps a
 * single source of truth per page and avoids duplicate tags (works reliably in
 * this Vite SPA without SSR or an extra library).
 *
 * Only use this on PUBLIC frontend pages. Do NOT add it to /admin or protected
 * routes — those should stay out of search results.
 */

export const SITE_URL = "https://traveon.in";
export const SITE_NAME = "Traveon";

const DEFAULT_TITLE =
  "Traveon | Wellness Retreats, Travel Experiences, MICE & Corporate Events";
const DEFAULT_DESCRIPTION =
  "Traveon is a Delhi-based travel company offering curated wellness retreats, community tours, MICE and corporate event management, and global travel experiences.";
const DEFAULT_KEYWORDS =
  "Traveon, travel company India, wellness retreats, MICE, corporate events, community tours, tour packages, business travel, Delhi travel agency";
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

function upsertMeta(attr, key, content) {
  if (content == null || content === "") return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  path,
  image = DEFAULT_IMAGE,
  type = "website",
  noIndex = false,
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const cleanPath =
      typeof path === "string" && path.length > 0
        ? path
        : window.location.pathname;
    const canonical = `${SITE_URL}${cleanPath}`;

    document.title = fullTitle;

    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", keywords);
    upsertMeta(
      "name",
      "robots",
      noIndex ? "noindex, nofollow" : "index, follow"
    );

    upsertLink("canonical", canonical);

    // Open Graph (Facebook / LinkedIn / WhatsApp previews)
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:site_name", SITE_NAME);

    // Twitter card
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
  }, [title, description, keywords, path, image, type, noIndex]);

  return null;
}
