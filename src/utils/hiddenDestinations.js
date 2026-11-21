/**
 * Destinations the site no longer sells. They still exist in the CMS (their
 * blog posts are kept on purpose), so they are filtered out here rather than
 * deleted — the blog pages read the same /destinations endpoint and must keep
 * showing them.
 */
const HIDDEN_DESTINATION_PATTERN = /viet\s*nam|viatnam/i;

export function isHiddenDestination(destination) {
  if (!destination) return false;

  const fields = [
    destination.name,
    destination.slug,
    destination.title,
    destination.country,
  ];

  return fields.some((value) => typeof value === "string" && HIDDEN_DESTINATION_PATTERN.test(value));
}

export function withoutHiddenDestinations(destinations = []) {
  return destinations.filter((destination) => !isHiddenDestination(destination));
}
