import { UiDebug, UiLoader, UiStack } from '@pubkey-ui/core'
import { useQueryCommunityGetAll } from '../data-access'
import { PubkeyProtocolUiCommunityGrid } from '../ui'

export function PubkeyCommunityFeatureList({ basePath }: { basePath: string }) {
  const query = useQueryCommunityGetAll()

  return query.isLoading ? (
    <UiLoader />
  ) : (
    <UiStack>
      <PubkeyProtocolUiCommunityGrid communities={query.data ?? []} basePath={basePath} />
      <UiDebug data={query.data ?? []} />
    </UiStack>
  )
}
