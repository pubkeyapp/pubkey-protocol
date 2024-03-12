import { Button, Group } from '@mantine/core'
import { UiAlert, UiCard, UiDebug, UiLoader, UiStack } from '@pubkey-ui/core'
import { Keypair, PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'

import { ellipsify } from '../../account/ui/ellipsify'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { useKeypair } from '../../keypair/data-access'
import { useAnchorProvider } from '../../solana/solana-provider'
import { usePubkeyProfileProgramAccount } from '../data-access'
import { PubKeyProfileUiButtonAddIdentity } from './pubkey-profile-ui-button-add-identity'
import { PubKeyProfileUiButtonRemoveAuthority } from './pubkey-profile-ui-button-remove-authority'
import { PubKeyProfileUiButtonRemoveIdentity } from './pubkey-profile-ui-button-remove-identity'
import { PubKeyProfileUiButtonUpdateAuthority } from './pubkey-profile-ui-button-update-authority'
import { PubKeyProfileUiButtonUpdateAvatarUrlButton } from './pubkey-profile-ui-button-update-avatar-url-button'
import { PubkeyProfileUiProfile } from './pubkey-profile-ui-profile'

export function PubkeyProfileUiCard({ account }: { account: PublicKey }) {
  const { authorities, profileAccountQuery } = usePubkeyProfileProgramAccount({
    account,
  })
  const { keypair } = useKeypair()
  const { publicKey } = useAnchorProvider()

  const authority = useMemo(
    () => authorities?.find((a) => a.toString() === publicKey.toString()) ?? PublicKey.default,
    [authorities, publicKey],
  )
  const profile = profileAccountQuery.data
  const feePayer = keypair.solana as Keypair

  return profileAccountQuery.isLoading ? (
    <UiLoader />
  ) : profile ? (
    <UiCard>
      <PubkeyProfileUiProfile profile={profile}>
        <UiStack mt="md">
          <Group>
            <ExplorerLink path={`account/${account}`} label={ellipsify(account.toString())} />
          </Group>
          <Group>
            <Button size="xs" variant="outline" onClick={() => profileAccountQuery.refetch()}>
              Refresh
            </Button>
            <PubKeyProfileUiButtonUpdateAvatarUrlButton authority={authority} feePayer={feePayer} profile={profile} />
          </Group>
          <Group>
            <PubKeyProfileUiButtonUpdateAuthority authority={authority} feePayer={feePayer} profile={profile} />
            <PubKeyProfileUiButtonRemoveAuthority authority={authority} feePayer={feePayer} profile={profile} />
          </Group>
          <Group>
            <PubKeyProfileUiButtonAddIdentity authority={authority} feePayer={feePayer} profile={profile} />
            <PubKeyProfileUiButtonRemoveIdentity authority={authority} feePayer={feePayer} profile={profile} />
          </Group>
          <UiDebug data={{ data: profile }} />
        </UiStack>
      </PubkeyProfileUiProfile>
    </UiCard>
  ) : (
    <UiAlert message={`No profile found for ${ellipsify(account.toString())}`} />
  )
}
