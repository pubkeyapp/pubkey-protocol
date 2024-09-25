import { Group, Stack } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { UiDebugModal } from '@pubkey-ui/core'
import { ReactNode } from 'react'
import { UiAvatar } from '../../../ui/ui-avatar'

import { PubkeyProtocolUiIdentity } from './pubkey-protocol-ui-identity'
import { PubkeyProtocolUiAnchor } from './pubkey-protocol-ui-anchor'

export function PubkeyProtocolUiProfile({
  children,
  profile,
  basePath,
}: {
  children?: ReactNode
  profile: PubKeyProfile
  basePath?: string
}) {
  return (
    <Group align="start" wrap="nowrap" justify="space-between" w="100%">
      <Group align="start" wrap="nowrap">
        <UiAvatar url={profile.avatarUrl ? profile.avatarUrl : null} name={profile.username} radius={100} size="lg" />
        <Stack gap={0}>
          <PubkeyProtocolUiAnchor username={profile.username} basePath={basePath} />
          <Stack gap="xs">
            {profile.identities?.map((identity) => (
              <PubkeyProtocolUiIdentity identity={identity} key={identity.providerId} />
            ))}
          </Stack>
          {children}
        </Stack>
      </Group>
      <UiDebugModal data={profile} />
    </Group>
  )
}
