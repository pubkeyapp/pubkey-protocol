import { UiDebug, UiPage } from '@pubkey-ui/core'
import { IconBug } from '@tabler/icons-react'
import { ellipsify } from '../../../ui/ellipsify'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { usePubKeyProfile, useQueryGetPointers, useQueryGetProfiles } from '../data-access'

export function PubkeyProfileFeatureDebug() {
  const profileAccounts = useQueryGetProfiles()
  const pointerAccounts = useQueryGetPointers()
  const { program, sdk } = usePubKeyProfile()

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
