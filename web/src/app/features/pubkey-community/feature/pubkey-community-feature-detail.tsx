import { UiLoader, UiStack, UiWarning } from '@pubkey-ui/core'
import { useParams } from 'react-router-dom'
import { useQueryGetCommunityBySlug } from '../data-access'
import { PubkeyProtocolUiCommunityCard } from '../ui/'

export function PubkeyCommunityFeatureDetail() {
  const { slug } = useParams() as { slug: string }

  const query = useQueryGetCommunityBySlug({ slug })

  return query.isLoading ? (
    <UiLoader />
  ) : query.data ? (
    <UiStack>
      <PubkeyProtocolUiCommunityCard community={query.data} />
    </UiStack>
  ) : (
    <UiWarning message="Community not found" />
  )
}
