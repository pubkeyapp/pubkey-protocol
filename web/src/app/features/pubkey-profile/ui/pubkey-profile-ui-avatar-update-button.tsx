import { UnstyledButton } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { usePubkeyProfileProgramAccount } from '../data-access'
import { PubkeyProfileUiAvatar } from './pubkey-profile-ui-avatar'

export function PubkeyProfileUiAvatarUpdateButton({
  authority,
  feePayer,
  profile,
}: {
  authority: PublicKey
  feePayer: Keypair
  profile: PubKeyProfile
}) {
  const { updateAvatarUrl } = usePubkeyProfileProgramAccount({ profilePda: profile.publicKey })

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
    <UnstyledButton onClick={submit}>
      <PubkeyProfileUiAvatar profile={profile} />
    </UnstyledButton>
  )
}
