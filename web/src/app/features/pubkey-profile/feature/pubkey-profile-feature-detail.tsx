import { Group } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/sdk'
import { UiBack, UiDebugModal, UiLoader, UiPage, UiStack, UiWarning } from '@pubkey-ui/core'
import { useParams } from 'react-router-dom'
import { PubkeyProtocolUiCommunitySelect } from '../../pubkey-community/ui'
import { useQueryProfileGet } from '../data-access'
import { PubkeyProtocolUiProfileCard } from '../ui'

export function PubkeyProfileFeatureDetail({ community }: { community: PubKeyCommunity }) {
  const { username } = useParams() as { username: string }

  const query = useQueryProfileGet({ username })

  return (
    <UiPage
      leftAction={<UiBack />}
      title="Profile details"
      rightAction={
        <Group>
          <UiDebugModal data={query.data} />
          <PubkeyProtocolUiCommunitySelect />
        </Group>
      }
    >
      <UiStack>
        {query.isLoading ? (
          <UiLoader />
        ) : query.data ? (
          <PubkeyProtocolUiProfileCard community={community} profile={query.data} />
        ) : (
          <UiWarning message="Profile not found" />
        )}
      </UiStack>
    </UiPage>
  )
}
