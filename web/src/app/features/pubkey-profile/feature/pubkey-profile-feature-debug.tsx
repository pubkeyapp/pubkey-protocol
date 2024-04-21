import { UiDebug } from '@pubkey-ui/core'
import { usePubKeyProfile, useQueryGetPointers, useQueryGetProfiles } from '../data-access'

export function PubkeyProfileFeatureDebug() {
  const profileAccounts = useQueryGetProfiles()
  const pointerAccounts = useQueryGetPointers()
  const { program } = usePubKeyProfile()
  return (
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
  )
}
