import { ActionIcon } from '@mantine/core'
import { IdentityProvider, PubKeyCommunity, PubKeyProfile, PublicKeyString } from '@pubkey-protocol/sdk'
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
  authority: PublicKeyString
  community: PubKeyCommunity
  feePayer: PublicKeyString
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
