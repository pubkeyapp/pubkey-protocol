import { Button, Group } from '@mantine/core'
import { UiDebugModal, UiLoader, UiPage, UiStack } from '@pubkey-ui/core'
import { IconUser } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { PubkeyProtocolUiCommunitySelect } from '../../pubkey-community/ui'
import { useQueryProfileGetAll } from '../data-access'
import { PubkeyProtocolUiProfileGrid } from '../ui'

export function PubkeyProfileFeatureList({ basePath }: { basePath: string }) {
  const query = useQueryProfileGetAll()

  return (
    <UiPage
      leftAction={<IconUser />}
      title="Profiles"
      rightAction={
        <Group>
          <UiDebugModal data={query.data ?? []} />
          <PubkeyProtocolUiCommunitySelect />
          <Button size="xs" component={Link} to="search" variant="light">
            Search
          </Button>
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
          <PubkeyProtocolUiProfileGrid profiles={query.data ?? []} basePath={basePath} />
        </UiStack>
      )}
    </UiPage>
  )
}
