import { ActionIcon } from '@mantine/core'
import { PubKeyIdentityProvider, PubKeyProfile } from '@pubkey-protocol/anchor'
import { PublicKey } from '@solana/web3.js'
import { IconTrash } from '@tabler/icons-react'
import { useMutationRemoveIdentity } from '../data-access'

export function PubkeyProtocolUiProfileButtonRemoveIdentity({
  provider,
  providerId,
  authority,
  feePayer,
  profile,
}: {
  provider: PubKeyIdentityProvider
  providerId: string
  authority: PublicKey
  feePayer: PublicKey
  profile: PubKeyProfile
}) {
  const mutation = useMutationRemoveIdentity()

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
