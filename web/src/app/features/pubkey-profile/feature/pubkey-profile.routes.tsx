import { useRoutes } from 'react-router-dom'
import { PubKeyCommunityProvider, usePubKeyCommunity } from '../../pubkey-community/data-access'
import { PubKeyProtocolLoader } from '../../pubkey-protocol'

import { PubkeyProfileFeatureCreate } from './pubkey-profile-feature-create'
import { PubkeyProfileFeatureDetail } from './pubkey-profile-feature-detail'
import { PubkeyProfileFeatureList } from './pubkey-profile-feature-list'
import { PubkeyProfileFeatureSearch } from './pubkey-profile-feature-search'

export default function PubkeyProfileRoutes({ basePath }: { basePath: string }) {
  return (
    <PubKeyProtocolLoader>
      <PubKeyCommunityProvider>
        <Router basePath={basePath} />
      </PubKeyCommunityProvider>
    </PubKeyProtocolLoader>
  )
}

export function Router({ basePath }: { basePath: string }) {
  const { community } = usePubKeyCommunity()

  return useRoutes([
    { index: true, element: <PubkeyProfileFeatureList basePath={basePath} /> },
    { path: 'create', element: <PubkeyProfileFeatureCreate community={community} /> },
    { path: 'search', element: <PubkeyProfileFeatureSearch /> },
    { path: ':username', element: <PubkeyProfileFeatureDetail community={community} /> },
  ])
}
