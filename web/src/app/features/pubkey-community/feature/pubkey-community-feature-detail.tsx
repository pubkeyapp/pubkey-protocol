import { UiLoader, UiPage, UiWarning } from '@pubkey-ui/core'
import { IconUsers } from '@tabler/icons-react'
import { useParams } from 'react-router-dom'
import { useQueryGetCommunityBySlug } from '../data-access'
import { PubkeyProtocolUiCommunityCard } from '../ui'

export function PubkeyCommunityFeatureDetail() {
  const { slug } = useParams() as { slug: string }

  const query = useQueryGetCommunityBySlug({ slug })

  return (
    <UiPage leftAction={<IconUsers />} title={slug}>
      {query.isLoading ? (
        <UiLoader />
      ) : query.data ? (
        <PubkeyProtocolUiCommunityCard community={query.data} />
      ) : (
        <UiWarning message="Community not found" />
      )}
    </UiPage>
  )
}
