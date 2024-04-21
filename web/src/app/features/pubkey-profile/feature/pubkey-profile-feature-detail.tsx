import { UiLoader, UiPage, UiWarning } from '@pubkey-ui/core'
import { IconUser } from '@tabler/icons-react'
import { useParams } from 'react-router-dom'
import { useQueryGetProfileByUsername } from '../data-access'
import { PubkeyProfileUiCard } from '../ui'

export function PubkeyProfileFeatureDetail() {
  const { username } = useParams() as { username: string }

  const query = useQueryGetProfileByUsername({ username })

  return (
    <UiPage leftAction={<IconUser />} title={username}>
      {query.isLoading ? (
        <UiLoader />
      ) : query.data ? (
        <PubkeyProfileUiCard profile={query.data} />
      ) : (
        <UiWarning message="User not found" />
      )}
    </UiPage>
  )
}
