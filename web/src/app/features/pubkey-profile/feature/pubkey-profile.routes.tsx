import { IconBug, IconDashboard, IconTools, IconUserPlus } from '@tabler/icons-react'
import { Navigate, useRoutes } from 'react-router-dom'
import { KeypairUiGridItem } from '../../keypair/ui'
import { PubKeyProfileProvider } from '../data-access'

import { PubKeyProfileUiSidebar } from '../ui/pubkey-profile-ui-sidebar'

import { PubkeyProfileFeatureCreate } from './pubkey-profile-feature-create'
import { PubkeyProfileFeatureDebug } from './pubkey-profile-feature-debug'
import { PubkeyProfileFeatureDetail } from './pubkey-profile-feature-detail'
import { PubkeyProfileFeatureList } from './pubkey-profile-feature-list'
import { PubkeyProfileFeatureTools } from './pubkey-profile-feature-tools'

export default function PubkeyProfileRoutes({ basePath }: { basePath: string }) {
  const sidebar: KeypairUiGridItem[] = [
    {
      label: 'Overview',
      path: 'overview',
      leftSection: <IconDashboard size={16} />,
    },
    {
      label: 'Tools',
      path: 'tools',
      leftSection: <IconTools size={16} />,
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
    { index: true, element: <Navigate to="./overview" replace /> },
    { path: 'overview', element: <PubkeyProfileFeatureList basePath={basePath} /> },
    { path: 'tools', element: <PubkeyProfileFeatureTools /> },
    { path: 'create', element: <PubkeyProfileFeatureCreate /> },
    { path: 'debug', element: <PubkeyProfileFeatureDebug /> },
    { path: ':username', element: <PubkeyProfileFeatureDetail /> },
  ])

  return (
    <PubKeyProfileProvider>
      <PubKeyProfileUiSidebar basePath={basePath} routes={sidebar}>
        {routes}
      </PubKeyProfileUiSidebar>
    </PubKeyProfileProvider>
  )
}
