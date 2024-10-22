import { Group, Text } from '@mantine/core'
import { IdentityProvider, PubKeyCommunity } from '@pubkey-protocol/sdk'
import { UiCard, UiStack } from '@pubkey-ui/core'
import { PubkeyProtocolUiIdentityProviderIcon } from '../../pubkey-profile/ui'

import { PubkeyProtocolUiCommunityAuthorityGuard } from '../ui/pubkey-protocol-ui-community-authority-guard'
import { PubkeyCommunityFeatureProviderToggle } from './pubkey-community-feature-provider-toggle'

export function PubkeyCommunityFeatureProviders({ community }: { community: PubKeyCommunity }) {
  const allProviders = Object.keys(IdentityProvider) as IdentityProvider[]

  return (
    <UiCard>
      <PubkeyProtocolUiCommunityAuthorityGuard community={community}>
        <UiStack>
          {allProviders.map((provider) => {
            return (
              <Group key={provider} justify="space-between">
                <Group align="center" gap={4}>
                  <PubkeyProtocolUiIdentityProviderIcon provider={provider} />
                  <Text size="lg">{provider}</Text>
                </Group>
                <PubkeyCommunityFeatureProviderToggle community={community} provider={provider} />
              </Group>
            )
          })}
        </UiStack>
      </PubkeyProtocolUiCommunityAuthorityGuard>
    </UiCard>
  )
}
