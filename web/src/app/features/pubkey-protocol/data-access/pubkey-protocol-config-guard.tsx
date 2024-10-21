import { Button, Group, Text } from '@mantine/core'
import { ellipsify } from '@pubkey-protocol/sdk'
import { UiInfo, UiStack } from '@pubkey-ui/core'
import { ReactNode } from 'react'
import { usePubKeyProtocol } from './pubkey-protocol-provider'
import { useMutationConfigInit } from './use-mutation-config-init'
import { useQueryConfigGet } from './use-query-config-get'

export function PubkeyProtocolConfigGuard({ children }: { children: ReactNode }) {
  const mutationConfigInit = useMutationConfigInit()
  const queryConfigAccount = useQueryConfigGet()
  const { authority } = usePubKeyProtocol()
  const isInitialized = !!queryConfigAccount.data?.configAuthority

  return isInitialized ? (
    children
  ) : (
    <UiInfo
      title="PubKey Protocol Config not initialized"
      message={
        <UiStack>
          <Text>PubKey Protocol needs to be initialized before you can use it.</Text>
          <Text>This is done by initializing the Config account and setting the Community Authority.</Text>
          <Group>
            <Button onClick={() => mutationConfigInit.mutateAsync().then(() => queryConfigAccount.refetch())}>
              Initialize Config with {ellipsify(authority.toString(), 8)}
            </Button>
          </Group>
        </UiStack>
      }
    />
  )
}
