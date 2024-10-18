import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { ellipsify } from '@pubkey-protocol/sdk'
import { UiAnchor, UiCard, UiDebugModal, UiInfoTable, UiLoader, UiStack, UiTabRoutes, UiWarning } from '@pubkey-ui/core'
import { useParams } from 'react-router-dom'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { useQueryCommunityGetBySlug } from '../data-access'
import { PubkeyProtocolUiCommunityHeader } from '../ui/'
import { PubkeyCommunityFeatureAuthority } from './pubkey-community-feature-authority'
import { PubkeyCommunityFeatureProviders } from './pubkey-community-feature-providers'
import { PubkeyCommunityFeatureSettings } from './pubkey-community-feature-settings'

export function PubkeyCommunityFeatureDetail() {
  const { slug } = useParams() as { slug: string }

  const query = useQueryCommunityGetBySlug({ slug })

  return query.isLoading ? (
    <UiLoader />
  ) : query.data ? (
    <UiStack>
      <PubkeyProtocolUiCommunityHeader community={query.data} />
      <UiTabRoutes
        tabs={[
          {
            label: 'Overview',
            path: 'overview',
            element: (
              <UiStack>
                <UiCard>
                  <CommunityInfo community={query.data}></CommunityInfo>
                </UiCard>
              </UiStack>
            ),
          },
          {
            label: 'Authority',
            path: 'authority',
            element: <PubkeyCommunityFeatureAuthority community={query.data} />,
          },
          {
            label: 'Providers',
            path: 'providers',
            element: <PubkeyCommunityFeatureProviders community={query.data} />,
          },
          {
            label: 'Settings',
            path: 'settings',
            element: <PubkeyCommunityFeatureSettings community={query.data} />,
          },
        ]}
      />
    </UiStack>
  ) : (
    <UiWarning message="Community not found" />
  )
}

export function CommunityInfo({ community }: { community: PubKeyCommunity }) {
  return (
    <UiInfoTable
      items={[
        ['Name', community?.name],
        ['Slug', community?.slug],
        ['Avatar URL', community?.avatarUrl],
        ['Discord', <MaybeLink link={community?.discord} />],
        ['Farcaster', <MaybeLink link={community?.farcaster} />],
        ['Github', <MaybeLink link={community?.github} />],
        ['Telegram', <MaybeLink link={community?.telegram} />],
        ['Website', <MaybeLink link={community?.website} />],
        ['X', <MaybeLink link={community?.x} />],
        [
          'Account',
          <ExplorerLink
            path={`account/${community?.publicKey}`}
            label={ellipsify(community?.publicKey.toString(), 8)}
          />,
        ],
        ['Debug', <UiDebugModal data={community} />],
      ]}
    />
  )
}

function MaybeLink({ link }: { link?: string }) {
  return link ? (
    <UiAnchor to={link} target="_blank">
      {link.replace('https://', '')}
    </UiAnchor>
  ) : (
    'None'
  )
}
