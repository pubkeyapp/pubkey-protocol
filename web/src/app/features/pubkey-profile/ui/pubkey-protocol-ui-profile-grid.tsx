import { SimpleGrid } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-protocol/anchor'
import { UiCard } from '@pubkey-ui/core'
import { PubkeyProtocolUiIdentity } from './pubkey-protocol-ui-identity'
import { PubkeyProtocolUiProfileListItem } from './pubkey-protocol-ui-profile-list-item'

export function PubkeyProtocolUiProfileGrid({ profiles, basePath }: { profiles: PubKeyProfile[]; basePath?: string }) {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }}>
      {profiles.map((profile) => (
        <PubkeyProtocolUiProfileListItem
          key={profile.username}
          profile={profile}
          to={`${basePath}/${profile.username}`}
        >
          {profile.identities?.map((identity) => (
            <UiCard key={`${identity.provider}-${identity.providerId}`}>
              <PubkeyProtocolUiIdentity identity={identity} key={identity.providerId} />
            </UiCard>
          ))}
        </PubkeyProtocolUiProfileListItem>
      ))}
    </SimpleGrid>
  )
}
