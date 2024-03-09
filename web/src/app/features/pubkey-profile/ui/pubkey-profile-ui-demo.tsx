import { Title } from '@mantine/core'
import { UiStack } from '@pubkey-ui/core'
import { sampleProfiles } from '../data-access/pubkey-profile.types'
import { PubkeyProfileUiProfileGrid } from './pubkey-profile-ui-profile-grid'

export function PubkeyProfileUiDemo() {
  return (
    <UiStack>
      <Title order={3}>Ui Demo with dummy data</Title>
      <PubkeyProfileUiProfileGrid profiles={sampleProfiles} />
    </UiStack>
  )
}
