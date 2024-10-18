import { UiCard, UiDebug, UiInfoTable, UiLoader, UiStack, UiTabRoutes, UiWarning } from '@pubkey-ui/core'
import { useParams } from 'react-router-dom'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { useQueryGetCommunityBySlug } from '../data-access'
import { PubkeyProtocolUiCommunityHeader } from '../ui/'
import { PubkeyCommunityFeatureAuthority } from './pubkey-community-feature-authority'
import { PubkeyCommunityFeatureSettings } from './pubkey-community-feature-settings'

export function PubkeyCommunityFeatureDetail() {
  const { slug } = useParams() as { slug: string }

  const query = useQueryGetCommunityBySlug({ slug })

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
                  <UiInfoTable
                    items={[
                      ['Name', query.data?.name],
                      ['Slug', query.data?.slug],
                      ['Avatar URL', query.data?.avatarUrl],
                      [
                        'Account',
                        <ExplorerLink
                          size="xs"
                          ff="mono"
                          path={`account/${query.data?.publicKey}`}
                          label={query.data?.publicKey.toString()}
                        />,
                      ],
                    ]}
                  />
                </UiCard>
              </UiStack>
            ),
          },
          {
            label: 'Debug',
            path: 'debug',
            element: <UiDebug data={query.data} open />,
          },
          {
            label: 'Authority',
            path: 'authority',
            element: <PubkeyCommunityFeatureAuthority community={query.data} />,
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
