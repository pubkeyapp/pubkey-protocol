import { IconBug, IconSearch, IconUserPlus, IconUsersGroup } from '@tabler/icons-react'
import { Navigate, useRoutes } from 'react-router-dom'
import { KeypairUiGridItem } from '../../keypair/ui'
import { PubkeyProtocolProvider } from '../data-access'

import { PubkeyProtocolUiSidebar } from '../ui/pubkey-protocol-ui-sidebar'

import { PubkeyProtocolFeatureCreate } from './pubkey-protocol-feature-create'
import { PubkeyProtocolFeatureDebug } from './pubkey-protocol-feature-debug'
import { PubkeyProtocolFeatureDetail } from './pubkey-protocol-feature-detail'
import { PubkeyProtocolFeatureList } from './pubkey-protocol-feature-list'
import { PubkeyProtocolFeatureSearch } from './pubkey-protocol-feature-search'

export default function PubkeyProtocolRoutes({ basePath }: { basePath: string }) {
  const sidebar: KeypairUiGridItem[] = [
    {
      label: 'Profiles',
      path: 'profiles',
      leftSection: <IconUsersGroup size={16} />,
    },
    {
      label: 'Search',
      path: 'search',
      leftSection: <IconSearch size={16} />,
    },
    {
      label: 'Create',
      path: 'create',
      leftSection: <IconUserPlus size={16} />,
    },
    {
      label: 'Debug',
      path: 'debug',
      leftSection: <IconBug size={16} />,
    },
  ]
  const routes = useRoutes([
    { index: true, element: <Navigate to="./profiles" replace /> },
    { path: 'profiles', element: <PubkeyProtocolFeatureList basePath={basePath} /> },
    { path: ':username', element: <PubkeyProtocolFeatureDetail /> },
    { path: 'search', element: <PubkeyProtocolFeatureSearch /> },
    { path: 'create', element: <PubkeyProtocolFeatureCreate /> },
    { path: 'debug', element: <PubkeyProtocolFeatureDebug /> },
  ])

  return (
    <PubkeyProtocolProvider>
      <PubkeyProtocolUiSidebar basePath={basePath} routes={sidebar}>
        {routes}
      </PubkeyProtocolUiSidebar>
    </PubkeyProtocolProvider>
  )
}
