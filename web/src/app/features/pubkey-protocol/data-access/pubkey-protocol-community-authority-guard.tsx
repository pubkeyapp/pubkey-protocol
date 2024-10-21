import { Group, Text } from '@mantine/core'
import { ellipsify } from '@pubkey-protocol/sdk'
import { UiInfo, UiStack } from '@pubkey-ui/core'
import { WalletMultiButton } from '@pubkeyapp/wallet-adapter-mantine-ui'
import { ReactNode } from 'react'
import { usePubKeyProtocol } from './pubkey-protocol-provider'
import { useQueryConfigGet } from './use-query-config-get'

export function PubkeyProtocolCommunityAuthorityGuard({ children }: { children: ReactNode }) {
  const queryConfigAccount = useQueryConfigGet()
  const { authority } = usePubKeyProtocol()
  const hasAuthority = authority?.toString() === queryConfigAccount.data?.communityAuthority?.toString()

  return hasAuthority ? (
    children
  ) : (
    <UiInfo
      title="Community Authority required"
      message={
        <UiStack>
          <Text>
            Connect the wallet{' '}
            <Text span ff="mono" size="xs" c="brand">
              {ellipsify(queryConfigAccount.data?.communityAuthority?.toString(), 8)}
            </Text>{' '}
            to create a community.
          </Text>
          <Group>
            <WalletMultiButton />
          </Group>
        </UiStack>
      }
    />
  )
}
