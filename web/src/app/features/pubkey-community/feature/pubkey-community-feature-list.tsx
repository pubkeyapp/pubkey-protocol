import { UiDebug, UiLoader, UiPage, UiStack } from '@pubkey-ui/core'
import { IconUsers } from '@tabler/icons-react'
import { useQueryGetCommunities } from '../data-access'
import { PubkeyProtocolUiCommunityGrid } from '../ui/pubkey-protocol-ui-community-grid'

export function PubkeyCommunityFeatureList({ basePath }: { basePath: string }) {
  const query = useQueryGetCommunities()

  return (
    <UiPage leftAction={<IconUsers />} title="Communities">
      {query.isLoading ? (
        <UiLoader />
      ) : (
        <UiStack>
          <PubkeyProtocolUiCommunityGrid communities={query.data ?? []} basePath={basePath} />
          <UiDebug data={query.data ?? []} />
        </UiStack>
      )}
    </UiPage>
  )
}
