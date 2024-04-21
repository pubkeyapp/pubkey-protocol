import { Group, Stack } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { ReactNode } from 'react'
import { UiAvatar } from '../../../ui/ui-avatar'
import { PubkeyProfileUiAnchor } from './pubkey-profile-ui-anchor'

import { PubkeyProfileUiIdentity } from './pubkey-profile-ui-identity'

export function PubkeyProfileUiProfile({
  children,
  profile,
  basePath,
}: {
  children?: ReactNode
  profile: PubKeyProfile
  basePath?: string
}) {
  return (
    <Group align="start" wrap="nowrap">
      <UiAvatar url={profile.avatarUrl ? profile.avatarUrl : null} name={profile.username} radius={100} size="lg" />
      <Stack gap={0}>
        <PubkeyProfileUiAnchor username={profile.username} basePath={basePath} />
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
