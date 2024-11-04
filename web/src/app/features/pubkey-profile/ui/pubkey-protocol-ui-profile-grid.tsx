import { Box, Divider, SimpleGrid } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-protocol/sdk'
import { PubkeyProtocolUiIdentityIcons } from './pubkey-protocol-ui-identity-icons'
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
          <Box>
            <Divider label="Identities" labelPosition="left" my={4} />
            <PubkeyProtocolUiIdentityIcons identities={profile.identities} />
          </Box>
        </PubkeyProtocolUiProfileListItem>
      ))}
    </SimpleGrid>
  )
}
