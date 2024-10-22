import { Text } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/sdk'
import { UiGroup, UiStack, UiWarning } from '@pubkey-ui/core'
import { WalletMultiButton } from '@pubkeyapp/wallet-adapter-mantine-ui'
import { ReactNode } from 'react'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { useCommunityIsAuthorityConnected } from '../data-access'

export function PubkeyProtocolUiCommunityAuthorityGuard({
  children,
  community,
}: {
  children: ReactNode
  community: PubKeyCommunity
}) {
  const hasAuthority = useCommunityIsAuthorityConnected({ community })

  return hasAuthority ? (
    children
  ) : (
    <UiStack>
      <UiWarning
        title="Community Authority required"
        message={
          <UiStack>
            <Text>Connect the community authority wallet to continue.</Text>
            <ExplorerLink
              size="xs"
              ff="mono"
              path={`account/${community.authority}`}
              label={community.authority?.toString()}
            />
          </UiStack>
        }
      />
      <UiGroup justify="end">
        <WalletMultiButton />
      </UiGroup>
    </UiStack>
  )
}
