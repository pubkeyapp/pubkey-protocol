import { Box, UnstyledButton } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-protocol/anchor'
import { PublicKey } from '@solana/web3.js'
import { UiAppCard } from '../../../ui/ui-app-card'
import { usePubKeyProtocol } from '../../pubkey-protocol'
import { useMutationUpdateAvatarUrl } from '../data-access'
import { PubkeyProtocolUiProfileAvatar } from './pubkey-protocol-ui-profile-avatar'

export function PubkeyProtocolUiProfileAvatarUpdateButton({
  profile,
  signAuthority,
}: {
  profile: PubKeyProfile
  signAuthority: PublicKey
}) {
  const canSign = signAuthority !== PublicKey.default
  const { authority, feePayer } = usePubKeyProtocol()
  const mutation = useMutationUpdateAvatarUrl()

  function submit() {
    const avatarUrl = window.prompt('Enter the new avatar URL', profile.avatarUrl)
    if (!avatarUrl) {
      return
    }

    return mutation.mutateAsync({
      avatarUrl,
      authority: authority,
      feePayer,
      name: profile.name,
      username: profile.username,
    })
  }

  return canSign ? (
    <UiAppCard title="Update Avatar">
      <Box px="sm">
        <UnstyledButton onClick={submit}>
          <PubkeyProtocolUiProfileAvatar profile={profile} />
        </UnstyledButton>
      </Box>
    </UiAppCard>
  ) : null
}
