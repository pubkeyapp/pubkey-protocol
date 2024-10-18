import { UiDebug, UiLoader, UiStack } from '@pubkey-ui/core'
import { useQueryGetCommunities } from '../data-access'
import { PubkeyProtocolUiCommunityGrid } from '../ui'

export function PubkeyCommunityFeatureList({ basePath }: { basePath: string }) {
  const query = useQueryGetCommunities()

  return query.isLoading ? (
    <UiLoader />
  ) : (
    <UiStack>
      <PubkeyProtocolUiCommunityGrid communities={query.data ?? []} basePath={basePath} />
      <UiDebug data={query.data ?? []} />
    </UiStack>
  )
}
