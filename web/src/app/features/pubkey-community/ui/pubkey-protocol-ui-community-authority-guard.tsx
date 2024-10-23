import { Group, Text } from '@mantine/core'
import { ellipsify, PubKeyCommunity } from '@pubkey-protocol/sdk'
import { UiInfo, UiStack } from '@pubkey-ui/core'
import { WalletMultiButton } from '@pubkeyapp/wallet-adapter-mantine-ui'
import { ReactNode } from 'react'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { useCommunityIsAuthorityConnected } from '../data-access'

export function PubkeyProtocolUiCommunityAuthorityGuard({
  community,
  render,
}: {
  community: PubKeyCommunity
  render: ({ disabled }: { disabled: boolean }) => ReactNode
}) {
  const hasAuthority = useCommunityIsAuthorityConnected({ community })

  return hasAuthority ? (
    render({ disabled: false })
  ) : (
    <UiStack>
      {render({ disabled: true })}
      <UiInfo
        title="Community Authority required!"
        message={
          <UiStack>
            <Group align="baseline" gap={4} wrap="nowrap">
              <Text span>Connect the community authority wallet</Text>
              <ExplorerLink
                size="sm"
                ff="mono"
                path={`account/${community.authority}`}
                label={ellipsify(community.authority?.toString(), 8)}
              />
              <Text span>to enable this feature.</Text>
            </Group>
            <Group justify="end">
              <WalletMultiButton size="xs" />
            </Group>
          </UiStack>
        }
      />
    </UiStack>
  )
}
