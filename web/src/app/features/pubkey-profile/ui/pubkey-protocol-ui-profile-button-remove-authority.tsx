import { ActionIcon } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-protocol/anchor'
import { PublicKey } from '@solana/web3.js'
import { IconTrash } from '@tabler/icons-react'
import { useMutationRemoveAuthority } from '../data-access'

export function PubkeyProtocolUiProfileButtonRemoveAuthority({
  authorityToRemove,
  authority,
  feePayer,
  profile,
}: {
  authorityToRemove: PublicKey
  authority: PublicKey
  feePayer: PublicKey
  profile: PubKeyProfile
}) {
  const mutation = useMutationRemoveAuthority()

  return (
    <ActionIcon
      size="sm"
      variant="light"
      color="red"
      onClick={() =>
        mutation.mutateAsync({
          authorityToRemove,
          authority,
          feePayer,
          username: profile.username,
        })
      }
      loading={mutation.isPending}
    >
      <IconTrash size={16} />
    </ActionIcon>
  )
}
