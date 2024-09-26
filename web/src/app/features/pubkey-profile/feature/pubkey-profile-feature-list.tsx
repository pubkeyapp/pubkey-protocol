import { UiDebug, UiLoader, UiPage, UiStack } from '@pubkey-ui/core'
import { IconUser } from '@tabler/icons-react'
import { useQueryGetProfiles } from '../data-access'
import { PubkeyProtocolUiProfileGrid } from '../ui'

export function PubkeyProfileFeatureList({ basePath }: { basePath: string }) {
  const query = useQueryGetProfiles()

  return (
    <UiPage leftAction={<IconUser />} title="Profiles">
      {query.isLoading ? (
        <UiLoader />
      ) : (
        <UiStack>
          <PubkeyProtocolUiProfileGrid profiles={query.data ?? []} basePath={basePath} />
          <UiDebug data={query.data ?? []} />
        </UiStack>
      )}
    </UiPage>
  )
}
