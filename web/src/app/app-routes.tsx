import { Group } from '@mantine/core'
import { UiHeaderLink, UiNotFound, UiThemeLink, UiThemeSwitch } from '@pubkey-ui/core'
import { lazy } from 'react'
import { Link, Navigate, RouteObject, useRoutes } from 'react-router-dom'
import { AppLayout } from './app-layout'
import { ClusterUiSelect } from './features/cluster/cluster-ui'
import { KeypairFeature } from './features/keypair/feature'
import { KeypairUiBalance, KeypairUiSelect } from './features/keypair/ui'
import { WalletIcon } from './features/solana/solana-provider'

const ClusterFeature = lazy(() => import('./features/cluster/cluster-feature'))

const PubkeyCommunityFeature = lazy(() => import('./features/pubkey-community/feature/pubkey-community.routes'))
const PubkeyProfileFeature = lazy(() => import('./features/pubkey-profile/feature/pubkey-profile.routes'))
const PubkeyProtocolFeature = lazy(() => import('./features/pubkey-protocol/feature/pubkey-protocol.routes'))

const links: UiHeaderLink[] = [
  { label: 'Communities', link: '/communities' },
  { label: 'Profiles', link: '/profiles' },
  { label: 'Debug', link: '/debug' },
]

const routes: RouteObject[] = [
  { path: '/clusters', element: <ClusterFeature /> },
  { path: '/keypairs/*', element: <KeypairFeature /> },
  { path: '/communities/*', element: <PubkeyCommunityFeature basePath="/communities" /> },
  { path: '/profiles/*', element: <PubkeyProfileFeature basePath="/profiles" /> },
  { path: '/debug/*', element: <PubkeyProtocolFeature /> },
]

export function AppRoutes() {
  const router = useRoutes([
    { path: '/', element: <Navigate to="/pubkey-protocol" replace /> },
    ...routes,

    { path: '*', element: <UiNotFound /> },
  ])

  return (
    <AppLayout
      links={links}
      profile={
        <Group>
          <KeypairUiBalance />
          <KeypairUiSelect />
          <ClusterUiSelect />
          <WalletIcon />
          <UiThemeSwitch />
        </Group>
      }
    >
      {router}
    </AppLayout>
  )
}

export const ThemeLink: UiThemeLink = ({ children, ...props }) => <Link {...props}>{children}</Link>
