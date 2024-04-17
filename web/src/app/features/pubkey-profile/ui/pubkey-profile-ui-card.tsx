import { Button, Group, Stack, Text } from '@mantine/core'
import { UiAlert, UiCard, UiDebugModal, UiGroup, UiLoader, UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'

import { ellipsify } from '../../account/ui/ellipsify'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { useKeypair } from '../../keypair/data-access'
import { useAnchorProvider } from '../../solana/solana-provider'
import { usePubkeyProfileProgramAccount } from '../data-access'
import { PubkeyProfileUiAvatarUpdateButton } from './pubkey-profile-ui-avatar-update-button'
import { PubkeyProfileUiCardAuthorities } from './pubkey-profile-ui-card-authorities'
import { PubkeyProfileUiCardIdentities } from './pubkey-profile-ui-card-identities'

export function PubkeyProfileUiCard({ profilePda }: { profilePda: PublicKey }) {
  const { authorities, profileAccountQuery } = usePubkeyProfileProgramAccount({
    profilePda,
  })
  const { feePayer } = useKeypair()
  const { publicKey } = useAnchorProvider()

  const signAuthority = useMemo(
    () => authorities?.find((a) => a.toString() === publicKey.toString()) ?? PublicKey.default,
    [authorities, publicKey],
  )

  const profile = profileAccountQuery.data

  return profileAccountQuery.isLoading ? (
    <UiLoader />
  ) : profile ? (
    <UiCard
      title={
        <UiGroup align="start" pt="xs">
          <Group align="center" wrap="nowrap" gap="xs">
            <PubkeyProfileUiAvatarUpdateButton authority={signAuthority} feePayer={feePayer} profile={profile} />
            <Stack gap={0}>
              <Text size="xl" fw="bold">
                {profile.username}
              </Text>
              <ExplorerLink
                size="xs"
                ff="mono"
                path={`account/${profilePda}`}
                label={ellipsify(profilePda.toString())}
              />
            </Stack>
          </Group>
          <Group gap="xs">
            <UiDebugModal size="lg" data={profile} />
            <Button
              loading={profileAccountQuery.isLoading}
              size="xs"
              variant="light"
              onClick={() => profileAccountQuery.refetch()}
            >
              Refresh
            </Button>
          </Group>
        </UiGroup>
      }
    >
      <UiStack mt="md">
        <PubkeyProfileUiCardIdentities profile={profile} signAuthority={signAuthority} />
        <PubkeyProfileUiCardAuthorities profile={profile} signAuthority={signAuthority} />
      </UiStack>
    </UiCard>
  ) : (
    <UiAlert message={`No profile found for ${ellipsify(profilePda.toString())}`} />
  )
}
