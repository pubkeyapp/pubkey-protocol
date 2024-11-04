import { Accordion, Button, Group } from '@mantine/core'
import { ellipsify } from '@pubkey-protocol/sdk'
import { UiDebug, UiPage } from '@pubkey-ui/core'
import { IconBug } from '@tabler/icons-react'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { useQueryCommunityGetAll } from '../../pubkey-community/data-access'
import { useQueryProfileGetAll } from '../../pubkey-profile/data-access'
import { useMutationConfigInit, usePubKeyProtocol, useQueryConfigGet, useQueryPointerGetAll } from '../data-access'

export function PubkeyProtocolFeatureDebug() {
  const mutationConfigInit = useMutationConfigInit()
  const queryCommunityAccounts = useQueryCommunityGetAll()
  const queryConfigAccount = useQueryConfigGet()
  const queryProfileAccounts = useQueryProfileGetAll()
  const queryPointerAccounts = useQueryPointerGetAll()
  const { connection, program, sdk } = usePubKeyProtocol()

  return (
    <UiPage
      leftAction={<IconBug />}
      title="Debug"
      rightAction={
        <Group>
          <Button
            onClick={() => {
              connection.getProgramAccounts(sdk.programId).then((accounts) => {
                console.log('accounts', accounts)
                for (const { account, pubkey } of accounts
                  .map((i) => i)
                  .sort((a, b) => a.account.lamports - b.account.lamports)) {
                  console.log(
                    `pubkey: ${pubkey.toString()} lamports ${account.lamports}`,
                    account.data
                      // first 32 bytes
                      .slice(0, 8)
                      .join(', '),
                  )
                }
              })
            }}
          >
            All Program Accounts
          </Button>

          <ExplorerLink ff="mono" path={`account/${sdk.programId}`} label={ellipsify(sdk.programId.toString())} />
        </Group>
      }
    >
      {queryConfigAccount.data?.configAuthority ? null : (
        <div>
          <Button onClick={() => mutationConfigInit.mutateAsync().then(() => queryConfigAccount.refetch())}>
            Initialize Config
          </Button>
        </div>
      )}
      <Accordion variant="separated" multiple>
        <Accordion.Item value="solana-program">
          <Accordion.Control>Solana Program</Accordion.Control>
          <Accordion.Panel>
            <UiDebug
              data={{
                program,
              }}
              open
            />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="config-account">
          <Accordion.Control>Config Account</Accordion.Control>
          <Accordion.Panel>
            <UiDebug data={{ configAccount: queryConfigAccount?.data ?? null }} open />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="community-accounts">
          <Accordion.Control>Community Accounts</Accordion.Control>
          <Accordion.Panel>
            <UiDebug
              data={{
                communityAccountsError: queryCommunityAccounts.error ? queryCommunityAccounts.error.message : null,
                communityAccounts: queryCommunityAccounts.data ?? [],
              }}
              open
            />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="profile-accounts">
          <Accordion.Control>Profile Accounts</Accordion.Control>
          <Accordion.Panel>
            <UiDebug
              data={{
                profileAccountsError: queryProfileAccounts.error ? queryProfileAccounts.error.message : null,
                profileAccounts: queryProfileAccounts.data ?? [],
              }}
              open
            />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="pointer-accounts">
          <Accordion.Control>Pointer Accounts</Accordion.Control>
          <Accordion.Panel>
            <UiDebug
              data={{
                pointerAccountsError: queryPointerAccounts.error ? queryPointerAccounts.error.message : null,
                pointerAccounts: queryPointerAccounts.data ?? [],
              }}
              open
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </UiPage>
  )
}
