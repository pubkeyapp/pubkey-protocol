import { ActionIcon, Button, Group, Loader, Table, Text } from '@mantine/core'
import { UiError, UiInfo, UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { IconRefresh } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useGetTokenAccounts } from './account-data-access'

import { ellipsify } from './ui/ellipsify'

export function AccountUiTokens({ address }: { address: PublicKey }) {
  const [showAll, setShowAll] = useState(false)
  const query = useGetTokenAccounts({ address })
  const client = useQueryClient()
  const items = useMemo(() => {
    if (showAll) return query.data
    return query.data?.slice(0, 5)
  }, [query.data, showAll])

  return (
    <div>
      <UiStack>
        <Group justify="space-between">
          <Text size="xl">Token Accounts</Text>
          <Group>
            {query.isLoading ? (
              <Loader />
            ) : (
              <ActionIcon
                variant="outline"
                onClick={async () => {
                  await query.refetch()
                  await client.invalidateQueries({
                    queryKey: ['getTokenAccountBalance'],
                  })
                }}
              >
                <IconRefresh size={16} />
              </ActionIcon>
            )}
          </Group>
        </Group>
        {query.isError && <UiError title={'An error occurred'} message={`Error: ${query.error?.message.toString()}`} />}

        {query.isSuccess && (
          <div>
            {query.data.length === 0 ? (
              <UiInfo
                title="No token accounts found"
                message="Token accounts will appear here when you send or receive tokens."
              />
            ) : (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Public Key</Table.Th>
                    <Table.Th>Mint</Table.Th>
                    <Table.Th ta="right">Balance</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {items?.map(({ account, pubkey }) => (
                    <Table.Tr key={pubkey.toString()}>
                      <Table.Td>
                        <ExplorerLink
                          ff="monospace"
                          label={ellipsify(pubkey.toString())}
                          path={`account/${pubkey.toString()}`}
                        />
                      </Table.Td>
                      <Table.Td>
                        <ExplorerLink
                          ff="monospace"
                          label={ellipsify(account.data.parsed.info.mint)}
                          path={`account/${account.data.parsed.info.mint.toString()}`}
                        />
                      </Table.Td>
                      <Table.Td align="right">
                        <Text ff="mono">{account.data.parsed.info.tokenAmount.uiAmount}</Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}

                  {(query.data?.length ?? 0) > 5 && (
                    <Table.Tr>
                      <Table.Td colSpan={4} align="center">
                        <Button onClick={() => setShowAll(!showAll)}>{showAll ? 'Show Less' : 'Show All'}</Button>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            )}
          </div>
        )}
      </UiStack>
    </div>
  )
}
