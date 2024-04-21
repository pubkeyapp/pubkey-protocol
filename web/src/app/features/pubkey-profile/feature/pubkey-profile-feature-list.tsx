import { UiLoader } from '@pubkey-ui/core'
import { useQueryGetProfiles } from '../data-access'
import { PubkeyProfileUiProfileGrid } from '../ui'

export function PubkeyProfileFeatureList({ basePath }: { basePath: string }) {
  const query = useQueryGetProfiles()

  return query.isLoading ? <UiLoader /> : <PubkeyProfileUiProfileGrid profiles={query.data ?? []} basePath={basePath} />
}
