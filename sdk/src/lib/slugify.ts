export function slugify(str: string): string {
  // Convert to lowercase
  let slug = str.toLowerCase()

  // Replace non-alphanumeric characters (except underscore) with '_'
  slug = slug.replace(/[^a-z0-9_]/g, '_')

  // Trim to max length of 20 characters
  if (slug.length > 20) {
    slug = slug.substring(0, 20)
  }

  // Ensure minimum length of 3 characters, pad with underscores if needed
  if (slug.length < 3) {
    slug = slug.padEnd(3, '_')
  }

  return slug
}
