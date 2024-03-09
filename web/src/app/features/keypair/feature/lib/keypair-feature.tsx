import { Text } from '@mantine/core'
import { UiError, UiStack } from '@pubkey-ui/core'

import { IconDashboard, IconWallet } from '@tabler/icons-react'

import { Navigate, useParams, useRoutes } from 'react-router-dom'
import { useKeypair } from '../../data-access'
import { KeypairUiGridItem, KeypairUiGridSidebar } from '../../ui'
import { KeypairDetailScreen } from './keypair-detail-feature'
import { KeypairListFeature } from './keypair-list-feature'

export default function KeypairFeature() {
  const { keypairs, keypair } = useKeypair()

  const sidebar: KeypairUiGridItem[] = [
    {
      label: 'Overview',
      path: 'overview',
      leftSection: <IconDashboard size={16} />,
    },
    ...keypairs.map(({ name: label, publicKey: path }) => ({
      label: (
        <Text span fw={path === keypair?.publicKey ? 'bold' : 'normal'}>
          {label}
        </Text>
      ),
      path,
      // variant:'filled',
      // variant: path === keypair?.publicKey ? 'filled' : 'subtle',
      leftSection: <IconWallet size={16} />,
    })),
  ]
  const routes = useRoutes([
    { index: true, element: <Navigate to="./overview" replace /> },
    { path: 'overview', element: <KeypairListFeature /> },
    { path: ':publicKey', element: <KeypairDetailWrapper /> },
  ])
  return (
    <UiStack>
      <KeypairUiGridSidebar basePath="/keypairs" routes={sidebar}>
        {routes}
      </KeypairUiGridSidebar>
    </UiStack>
  )
}

export function KeypairDetailWrapper() {
  const { publicKey } = useParams() as { publicKey: string }
  const { keypairs } = useKeypair()

  const keypair = keypairs.find((keypair) => keypair.publicKey === publicKey)?.solana

  if (!keypair) {
    return <UiError message={`Keypair not found: ${publicKey}`} />
  }

  return <KeypairDetailScreen keypair={keypair} />
}
