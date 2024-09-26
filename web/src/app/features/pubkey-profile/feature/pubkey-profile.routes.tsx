import { IconSearch, IconUser, IconUserPlus } from '@tabler/icons-react'
import { Navigate, useRoutes } from 'react-router-dom'
import { KeypairUiGridItem } from '../../keypair/ui'

import { PubkeyProfileFeatureCreate } from './pubkey-profile-feature-create'
import { PubkeyProfileFeatureDetail } from './pubkey-profile-feature-detail'
import { PubkeyProfileFeatureList } from './pubkey-profile-feature-list'
import { PubkeyProfileFeatureSearch } from './pubkey-profile-feature-search'
import { PubkeyProtocolProvider } from '../../pubkey-protocol'
import { UiSidebar } from '../../../ui'
import { SolanaConnectionLoader } from '../../solana'

export default function PubkeyProfileRoutes({ basePath }: { basePath: string }) {
  const sidebar: KeypairUiGridItem[] = [
    {
      label: 'Profiles',
      path: 'list',
      leftSection: <IconUser size={16} />,
    },
    {
      label: 'Create',
      path: 'create',
      leftSection: <IconUserPlus size={16} />,
    },
    {
      label: 'Search',
      path: 'search',
      leftSection: <IconSearch size={16} />,
    },
  ]
  const routes = useRoutes([
    { index: true, element: <Navigate to="list" replace /> },
    { path: 'list', element: <PubkeyProfileFeatureList basePath={basePath} /> },
    { path: 'create', element: <PubkeyProfileFeatureCreate /> },
    { path: 'search', element: <PubkeyProfileFeatureSearch /> },
    { path: ':username', element: <PubkeyProfileFeatureDetail /> },
  ])

  return (
    <SolanaConnectionLoader
      render={(props) => (
        <PubkeyProtocolProvider {...props}>
          <UiSidebar basePath={basePath} routes={sidebar}>
            {routes}
          </UiSidebar>
        </PubkeyProtocolProvider>
      )}
    />
  )
}
