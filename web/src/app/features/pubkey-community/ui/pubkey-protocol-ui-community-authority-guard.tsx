import { Text } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { UiGroup, UiStack, UiWarning } from '@pubkey-ui/core'
import { WalletMultiButton } from '@pubkeyapp/wallet-adapter-mantine-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { ReactNode, useMemo } from 'react'
import { ExplorerLink } from '../../cluster/cluster-ui'

export function PubkeyProtocolUiCommunityAuthorityGuard({
  children,
  community,
}: {
  children: ReactNode
  community: PubKeyCommunity
}) {
  const { publicKey: wallet, connecting } = useWallet()

  const hasAuthority = useMemo(() => {
    if (connecting) {
      console.log('connecting...')
      return false
    }
    console.log('connected as ', wallet?.toString())
    return community.authority.toString() === wallet?.toString()
  }, [connecting, community.authority, wallet])

  return hasAuthority ? (
    children
  ) : (
    <UiStack>
      <UiWarning
        title="Connect Authority Wallet"
        message={
          <UiStack>
            <Text>Connect the wallet that is currently managing the community to continue.</Text>
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
