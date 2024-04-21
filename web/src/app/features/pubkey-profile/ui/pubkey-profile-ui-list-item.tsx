import { Group, Stack } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { UiCard, UiDebugModal, UiGroup } from '@pubkey-ui/core'
import { ReactNode } from 'react'
import { ellipsify } from '../../../ui'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { PubkeyProfileUiAnchor } from './pubkey-profile-ui-anchor'
import { PubkeyProfileUiAvatar } from './pubkey-profile-ui-avatar'

export function PubkeyProfileUiListItem({
  children,
  profile,
  basePath,
}: {
  children?: ReactNode
  profile: PubKeyProfile
  basePath?: string
}) {
  return (
    <UiCard>
      <UiGroup align="start">
        <Group align="center" wrap="nowrap" gap="xs">
          <PubkeyProfileUiAvatar profile={profile} />
          <Stack gap={0}>
            <PubkeyProfileUiAnchor username={profile.username} basePath={basePath} />
            <ExplorerLink
              size="xs"
              ff="mono"
              path={`account/${profile.publicKey}`}
              label={ellipsify(profile.publicKey.toString())}
            />
          </Stack>
        </Group>
        <Group gap="xs">
          <UiDebugModal size="lg" data={profile} />
        </Group>
      </UiGroup>
      {children}
    </UiCard>
  )
}
