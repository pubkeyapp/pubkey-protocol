import { Box, UnstyledButton } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { PublicKey } from '@solana/web3.js'
import { useMutationUpdateAvatarUrl, usePubKeyProfile } from '../data-access'
import { AppCard } from './app-card'
import { PubkeyProfileUiAvatar } from './pubkey-profile-ui-avatar'

export function PubkeyProfileUiAvatarUpdateButton({
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
      username: profile.username,
    })
  }

  return canSign ? (
    <AppCard title="Update Avatar">
      <Box px="sm">
        <UnstyledButton onClick={submit}>
          <PubkeyProfileUiAvatar profile={profile} />
        </UnstyledButton>
      </Box>
    </AppCard>
  ) : null
}
