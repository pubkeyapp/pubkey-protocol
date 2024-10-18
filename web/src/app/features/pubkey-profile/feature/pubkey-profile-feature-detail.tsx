import { UiLoader, UiStack, UiWarning } from '@pubkey-ui/core'
import { useParams } from 'react-router-dom'
import { useQueryGetProfileByUsername } from '../data-access'
import { PubkeyProtocolUiProfileCard } from '../ui'

export function PubkeyProfileFeatureDetail() {
  const { username } = useParams() as { username: string }

  const query = useQueryGetProfileByUsername({ username })

  return (
    <UiStack>
      {query.isLoading ? (
        <UiLoader />
      ) : query.data ? (
        <PubkeyProtocolUiProfileCard profile={query.data} />
      ) : (
        <UiWarning message="Profile not found" />
      )}
    </UiStack>
  )
}
