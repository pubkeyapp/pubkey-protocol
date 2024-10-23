import { Group, Text } from '@mantine/core'
import { IdentityProvider, PubKeyCommunity } from '@pubkey-protocol/sdk'
import { UiCard, UiStack } from '@pubkey-ui/core'
import { UiAbout } from '../../../ui'
import { PubkeyProtocolUiIdentityProviderIcon } from '../../pubkey-profile/ui'

import { PubkeyProtocolUiCommunityAuthorityGuard } from '../ui/pubkey-protocol-ui-community-authority-guard'
import { PubkeyCommunityFeatureProviderToggle } from './pubkey-community-feature-provider-toggle'

export function PubkeyCommunityFeatureProviders({ community }: { community: PubKeyCommunity }) {
  const allProviders = Object.keys(IdentityProvider) as IdentityProvider[]

  return (
    <UiCard>
      <UiAbout
        title="About Providers"
        content={[
          'These are the identity providers that this community verifies. They are managed by the community authority.',
        ]}
      />
      <PubkeyProtocolUiCommunityAuthorityGuard
        community={community}
        render={({ disabled }) => (
          <UiStack>
            {allProviders.map((provider) => {
              return (
                <Group key={provider} justify="space-between">
                  <Group align="center" gap={4}>
                    <PubkeyProtocolUiIdentityProviderIcon provider={provider} />
                    <Text size="lg">{provider}</Text>
                  </Group>
                  <PubkeyCommunityFeatureProviderToggle disabled={disabled} community={community} provider={provider} />
                </Group>
              )
            })}
          </UiStack>
        )}
      />
    </UiCard>
  )
}
