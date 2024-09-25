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

const PubkeyProfileFeature = lazy(() => import('./features/pubkey-protocol/feature/pubkey-protocol.routes'))
const links: UiHeaderLink[] = [{ label: 'PubKey Protocol', link: '/pubkey-protocol' }]
const routes: RouteObject[] = [
  { path: '/clusters', element: <ClusterFeature /> },
  { path: '/keypairs/*', element: <KeypairFeature /> },
  { path: '/pubkey-protocol/*', element: <PubkeyProfileFeature basePath="/pubkey-protocol" /> },
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
