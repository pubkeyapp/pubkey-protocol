import { Button } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { usePubkeyProfileProgramAccount } from '../data-access'

export function PubKeyProfileUiButtonAddAuthority({
  authority,
  feePayer,
  profile: { publicKey: profilePda, username },
}: {
  authority: PublicKey
  feePayer: Keypair
  profile: PubKeyProfile
}) {
  const { addAuthority } = usePubkeyProfileProgramAccount({ profilePda })

  function submit() {
    const newAuthority = window.prompt('Enter the new authority', authority.toString())
    if (!newAuthority) {
      return
    }
    const newAuthorityPubKey = new PublicKey(newAuthority)

    return addAuthority
      .mutateAsync({
        newAuthority: newAuthorityPubKey,
        authority,
        feePayer,
        username,
      })
      .catch((err) => {
        console.log(`Err: ${err}`)
      })
  }

  return (
    <Button size="xs" variant="light" onClick={submit} loading={addAuthority.isPending}>
      Add
    </Button>
  )
}
