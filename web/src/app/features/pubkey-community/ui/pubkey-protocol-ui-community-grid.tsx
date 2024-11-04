import { Box, Divider, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/sdk'
import { UiCard } from '@pubkey-ui/core'
import { PubkeyProtocolUiIdentityProviderIcon } from '../../pubkey-profile/ui'
import { PubkeyProtocolUiCommunityDescription } from './pubkey-protocol-ui-community-description'
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
            <PubkeyProtocolUiCommunityGridItem community={community} basePath={basePath}>
              <Box>
                <PubkeyProtocolUiCommunityDescription community={community} />
                <Divider label="Supported Identity Providers" labelPosition="left" my="sm" />
                <Group>
                  {community.providers.map((p) => (
                    <Stack key={p} gap={0} align="center">
                      <PubkeyProtocolUiIdentityProviderIcon size={32} provider={p} key={p} />
                      <Text size="xs" c="dimmed" key={p}>
                        {p.toString()}
                      </Text>
                    </Stack>
                  ))}
                </Group>
              </Box>
            </PubkeyProtocolUiCommunityGridItem>
          </UiCard>
        ))}
    </SimpleGrid>
  )
}
