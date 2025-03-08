export function capitalizeWords(text: string): string {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function convertToSlug(text: string): string {
  return text.replace(/ & /g, " and ").replace(/\s+/g, "-");
}

export function convertFromSlug(slug: string): string {
  return slug.replace(/-and-/g, " & ").replace(/-/g, " ");
}
