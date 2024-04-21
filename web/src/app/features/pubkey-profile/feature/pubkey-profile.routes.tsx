import { IconBug, IconSearch, IconUserPlus, IconUsersGroup } from '@tabler/icons-react'
import { Navigate, useRoutes } from 'react-router-dom'
import { KeypairUiGridItem } from '../../keypair/ui'
import { PubKeyProfileProvider } from '../data-access'

import { PubKeyProfileUiSidebar } from '../ui/pubkey-profile-ui-sidebar'

import { PubkeyProfileFeatureCreate } from './pubkey-profile-feature-create'
import { PubkeyProfileFeatureDebug } from './pubkey-profile-feature-debug'
import { PubkeyProfileFeatureDetail } from './pubkey-profile-feature-detail'
import { PubkeyProfileFeatureList } from './pubkey-profile-feature-list'
import { PubkeyProfileFeatureSearch } from './pubkey-profile-feature-search'

export default function PubkeyProfileRoutes({ basePath }: { basePath: string }) {
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
    { path: 'profiles', element: <PubkeyProfileFeatureList basePath={basePath} /> },
    { path: ':username', element: <PubkeyProfileFeatureDetail /> },
    { path: 'search', element: <PubkeyProfileFeatureSearch /> },
    { path: 'create', element: <PubkeyProfileFeatureCreate /> },
    { path: 'debug', element: <PubkeyProfileFeatureDebug /> },
  ])

  return (
    <PubKeyProfileProvider>
      <PubKeyProfileUiSidebar basePath={basePath} routes={sidebar}>
        {routes}
      </PubKeyProfileUiSidebar>
    </PubKeyProfileProvider>
  )
}
