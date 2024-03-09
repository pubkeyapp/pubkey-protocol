import { SimpleGrid } from '@mantine/core'
import { UiCard } from '@pubkey-ui/core'
import { PubKeyProfile } from '../data-access/pubkey-profile.types'

import { PubkeyProfileUiProfile } from './pubkey-profile-ui-profile'

export function PubkeyProfileUiProfileGrid({ profiles }: { profiles: PubKeyProfile[] }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
      {profiles.map((profile) => (
        <UiCard key={profile.username}>
          <PubkeyProfileUiProfile profile={profile} />
        </UiCard>
      ))}
    </SimpleGrid>
  )
}
