import { ActionIcon } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { IconTrash } from '@tabler/icons-react'
import { usePubkeyProfileProgramAccount } from '../data-access'

export function PubKeyProfileUiButtonRemoveAuthority({
  authorityToRemove,
  authority,
  feePayer,
  profile,
}: {
  authorityToRemove: PublicKey
  authority: PublicKey
  feePayer: Keypair
  profile: PubKeyProfile
}) {
  const { removeAuthority } = usePubkeyProfileProgramAccount({ profilePda: profile.publicKey })

  function submit() {
    return removeAuthority.mutateAsync({
      authorityToRemove,
      authority,
      feePayer,
      username: profile.username,
    })
  }

  return (
    <ActionIcon size="sm" variant="light" color="red" onClick={submit} loading={removeAuthority.isPending}>
      <IconTrash size={16} />
    </ActionIcon>
  )
}
