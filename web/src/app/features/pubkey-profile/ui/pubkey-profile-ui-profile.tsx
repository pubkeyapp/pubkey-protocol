import { Avatar, Group, Stack, Text } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { ReactNode } from 'react'

import { PubkeyProfileUiIdentity } from './pubkey-profile-ui-identity'

export function PubkeyProfileUiProfile({ children, profile }: { children?: ReactNode; profile: PubKeyProfile }) {
  return (
    <Group align="start">
      <Avatar src={profile.avatarUrl} alt={profile.username} radius={100} size="lg" />
      <Stack gap={0}>
        <Text size="xl" fw="bold">
          {profile.username}
        </Text>
        <Stack gap="xs">
          {profile.identities?.map((identity) => (
            <PubkeyProfileUiIdentity identity={identity} key={identity.providerId} />
          ))}
        </Stack>
        {children}
      </Stack>
    </Group>
  )
}
