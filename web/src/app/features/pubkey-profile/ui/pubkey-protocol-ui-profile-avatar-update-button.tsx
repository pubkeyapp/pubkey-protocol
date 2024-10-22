import { Box, UnstyledButton } from '@mantine/core'
import { PubKeyCommunity, PubKeyProfile, PublicKeyString } from '@pubkey-protocol/sdk'
import { PublicKey } from '@solana/web3.js'
import { UiAppCard } from '../../../ui'
import { useMutationProfileUpdate } from '../data-access'
import { PubkeyProtocolUiProfileAvatar } from './pubkey-protocol-ui-profile-avatar'

export function PubkeyProtocolUiProfileAvatarUpdateButton({
  community,
  profile,
  signAuthority,
}: {
  community: PubKeyCommunity
  profile: PubKeyProfile
  signAuthority: PublicKeyString
}) {
  const canSign = signAuthority !== PublicKey.default
  const mutation = useMutationProfileUpdate({ community: community.publicKey })

  function submit() {
    const avatarUrl = window.prompt('Enter the new avatar URL', profile.avatarUrl)
    if (!avatarUrl) {
      return
    }

    return mutation.mutateAsync({
      avatarUrl,
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
