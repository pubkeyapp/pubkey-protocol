import { SimpleGrid } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-protocol/anchor'
import { UiCard } from '@pubkey-ui/core'

import { PubkeyProtocolUiProfile } from './pubkey-protocol-ui-profile'

export function PubkeyProtocolUiProfileGrid({ profiles, basePath }: { profiles: PubKeyProfile[]; basePath?: string }) {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }}>
      {profiles.map((profile) => (
        <UiCard key={profile.username}>
          <PubkeyProtocolUiProfile profile={profile} basePath={basePath} />
        </UiCard>
      ))}
    </SimpleGrid>
  )
}
