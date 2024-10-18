import { UiDebug, UiPage } from '@pubkey-ui/core'
import { IconBug } from '@tabler/icons-react'
import { ellipsify } from '../../../ui'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { usePubKeyProtocol } from '../data-access'
import { useQueryGetCommunities } from '../../pubkey-community/data-access'
import { useQueryGetPointers, useQueryGetProfiles } from '../../pubkey-profile/data-access'

export function PubkeyProtocolFeatureDebug() {
  const communityAccounts = useQueryGetCommunities()
  const profileAccounts = useQueryGetProfiles()
  const pointerAccounts = useQueryGetPointers()
  const { program, sdk } = usePubKeyProtocol()

  return (
    <UiPage
      leftAction={<IconBug />}
      title="Debug"
      rightAction={
        <ExplorerLink ff="mono" path={`account/${sdk.programId}`} label={ellipsify(sdk.programId.toString())} />
      }
    >
      <UiDebug
        data={{
          program,
          communityAccounts: communityAccounts.data,
          communityAccountsError: communityAccounts.error,
          profileAccounts: profileAccounts.data,
          profileAccountsError: profileAccounts.error,
          pointerAccounts: pointerAccounts.data,
          pointerAccountsError: pointerAccounts.error,
        }}
        open
      />
    </UiPage>
  )
}
