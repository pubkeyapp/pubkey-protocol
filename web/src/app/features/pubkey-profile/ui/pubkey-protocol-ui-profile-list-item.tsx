import { Group, Stack } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-protocol/anchor'
import { UiCard, UiDebugModal, UiGroup } from '@pubkey-ui/core'
import { ReactNode } from 'react'
import { ellipsify } from '../../../ui'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { PubkeyProtocolUiProfileAnchor } from './pubkey-protocol-ui-profile-anchor'
import { PubkeyProtocolUiProfileAvatar } from './pubkey-protocol-ui-profile-avatar'

export function PubkeyProtocolUiProfileListItem({
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
          <PubkeyProtocolUiProfileAvatar profile={profile} />
          <Stack gap={0}>
            <PubkeyProtocolUiProfileAnchor username={profile.username} basePath={basePath} />
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
