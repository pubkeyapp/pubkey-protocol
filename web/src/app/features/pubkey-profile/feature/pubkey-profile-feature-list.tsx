import { UiDebug, UiLoader, UiStack } from '@pubkey-ui/core'
import { useQueryGetProfiles } from '../data-access'
import { PubkeyProtocolUiProfileGrid } from '../ui'

export function PubkeyProfileFeatureList({ basePath }: { basePath: string }) {
  const query = useQueryGetProfiles()

  return query.isLoading ? (
    <UiLoader />
  ) : (
    <UiStack>
      <PubkeyProtocolUiProfileGrid profiles={query.data ?? []} basePath={basePath} />
      <UiDebug data={query.data ?? []} />
    </UiStack>
  )
}
