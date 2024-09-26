import { Box, UnstyledButton } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-protocol/anchor'
import { PublicKey } from '@solana/web3.js'
import { useMutationUpdateAvatarUrl, usePubKeyProfile } from '../data-access'
import { AppCard } from './app-card'
import { PubkeyProtocolUiAvatar } from './pubkey-protocol-ui-avatar'

export function PubkeyProtocolUiAvatarUpdateButton({
  profile,
  signAuthority,
}: {
  profile: PubKeyProfile
  signAuthority: PublicKey
}) {
  const canSign = signAuthority !== PublicKey.default
  const { authority, feePayer } = usePubKeyProfile()
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
    <AppCard title="Update Avatar">
      <Box px="sm">
        <UnstyledButton onClick={submit}>
          <PubkeyProtocolUiAvatar profile={profile} />
        </UnstyledButton>
      </Box>
    </AppCard>
  ) : null
}
