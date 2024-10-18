import { Button, Group } from '@mantine/core'
import { UiPage } from '@pubkey-ui/core'
import { IconUsers } from '@tabler/icons-react'
import { Link, useRoutes } from 'react-router-dom'
import { PubKeyProtocolLoader } from '../../pubkey-protocol'
import { PubkeyCommunityFeatureCreate } from './pubkey-community-feature-create'
import { PubkeyCommunityFeatureDetail } from './pubkey-community-feature-detail'
import { PubkeyCommunityFeatureList } from './pubkey-community-feature-list'

export default function PubkeyCommunityRoutes({ basePath }: { basePath: string }) {
  const routes = useRoutes([
    { index: true, element: <PubkeyCommunityFeatureList basePath={basePath} /> },
    { path: 'create', element: <PubkeyCommunityFeatureCreate /> },
    { path: ':slug', element: <PubkeyCommunityFeatureDetail /> },
  ])

  return (
    <PubKeyProtocolLoader>
      <UiPage
        leftAction={<IconUsers />}
        title="Communities"
        rightAction={
          <Group>
            <Button size="xs" component={Link} to="create">
              Create
            </Button>
          </Group>
        }
      >
        {routes}
      </UiPage>
    </PubKeyProtocolLoader>
  )
}
