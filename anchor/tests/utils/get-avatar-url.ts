export function getCommunityAvatarUrl(slug: string) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${slug}`
}
export function getProfileAvatarUrl(username: string) {
  return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}`
}
