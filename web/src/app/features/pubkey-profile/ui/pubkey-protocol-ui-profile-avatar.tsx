import { PubKeyProfile } from '@pubkey-protocol/anchor'
import { UiAvatar } from '../../../ui/ui-avatar'

export function PubkeyProtocolUiProfileAvatar({ profile: { avatarUrl, username } }: { profile: PubKeyProfile }) {
  return <UiAvatar url={avatarUrl ? avatarUrl : null} name={username} radius={100} size="lg" />
}
