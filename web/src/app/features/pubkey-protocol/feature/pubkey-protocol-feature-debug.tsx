import { Button, Group } from '@mantine/core'
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
      <UiDebug
        data={{
          program,
          configAccount: queryConfigAccount?.data ?? null,
          communityAccounts: queryCommunityAccounts.data ?? [],
          communityAccountsError: queryCommunityAccounts.error ? queryCommunityAccounts.error.message : null,
          profileAccounts: queryProfileAccounts.data ?? [],
          profileAccountsError: queryProfileAccounts.error ? queryProfileAccounts.error.message : null,
          pointerAccounts: queryPointerAccounts.data ?? [],
          pointerAccountsError: queryPointerAccounts.error ? queryPointerAccounts.error.message : null,
        }}
        open
      />
    </UiPage>
  )
}
