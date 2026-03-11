export function toSearchSlug(label = "") {
  return label
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-\u00C0-\u024F]/g, "");
}


export function fromSearchSlug(slug = "") {
  return decodeURIComponent(slug).replace(/-/g, " ").trim();
}

export function findMetierBySlug(slug, metiers = []) {
  if (!slug || !metiers.length) return null;
  const normalized = slug.toLowerCase();
  return (
    metiers.find(
      (m) => toSearchSlug(m.label).toLowerCase() === normalized
    ) ?? null
  );
}