import { ActionIcon } from '@mantine/core'
import { IdentityProvider, PubKeyCommunity, PubKeyProfile, PublicKeyString } from '@pubkey-protocol/sdk'
import { IconTrash } from '@tabler/icons-react'
import { useMutationProfileIdentityRemove } from '../data-access'

export function PubkeyProtocolUiProfileButtonRemoveIdentity({
  authority,
  community,
  feePayer,
  profile,
  provider,
  providerId,
  refresh,
}: {
  authority: PublicKeyString
  community: PubKeyCommunity
  feePayer: PublicKeyString
  profile: PubKeyProfile
  provider: IdentityProvider
  providerId: string
  refresh: () => void
}) {
  const mutation = useMutationProfileIdentityRemove({
    community: community.publicKey,
  })

  function submit() {
    return mutation
      .mutateAsync({
        authority,
        feePayer,
        providerId,
        provider,
        username: profile.username,
      })
      .then(refresh)
  }

  return (
    <ActionIcon size="sm" variant="light" color="red" onClick={submit} loading={mutation.isPending}>
      <IconTrash size={16} />
    </ActionIcon>
  )
}
