import { Box, Button } from '@mantine/core'
import { PubKeyCommunity, PubKeyProfile, PublicKeyString } from '@pubkey-protocol/anchor'
import { PublicKey } from '@solana/web3.js'
import { UiAppCard } from '../../../ui'
import { useMutationProfileDelete } from '../data-access'

export function PubkeyProtocolUiProfileDeleteButton({
  community,
  profile,
  signAuthority,
}: {
  community: PubKeyCommunity
  profile: PubKeyProfile
  signAuthority: PublicKeyString
}) {
  const canSign = signAuthority !== PublicKey.default
  const mutation = useMutationProfileDelete({ community: community.publicKey })

  function submit() {
    return mutation.mutateAsync({
      username: profile.username,
    })
  }

  return canSign && profile.identities?.length === 1 ? (
    <UiAppCard title="Delete Profile">
      <Box px="sm">
        <Button onClick={submit}>Delete Profile</Button>
      </Box>
    </UiAppCard>
  ) : null
}
