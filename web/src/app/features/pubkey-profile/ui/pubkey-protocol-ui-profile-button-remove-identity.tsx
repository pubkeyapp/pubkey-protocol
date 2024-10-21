import { ActionIcon } from '@mantine/core'
import { IdentityProvider, PubKeyCommunity, PubKeyProfile } from '@pubkey-protocol/anchor'
import { PublicKey } from '@solana/web3.js'
import { IconTrash } from '@tabler/icons-react'
import { useMutationRemoveIdentity } from '../data-access'

export function PubkeyProtocolUiProfileButtonRemoveIdentity({
  authority,
  community,
  feePayer,
  profile,
  provider,
  providerId,
}: {
  authority: PublicKey
  community: PubKeyCommunity
  feePayer: PublicKey
  profile: PubKeyProfile
  provider: IdentityProvider
  providerId: string
}) {
  const mutation = useMutationRemoveIdentity({
    community: community.publicKey,
  })

  function submit() {
    return mutation.mutateAsync({
      authority,
      feePayer,
      providerId,
      provider,
      username: profile.username,
    })
  }

  return (
    <ActionIcon size="sm" variant="light" color="red" onClick={submit} loading={mutation.isPending}>
      <IconTrash size={16} />
    </ActionIcon>
  )
}
