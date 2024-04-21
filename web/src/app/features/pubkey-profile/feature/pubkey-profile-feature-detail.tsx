import { UiLoader, UiWarning } from '@pubkey-ui/core'
import { useParams } from 'react-router-dom'
import { useQueryGetProfileByUsername } from '../data-access'
import { PubkeyProfileUiCard } from '../ui'

export function PubkeyProfileFeatureDetail() {
  const { username } = useParams() as { username: string }

  const query = useQueryGetProfileByUsername({ username })

  return query.isLoading ? (
    <UiLoader />
  ) : query.data ? (
    <PubkeyProfileUiCard profile={query.data} />
  ) : (
    <UiWarning message="User not found" />
  )
}
