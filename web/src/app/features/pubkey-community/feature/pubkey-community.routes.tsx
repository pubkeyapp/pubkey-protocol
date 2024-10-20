import { useRoutes } from 'react-router-dom'
import { PubKeyProtocolLoader } from '../../pubkey-protocol'
import { PubkeyCommunityFeatureCreate } from './pubkey-community-feature-create'
import { PubkeyCommunityFeatureDetail } from './pubkey-community-feature-detail'
import { PubkeyCommunityFeatureList } from './pubkey-community-feature-list'

export default function PubkeyCommunityRoutes({ basePath }: { basePath: string }) {
  const routes = useRoutes([
    {
      index: true,
      element: <PubkeyCommunityFeatureList basePath={basePath} />,
    },
    { path: 'create', element: <PubkeyCommunityFeatureCreate /> },
    { path: ':slug/*', element: <PubkeyCommunityFeatureDetail /> },
  ])

  return <PubKeyProtocolLoader>{routes}</PubKeyProtocolLoader>
}
