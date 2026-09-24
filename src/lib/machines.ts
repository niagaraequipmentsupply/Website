/** Placeholder models with no specs or copy yet: reachable for quotes, but not indexed, featured or in the sitemap. */
export const isThin = (m: { specs: unknown[]; longDescription?: string }) => m.specs.length === 0 && !m.longDescription;
