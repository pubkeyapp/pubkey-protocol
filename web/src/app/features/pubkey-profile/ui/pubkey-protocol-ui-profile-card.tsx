import { Box, Group, Stack, Text } from '@mantine/core'
import { ellipsify, PubKeyCommunity, PubKeyProfile } from '@pubkey-protocol/sdk'
import { UiCard, UiDebugModal, UiGroup, UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import { UiAppCard } from '../../../ui'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { usePubKeyProtocol } from '../../pubkey-protocol'
import { useMutationProfileUpdate } from '../data-access'
import { PubkeyProtocolUiProfileAnchor } from './pubkey-protocol-ui-profile-anchor'
import { PubkeyProtocolUiProfileAvatar } from './pubkey-protocol-ui-profile-avatar'
import { PubkeyProtocolUiProfileBio } from './pubkey-protocol-ui-profile-bio'
import { PubkeyProtocolUiProfileCardAuthorities } from './pubkey-protocol-ui-profile-card-authorities'
import { PubkeyProtocolUiProfileCardIdentities } from './pubkey-protocol-ui-profile-card-identities'
import { PubkeyProtocolUiProfileDeleteButton } from './pubkey-protocol-ui-profile-delete-button'
import { PubkeyProtocolUiProfileUpdateForm } from './pubkey-protocol-ui-profile-update-form'

export function PubkeyProtocolUiProfileCard({
  community,
  profile,
  refresh,
}: {
  community: PubKeyCommunity
  profile: PubKeyProfile
  refresh: () => void
}) {
  const { authority } = usePubKeyProtocol()
  const mutation = useMutationProfileUpdate({ community: community.publicKey })
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
              <Text size="xs" c="dimmed">
                {profile.username}
              </Text>
              <PubkeyProtocolUiProfileBio profile={profile} />
              <PubkeyProtocolUiProfileCardIdentities
                community={community}
                profile={profile}
                refresh={refresh}
                signAuthority={signAuthority}
              />
              {signAuthority !== PublicKey.default ? (
                <UiStack mt="md">
                  <PubkeyProtocolUiProfileCardAuthorities
                    community={community}
                    profile={profile}
                    signAuthority={signAuthority}
                  />
                  <UiAppCard title="Update Profile">
                    <Box px="sm">
                      <PubkeyProtocolUiProfileUpdateForm
                        profile={profile}
                        submit={(input) =>
                          mutation
                            .mutateAsync(input)
                            .then(() => refresh())
                            .catch((err) => console.log(err))
                        }
                        disabled={!signAuthority || mutation.isPending}
                      />
                    </Box>
                  </UiAppCard>
                  <PubkeyProtocolUiProfileDeleteButton
                    community={community}
                    profile={profile}
                    signAuthority={signAuthority}
                  />
                </UiStack>
              ) : null}
            </Stack>
          </Stack>
        </Group>
      </UiGroup>
    </UiCard>
  )
}
