import { ActionIcon, Button, Group, Loader, Table, Text } from '@mantine/core'
import { UiError, UiInfo, UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { IconRefresh } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { AppLabel } from '../../../app-labels-provider'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { useGetTokenAccounts } from '../account-data-access'
import { formatAmount } from './account-ui-form-send'
import { AccountUiTokenActions } from './account-ui-token-actions'
import { ellipsify } from './ellipsify'

export interface AccountUiTokenBurnInput {
  amount: string
  source: string
  mint: string
}

export interface AccountUiTokenCloseInput {
  source: string
  mint: string
}

export interface AccountUiTokenSendInput {
  amount: string
  source: string
  destination: string
  mint: string
}

export function AccountUiTokenTable({
  address,
  burn,
  close,
  send,
}: {
  address: PublicKey
  burn?: (input: AccountUiTokenBurnInput) => Promise<void>
  close?: (input: AccountUiTokenCloseInput) => Promise<void>
  send?: (input: AccountUiTokenSendInput) => Promise<void>
}) {
  const [showAll, setShowAll] = useState(false)
  const query = useGetTokenAccounts({ address })
  const client = useQueryClient()
  const items = useMemo(() => {
    if (showAll) return query.data
    return query.data
      ?.slice(0, 5)
      .sort((a, b) => {
        const aMint = a.account.data.parsed.info.mint
        const bMint = b.account.data.parsed.info.mint
        if (aMint < bMint) return -1
        if (aMint > bMint) return 1
        return 0
      })
      .sort((a, b) => {
        const aBalance = a.account.data.parsed.info.tokenAmount.uiAmount
        const bBalance = b.account.data.parsed.info.tokenAmount.uiAmount
        return bBalance - aBalance
      })
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
                    queryKey: ['getTokenBalance'],
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
                    <Table.Th>Mint</Table.Th>
                    <Table.Th>Public Key</Table.Th>
                    <Table.Th ta="right">Balance</Table.Th>
                    <Table.Th w={10} ta="right">
                      Actions
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {items?.map(({ account, pubkey }) => (
                    <Table.Tr key={pubkey.toString()}>
                      <Table.Td>
                        <ExplorerLink
                          copy={account.data.parsed.info.mint.toString()}
                          ff="monospace"
                          label={<AppLabel publicKey={account.data.parsed.info.mint} />}
                          path={`account/${account.data.parsed.info.mint.toString()}`}
                        />
                      </Table.Td>
                      <Table.Td>
                        <ExplorerLink
                          copy={pubkey.toString()}
                          ff="monospace"
                          label={ellipsify(pubkey.toString())}
                          path={`account/${pubkey.toString()}`}
                        />
                      </Table.Td>
                      <Table.Td align="right">
                        <Text ff="monospace">
                          {formatAmount(account.data.parsed.info.tokenAmount.uiAmountString ?? '0')}
                        </Text>
                      </Table.Td>
                      <Table.Td align="right">
                        <AccountUiTokenActions
                          burn={async (input) => {
                            if (!burn) return
                            return burn({
                              ...input,
                              mint: account.data.parsed.info.mint,
                              source: pubkey.toString(),
                            })
                          }}
                          close={async () => {
                            if (!close) return
                            return close({
                              mint: account.data.parsed.info.mint,
                              source: pubkey.toString(),
                            })
                          }}
                          send={async (input) => {
                            if (!send) return
                            return send({
                              ...input,
                              mint: account.data.parsed.info.mint,
                              source: pubkey.toString(),
                            })
                          }}
                          available={account.data.parsed.info.tokenAmount.uiAmount}
                          mint={account.data.parsed.info.mint}
                        />
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
