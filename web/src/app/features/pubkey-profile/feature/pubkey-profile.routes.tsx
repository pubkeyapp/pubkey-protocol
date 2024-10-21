import { Button, Group } from '@mantine/core'
import { UiPage } from '@pubkey-ui/core'
import { IconUser } from '@tabler/icons-react'
import { Link, useRoutes } from 'react-router-dom'
import {
  PubKeyCommunityProvider,
  usePubKeyCommunity,
} from '../../pubkey-community/data-access/pubkey-community-provider'
import { PubkeyProtocolUiCommunitySelect } from '../../pubkey-community/ui'
import { PubKeyProtocolLoader } from '../../pubkey-protocol'

import { PubkeyProfileFeatureCreate } from './pubkey-profile-feature-create'
import { PubkeyProfileFeatureDetail } from './pubkey-profile-feature-detail'
import { PubkeyProfileFeatureList } from './pubkey-profile-feature-list'
import { PubkeyProfileFeatureSearch } from './pubkey-profile-feature-search'

export default function PubkeyProfileRoutes({ basePath }: { basePath: string }) {
  return (
    <PubKeyProtocolLoader>
      <PubKeyCommunityProvider>
        <Router basePath={basePath} />
      </PubKeyCommunityProvider>
    </PubKeyProtocolLoader>
  )
}

export function Router({ basePath }: { basePath: string }) {
  const { community } = usePubKeyCommunity()
  const routes = useRoutes([
    { index: true, element: <PubkeyProfileFeatureList basePath={basePath} /> },
    { path: 'create', element: <PubkeyProfileFeatureCreate community={community} /> },
    { path: 'search', element: <PubkeyProfileFeatureSearch /> },
    { path: ':username', element: <PubkeyProfileFeatureDetail community={community} /> },
  ])

  return (
    <UiPage
      leftAction={<IconUser />}
      title="Profiles"
      rightAction={
        <Group>
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
      {routes}
    </UiPage>
  )
}
