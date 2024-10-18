export function slugify(str: string): string {
  // Convert to lowercase
  let slug = str.toLowerCase()

  // Replace non-alphanumeric characters (except underscore) with '_'
  slug = slug.replace(/[^a-z0-9_]/g, '_')

  // Ensure minimum length of 3 characters, throw error if not
  if (slug.length < 3) {
    throw new Error('Slug must be at least 3 characters long')
  }

  // Trim to max length of 20 characters
  if (slug.length > 20) {
    slug = slug.substring(0, 20)
  }

  return slug
}
