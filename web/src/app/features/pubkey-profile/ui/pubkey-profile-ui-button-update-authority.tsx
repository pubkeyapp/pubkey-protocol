import { Button } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { usePubkeyProfileProgramAccount } from '../data-access'

export function PubKeyProfileUiButtonUpdateAuthority({
  authority,
  feePayer,
  profile,
}: {
  authority: PublicKey
  feePayer: Keypair
  profile: PubKeyProfile
}) {
  const { addAuthority } = usePubkeyProfileProgramAccount({ account: profile.publicKey })

  function submit() {
    const newAuthority = window.prompt('Enter the new authority', authority.toString())
    if (!newAuthority) {
      return
    }

    return addAuthority.mutateAsync({
      newAuthority: new PublicKey(newAuthority),
      authority: authority,
      feePayer,
      username: profile.username,
    })
  }

  return (
    <Button size="xs" variant="outline" onClick={submit} loading={addAuthority.isPending}>
      Add Authority
    </Button>
  )
}
