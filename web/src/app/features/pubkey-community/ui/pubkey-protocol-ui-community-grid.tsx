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
    <SimpleGrid cols={{ base: 1, md: 2 }}>
      {communities.map((community) => (
        <UiCard key={community.slug}>
          <PubkeyProtocolUiCommunityGridItem community={community} basePath={basePath} />
        </UiCard>
      ))}
    </SimpleGrid>
  )
}
