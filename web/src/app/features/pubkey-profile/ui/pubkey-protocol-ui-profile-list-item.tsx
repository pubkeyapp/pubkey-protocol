import { Code, Group, Stack } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-protocol/sdk'
import { ellipsify } from '@pubkey-protocol/sdk'
import { UiCard, UiDebugModal, UiGroup } from '@pubkey-ui/core'
import { ReactNode } from 'react'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { PubkeyProtocolUiProfileAnchor } from './pubkey-protocol-ui-profile-anchor'
import { PubkeyProtocolUiProfileAvatar } from './pubkey-protocol-ui-profile-avatar'

export function PubkeyProtocolUiProfileListItem({
  children,
  profile,
  to,
}: {
  children?: ReactNode
  profile: PubKeyProfile
  to?: string
}) {
  return (
    <UiCard>
      <UiGroup align="start" w="100%">
        <Group align="start" wrap="nowrap" gap="xs" w="100%">
          <PubkeyProtocolUiProfileAvatar profile={profile} />
          <Stack gap={0} style={{ flexGrow: 1 }}>
            <UiGroup align="center" w="100%">
              <PubkeyProtocolUiProfileAnchor profile={profile} to={to} />
              <Group gap="xs">
                <ExplorerLink
                  size="xs"
                  ff="mono"
                  path={`account/${profile.publicKey}`}
                  label={ellipsify(profile.publicKey.toString())}
                />
                <UiDebugModal data={profile} />
              </Group>
            </UiGroup>
            <Stack w="100%">
              <Group>
                <Code>{profile.username}</Code>
              </Group>
              {profile.bio && (
                <Group>
                  <Code>{profile.bio}</Code>
                </Group>
              )}
              {children}
            </Stack>
          </Stack>
        </Group>
      </UiGroup>
    </UiCard>
  )
}
