import { Group } from '@mantine/core'
import { UiHeaderLink, UiNotFound, UiThemeLink, UiThemeSwitch } from '@pubkey-ui/core'
import { lazy } from 'react'
import { Link, Navigate, RouteObject, useRoutes } from 'react-router-dom'
import { AppLayout } from './app-layout'
import { ClusterUiSelect } from './features/cluster/cluster-ui'
import { DashboardFeature } from './features/dashboard/dashboard-feature'
import { KeypairFeature } from './features/keypair/feature'
import { KeypairUiBalance, KeypairUiSelect } from './features/keypair/ui'
import { WalletIcon } from './features/solana/solana-provider'

const AccountList = lazy(() => import('./features/account/account-feature-list'))
const AccountDetail = lazy(() => import('./features/account/account-feature-detail'))
const ClusterFeature = lazy(() => import('./features/cluster/cluster-feature'))

const PubkeyProfileFeature = lazy(() => import('./features/pubkey-profile/feature/pubkey-profile.routes'))
const links: UiHeaderLink[] = [
  { label: 'Dashboard', link: '/dashboard' },
  { label: 'Account', link: '/account' },
  { label: 'Clusters', link: '/clusters' },
  { label: 'PubKey Profile', link: '/pubkey-profile' },
]
const routes: RouteObject[] = [
  { path: '/account', element: <AccountList /> },
  { path: '/account/:address', element: <AccountDetail /> },
  { path: '/clusters', element: <ClusterFeature /> },
  { path: '/keypairs/*', element: <KeypairFeature /> },
  { path: '/pubkey-profile/*', element: <PubkeyProfileFeature basePath="/pubkey-profile" /> },
]

export function AppRoutes() {
  const router = useRoutes([
    { path: '/', element: <Navigate to="/dashboard" replace /> },
    ...routes,
    { path: '/dashboard', element: <DashboardFeature /> },
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
