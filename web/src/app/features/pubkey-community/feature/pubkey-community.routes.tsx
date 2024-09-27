import { IconUsers, IconUsersPlus } from '@tabler/icons-react'
import { Navigate, useRoutes } from 'react-router-dom'
import { KeypairUiGridItem } from '../../keypair/ui'
import { PubkeyCommunityFeatureList } from './pubkey-community-feature-list'
import { PubkeyCommunityFeatureCreate } from './pubkey-community-feature-create'
import { PubkeyCommunityFeatureDetail } from './pubkey-community-feature-detail'
import { PubkeyProtocolProvider } from '../../pubkey-protocol'
import { UiSidebar } from '../../../ui'
import { SolanaConnectionLoader } from '../../solana'

export default function PubkeyCommunityRoutes({ basePath }: { basePath: string }) {
  const sidebar: KeypairUiGridItem[] = [
    {
      label: 'Communities',
      path: 'list',
      leftSection: <IconUsers size={16} />,
    },
    {
      label: 'Create',
      path: 'create',
      leftSection: <IconUsersPlus size={16} />,
    },
  ]
  const routes = useRoutes([
    { index: true, element: <Navigate to="list" replace /> },
    { path: 'list', element: <PubkeyCommunityFeatureList basePath={basePath} /> },
    { path: 'create', element: <PubkeyCommunityFeatureCreate /> },
    { path: ':slug', element: <PubkeyCommunityFeatureDetail /> },
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
