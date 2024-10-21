export function getAvatarUrlCommunity(slug: string) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${slug}`
}
