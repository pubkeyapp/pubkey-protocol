import { ActionIcon } from '@mantine/core'
import { PubKeyIdentityProvider, PubKeyProfile } from '@pubkey-program-library/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { IconTrash } from '@tabler/icons-react'
import { usePubkeyProfileProgramAccount } from '../data-access'

export function PubKeyProfileUiButtonRemoveIdentity({
  provider,
  providerId,
  authority,
  feePayer,
  profile,
}: {
  provider: PubKeyIdentityProvider
  providerId: string
  authority: PublicKey
  feePayer: Keypair
  profile: PubKeyProfile
}) {
  const { removeIdentity } = usePubkeyProfileProgramAccount({ profilePda: profile.publicKey })

  function submit() {
    return removeIdentity.mutateAsync({
      authority,
      feePayer,
      providerId,
      provider,
      username: profile.username,
    })
  }

  return (
    <ActionIcon size="sm" variant="light" color="red" onClick={submit} loading={removeIdentity.isPending}>
      <IconTrash size={16} />
    </ActionIcon>
  )
}
