import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { UiAvatar } from '../../../ui/ui-avatar'

export function PubkeyProtocolUiCommunityAvatar({ community: { avatarUrl, slug } }: { community: PubKeyCommunity }) {
  return <UiAvatar url={avatarUrl ? avatarUrl : null} name={slug} radius="md" size="lg" />
}
