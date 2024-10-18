import { Code, Group, Stack } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-protocol/anchor'
import { ellipsify } from '@pubkey-protocol/sdk'
import { UiCard, UiDebugModal, UiGroup, UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { usePubKeyProtocol } from '../../pubkey-protocol'
import { PubkeyProtocolUiProfileAnchor } from './pubkey-protocol-ui-profile-anchor'
import { PubkeyProtocolUiProfileAvatar } from './pubkey-protocol-ui-profile-avatar'
import { PubkeyProtocolUiProfileAvatarUpdateButton } from './pubkey-protocol-ui-profile-avatar-update-button'
import { PubkeyProtocolUiProfileCardAuthorities } from './pubkey-protocol-ui-profile-card-authorities'
import { PubkeyProtocolUiProfileCardIdentities } from './pubkey-protocol-ui-profile-card-identities'

export function PubkeyProtocolUiProfileCard({ profile }: { profile: PubKeyProfile }) {
  const { authority } = usePubKeyProtocol()

  const signAuthority = useMemo(
    () => profile.authorities?.find((a) => a.toString() === authority.toString()) ?? PublicKey.default,
    [profile.authorities, authority],
  )

  return (
    <UiCard>
      <UiGroup align="start" w="100%">
        <Group align="start" wrap="nowrap" gap="xs" w="100%">
          <PubkeyProtocolUiProfileAvatar profile={profile} />
          <Stack gap={0} style={{ flexGrow: 1 }}>
            <UiGroup align="center" w="100%">
              <PubkeyProtocolUiProfileAnchor profile={profile} />
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

              {signAuthority ? (
                <UiStack mt="md">
                  <PubkeyProtocolUiProfileCardIdentities profile={profile} signAuthority={signAuthority} />
                  <PubkeyProtocolUiProfileCardAuthorities profile={profile} signAuthority={signAuthority} />
                  <PubkeyProtocolUiProfileAvatarUpdateButton profile={profile} signAuthority={signAuthority} />
                </UiStack>
              ) : null}
            </Stack>
          </Stack>
        </Group>
      </UiGroup>
    </UiCard>
  )
}
