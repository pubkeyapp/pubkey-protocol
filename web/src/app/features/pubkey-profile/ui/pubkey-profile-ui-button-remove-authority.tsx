import { Button } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { usePubkeyProfileProgramAccount } from '../data-access'

export function PubKeyProfileUiButtonRemoveAuthority({
  authority,
  feePayer,
  profile,
}: {
  authority: PublicKey
  feePayer: Keypair
  profile: PubKeyProfile
}) {
  const { removeAuthority } = usePubkeyProfileProgramAccount({ account: profile.publicKey })

  function submit() {
    const authorityToRemove = window.prompt('Enter the authority to remove', authority.toString())
    if (!authorityToRemove) {
      return
    }

    return removeAuthority.mutateAsync({
      authorityToRemove: new PublicKey(authorityToRemove),
      authority,
      feePayer,
      username: profile.username,
    })
  }

  return (
    <Button size="xs" variant="outline" onClick={submit} loading={removeAuthority.isPending}>
      Remove Authority
    </Button>
  )
}
