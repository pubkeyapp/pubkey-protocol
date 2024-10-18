import { IconUser } from '@tabler/icons-react'
import { Link, useRoutes } from 'react-router-dom'

import { PubkeyProfileFeatureCreate } from './pubkey-profile-feature-create'
import { PubkeyProfileFeatureDetail } from './pubkey-profile-feature-detail'
import { PubkeyProfileFeatureList } from './pubkey-profile-feature-list'
import { PubkeyProfileFeatureSearch } from './pubkey-profile-feature-search'
import { PubKeyProtocolLoader } from '../../pubkey-protocol'
import { Button, Group } from '@mantine/core'
import { UiPage } from '@pubkey-ui/core'

export default function PubkeyProfileRoutes({ basePath }: { basePath: string }) {
  const routes = useRoutes([
    { index: true, element: <PubkeyProfileFeatureList basePath={basePath} /> },
    { path: 'create', element: <PubkeyProfileFeatureCreate /> },
    { path: 'search', element: <PubkeyProfileFeatureSearch /> },
    { path: ':username', element: <PubkeyProfileFeatureDetail /> },
  ])

  return (
    <PubKeyProtocolLoader>
      <UiPage
        leftAction={<IconUser />}
        title="Profiles"
        rightAction={
          <Group>
            <Button size="xs" component={Link} to="search" variant="light">
              Search
            </Button>
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
