import { Code, Group, Stack } from '@mantine/core'
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
      <UiGroup align="start" w="100%">
        <Group align="start" wrap="nowrap" gap="xs" w="100%">
          <PubkeyProtocolUiProfileAvatar profile={profile} />
          <Stack gap={0} style={{ flexGrow: 1 }}>
            <UiGroup align="center" w="100%">
              <PubkeyProtocolUiProfileAnchor name={profile.name} username={profile.username} basePath={basePath} />
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
              {children}
            </Stack>
          </Stack>
        </Group>
      </UiGroup>
    </UiCard>
  )
}
