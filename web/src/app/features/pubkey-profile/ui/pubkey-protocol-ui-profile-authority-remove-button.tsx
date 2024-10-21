import { ActionIcon } from '@mantine/core'
import { PubKeyCommunity, PubKeyProfile } from '@pubkey-protocol/anchor'
import { PublicKey } from '@solana/web3.js'
import { IconTrash } from '@tabler/icons-react'
import { useMutationProfileAuthorityRemove } from '../data-access'

export function PubkeyProtocolUiProfileAuthorityRemoveButton({
  authorityToRemove,
  authority,
  community,
  feePayer,
  profile,
}: {
  authorityToRemove: PublicKey
  authority: PublicKey
  community: PubKeyCommunity
  feePayer: PublicKey
  profile: PubKeyProfile
}) {
  const mutation = useMutationProfileAuthorityRemove({
    community: community.publicKey,
  })

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
