import { Button } from '@mantine/core'
import { ellipsify } from '@pubkey-protocol/sdk'
import { UiDebug, UiPage } from '@pubkey-ui/core'
import { IconBug } from '@tabler/icons-react'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { useQueryCommunityGetAll } from '../../pubkey-community/data-access'
import { useQueryGetPointers, useQueryProfileGetAll } from '../../pubkey-profile/data-access'
import { useMutationConfigInit, usePubKeyProtocol, useQueryConfigGet } from '../data-access'

export function PubkeyProtocolFeatureDebug() {
  const mutationConfigInit = useMutationConfigInit()
  const queryCommunityAccounts = useQueryCommunityGetAll()
  const queryConfigAccount = useQueryConfigGet()
  const queryProfileAccounts = useQueryProfileGetAll()
  const queryPointerAccounts = useQueryGetPointers()
  const { program, sdk } = usePubKeyProtocol()

  return (
    <UiPage
      leftAction={<IconBug />}
      title="Debug"
      rightAction={
        <ExplorerLink ff="mono" path={`account/${sdk.programId}`} label={ellipsify(sdk.programId.toString())} />
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
          configAccount: queryConfigAccount?.data,
          communityAccounts: queryCommunityAccounts.data,
          communityAccountsError: queryCommunityAccounts.error,
          profileAccounts: queryProfileAccounts.data,
          profileAccountsError: queryProfileAccounts.error,
          pointerAccounts: queryPointerAccounts.data,
          pointerAccountsError: queryPointerAccounts.error,
        }}
        open
      />
    </UiPage>
  )
}
