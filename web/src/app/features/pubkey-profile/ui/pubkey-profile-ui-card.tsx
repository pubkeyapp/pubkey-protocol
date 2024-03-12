import { Button, Title } from '@mantine/core'
import { UiCard, UiLoader, UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'

import { ellipsify } from '../../account/ui/ellipsify'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { useKeypair } from '../../keypair/data-access'
import { useAnchorProvider } from '../../solana/solana-provider'
import { usePubkeyProfileProgramAccount } from '../data-access'
import { sampleBeeman, sampleSundeep } from '../data-access/pubkey-profile.types'

export function PubkeyProfileUiCard({ account }: { account: PublicKey }) {
  const { profileAccountQuery, updateAvatarUrl, addAuthority, removeAuthority, addIdentity, removeIdentity } =
    usePubkeyProfileProgramAccount({
      account,
    })
  const { keypair } = useKeypair()
  const { publicKey } = useAnchorProvider()
  const username = useMemo(() => profileAccountQuery.data?.username ?? 0, [profileAccountQuery.data?.username])

  const currentAuthority = useMemo(
    () => profileAccountQuery.data?.authorities.find((a) => a.toString() === publicKey.toString()) ?? PublicKey.default,
    [profileAccountQuery.data?.authorities, publicKey],
  )

  return profileAccountQuery.isLoading ? (
    <UiLoader />
  ) : (
    <UiCard>
      <UiStack align="center">
        <Title onClick={() => profileAccountQuery.refetch()}>{username}</Title>
        <Button.Group>
          <Button
            size="xs"
            variant="outline"
            onClick={() =>
              updateAvatarUrl.mutateAsync({
                avatarUrl: sampleBeeman.avatarUrl,
                authority: currentAuthority,
                feePayer: keypair.solana!,
                username: sampleSundeep.username,
              })
            }
            disabled={updateAvatarUrl.isPending}
          >
            Update Avatar Url
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() =>
              addAuthority.mutateAsync({
                newAuthority: new PublicKey('6MHnTjLtxQbD2kPd4XSPmUgDXKaAFvFiAbTZY2fEXhm'),
                authority: currentAuthority,
                feePayer: keypair.solana!,
                username: sampleSundeep.username,
              })
            }
            disabled={updateAvatarUrl.isPending}
          >
            Add Authority
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() =>
              removeAuthority.mutateAsync({
                authorityToRemove: new PublicKey('6MHnTjLtxQbD2kPd4XSPmUgDXKaAFvFiAbTZY2fEXhm'),
                authority: currentAuthority,
                feePayer: keypair.solana!,
                username: sampleSundeep.username,
              })
            }
            disabled={updateAvatarUrl.isPending}
          >
            Remove Authority
          </Button>
        </Button.Group>
        <Button.Group>
          <Button
            size="xs"
            variant="outline"
            onClick={() =>
              addIdentity.mutateAsync({
                authority: currentAuthority,
                feePayer: keypair.solana!,
                nickname: sampleSundeep.identities[0].name,
                providerId: sampleSundeep.identities[0].providerId,
                provider: sampleSundeep.identities[0].provider,
                username: sampleSundeep.username,
              })
            }
            disabled={addIdentity.isPending}
          >
            Add identity
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() =>
              removeIdentity.mutateAsync({
                authority: currentAuthority,
                feePayer: keypair.solana!,
                providerId: sampleSundeep.identities[0].providerId,
                provider: sampleSundeep.identities[0].provider,
                username: sampleSundeep.username,
              })
            }
            disabled={removeIdentity.isPending}
          >
            Remove identity
          </Button>
        </Button.Group>
        <UiStack>
          <ExplorerLink path={`account/${account}`} label={ellipsify(account.toString())} />
        </UiStack>
      </UiStack>
    </UiCard>
  )
}
