import { ActionIcon } from '@mantine/core'
import { PubKeyCommunity, PubKeyProfile, PublicKeyString } from '@pubkey-protocol/sdk'
import { IconTrash } from '@tabler/icons-react'
import { useMutationProfileAuthorityRemove } from '../data-access'

export function PubkeyProtocolUiProfileAuthorityRemoveButton({
  authorityToRemove,
  authority,
  community,
  feePayer,
  profile,
}: {
  authorityToRemove: PublicKeyString
  authority: PublicKeyString
  community: PubKeyCommunity
  feePayer: PublicKeyString
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
