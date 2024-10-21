import { Button, Group } from '@mantine/core'
import { UiDebugModal, UiLoader, UiPage, UiStack } from '@pubkey-ui/core'
import { IconUsers } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { useQueryCommunityGetAll } from '../data-access'
import { PubkeyProtocolUiCommunityGrid } from '../ui'

export function PubkeyCommunityFeatureList({ basePath }: { basePath: string }) {
  const query = useQueryCommunityGetAll()

  return (
    <UiPage
      leftAction={<IconUsers />}
      title="Communities"
      rightAction={
        <Group>
          <UiDebugModal data={query.data ?? []} />
          <Button size="xs" component={Link} to="create">
            Create
          </Button>
        </Group>
      }
    >
      {query.isLoading ? (
        <UiLoader />
      ) : (
        <UiStack>
          <PubkeyProtocolUiCommunityGrid communities={query.data ?? []} basePath={basePath} />
        </UiStack>
      )}
    </UiPage>
  )
}
