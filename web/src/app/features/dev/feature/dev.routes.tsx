import { Box, Divider, Group, SimpleGrid, Text } from '@mantine/core'
import { ellipsify } from '@pubkey-protocol/sdk'
import { UiCard, UiDebug, UiPage, UiStack } from '@pubkey-ui/core'
import { PubkeyProtocolUiCommunityLinkItem } from '../../pubkey-community/ui'
import { PubkeyProtocolUiCommunityListItem } from '../../pubkey-community/ui/pubkey-protocol-ui-community-list-item'
import { PubkeyProtocolUiIdentityProviderIcon, PubkeyProtocolUiProfileListItem } from '../../pubkey-profile/ui'
import { communities, communityMap } from '../data-access/dev-data-communities'
import { profileMap, profiles } from '../data-access/dev-data-profiles'

export default function DevRoutes() {
  return (
    <UiPage>
      <UiStack>
        <UiCard title="Communities">
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            {communities.map((community) => (
              <Box key={community.publicKey.toString()}>
                <PubkeyProtocolUiCommunityListItem key={community.publicKey.toString()} community={community}>
                  <Divider label="Supported Identity Providers" labelPosition="left" my="sm" />
                  <Group>
                    {community.providers.map((p) => (
                      <PubkeyProtocolUiIdentityProviderIcon provider={p} key={p} />
                    ))}
                  </Group>
                </PubkeyProtocolUiCommunityListItem>
              </Box>
            ))}
          </SimpleGrid>
        </UiCard>

        <UiCard title="Profiles">
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            {profiles.map((profile) => (
              <Box key={profile.publicKey.toString()}>
                <PubkeyProtocolUiProfileListItem key={profile.publicKey.toString()} profile={profile}>
                  <UiStack>
                    {profile.identities.map((i) => (
                      <UiCard key={`${i.provider}-${i.providerId}`}>
                        <Group gap="xs" justify="space-between" w="100%">
                          <Group gap="xs" w="100%" align="start" wrap="nowrap">
                            <UiStack gap={0} align="center">
                              <PubkeyProtocolUiIdentityProviderIcon provider={i.provider} />
                              <Text size="xs" c="dimmed">
                                {i.provider.toString()}
                              </Text>
                            </UiStack>
                            <UiStack gap={0} w="100%">
                              <Text>{i.name.toString()}</Text>
                              <Text ff="monospace" c="dimmed" size="xs">
                                {ellipsify(i.providerId.toString(), 8)}
                              </Text>
                              <Divider label="Verified by" labelPosition="left" my="sm" />
                              <UiStack gap="xs">
                                {i.communities?.map((x) => (
                                  <PubkeyProtocolUiCommunityLinkItem
                                    key={x.toString()}
                                    community={communityMap[x.toString()]}
                                  />
                                ))}
                              </UiStack>
                            </UiStack>
                          </Group>
                        </Group>
                      </UiCard>
                    ))}
                  </UiStack>
                </PubkeyProtocolUiProfileListItem>
              </Box>
            ))}
          </SimpleGrid>
        </UiCard>

        <UiCard title="Development">
          <div>DEMO CARD</div>
          <UiDebug
            data={{
              communities: communityMap,
              profiles: profileMap,
            }}
          />
        </UiCard>
      </UiStack>
    </UiPage>
  )
}
