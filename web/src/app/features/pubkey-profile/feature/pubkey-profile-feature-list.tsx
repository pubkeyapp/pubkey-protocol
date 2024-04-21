import { UiLoader, UiPage } from '@pubkey-ui/core'
import { IconUsersGroup } from '@tabler/icons-react'
import { useQueryGetProfiles } from '../data-access'
import { PubkeyProfileUiProfileGrid } from '../ui'

export function PubkeyProfileFeatureList({ basePath }: { basePath: string }) {
  const query = useQueryGetProfiles()

  return (
    <UiPage leftAction={<IconUsersGroup />} title="Profiles">
      {query.isLoading ? <UiLoader /> : <PubkeyProfileUiProfileGrid profiles={query.data ?? []} basePath={basePath} />}
    </UiPage>
  )
}
