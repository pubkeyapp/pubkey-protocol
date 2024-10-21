import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { UiAvatar, UiAvatarProps } from '../../../ui/ui-avatar'

export function PubkeyProtocolUiCommunityAvatar({
  community: { avatarUrl, slug },
  ...props
}: UiAvatarProps & { community: PubKeyCommunity }) {
  return <UiAvatar url={avatarUrl ? avatarUrl : null} name={slug} radius="xs" size="lg" {...props} />
}
