import { SimpleGrid } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { UiCard } from '@pubkey-ui/core'
import { PubkeyProtocolUiCommunityGridItem } from './pubkey-protocol-ui-community-grid-item'

export function PubkeyProtocolUiCommunityGrid({
  communities,
  basePath,
}: {
  communities: PubKeyCommunity[]
  basePath?: string
}) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }}>
      {communities
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((community) => (
          <UiCard key={community.slug}>
            <PubkeyProtocolUiCommunityGridItem community={community} basePath={basePath} />
          </UiCard>
        ))}
    </SimpleGrid>
  )
}
