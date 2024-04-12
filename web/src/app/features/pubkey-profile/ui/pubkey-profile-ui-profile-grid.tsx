import { SimpleGrid } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { UiCard } from '@pubkey-ui/core'

import { PubkeyProfileUiProfile } from './pubkey-profile-ui-profile'

export function PubkeyProfileUiProfileGrid({ profiles }: { profiles: PubKeyProfile[] }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }}>
      {profiles.map((profile) => (
        <UiCard key={profile.username}>
          <PubkeyProfileUiProfile profile={profile} />
        </UiCard>
      ))}
    </SimpleGrid>
  )
}
