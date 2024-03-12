import { Button } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { usePubkeyProfileProgramAccount } from '../data-access'
import { sampleSundeep } from '../data-access/pubkey-profile.types'

export function PubKeyProfileUiButtonRemoveIdentity({
  authority,
  feePayer,
  profile,
}: {
  authority: PublicKey
  feePayer: Keypair
  profile: PubKeyProfile
}) {
  const { removeIdentity } = usePubkeyProfileProgramAccount({ account: profile.publicKey })

  function submit() {
    return removeIdentity.mutateAsync({
      authority,
      feePayer,
      providerId: sampleSundeep.identities[0].providerId,
      provider: sampleSundeep.identities[0].provider,
      username: sampleSundeep.username,
    })
  }

  return (
    <Button size="xs" variant="outline" onClick={submit} loading={removeIdentity.isPending}>
      Remove Identity
    </Button>
  )
}
