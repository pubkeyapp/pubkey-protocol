import { Button } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { usePubkeyProfileProgramAccount } from '../data-access'

export function PubKeyProfileUiButtonUpdateAvatarUrlButton({
  authority,
  feePayer,
  profile,
}: {
  authority: PublicKey
  feePayer: Keypair
  profile: PubKeyProfile
}) {
  const { updateAvatarUrl } = usePubkeyProfileProgramAccount({ account: profile.publicKey })

  function submit() {
    const avatarUrl = window.prompt('Enter the new avatar URL', profile.avatarUrl)
    if (!avatarUrl) {
      return
    }

    return updateAvatarUrl.mutateAsync({
      avatarUrl,
      authority: authority,
      feePayer,
      username: profile.username,
    })
  }

  return (
    <Button size="xs" variant="outline" onClick={submit} loading={updateAvatarUrl.isPending}>
      Update Avatar Url
    </Button>
  )
}
