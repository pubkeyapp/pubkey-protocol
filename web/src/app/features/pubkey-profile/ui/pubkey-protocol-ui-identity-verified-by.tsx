import { Divider, Group } from '@mantine/core'
import { PublicKeyString } from '@pubkey-protocol/anchor'
import { UiStack } from '@pubkey-ui/core'
import { usePubKeyCommunity } from '../../pubkey-community/data-access'
import { PubkeyProtocolUiCommunityAvatarAnchor } from '../../pubkey-community/ui'

export function PubkeyProtocolUiIdentityVerifiedBy({ communities: communityIds }: { communities: PublicKeyString[] }) {
  const { communityMap } = usePubKeyCommunity()

  // map and sort the communities by name
  const communities = communityIds
    .map((id) => ({
      ...communityMap[id.toString()],
    }))
    .sort((a, b) => (a.name > b.name ? 1 : -1))

  return (
    <UiStack gap={0} w="100%">
      <Divider label="Verified by" labelPosition="left" my={4} />
      <Group gap="xs">
        {communities.map((community) => {
          return (
            <PubkeyProtocolUiCommunityAvatarAnchor
              key={community.slug}
              community={community}
              to={`/communities/${community.slug}`}
            />
          )
        })}
      </Group>
    </UiStack>
  )
}
