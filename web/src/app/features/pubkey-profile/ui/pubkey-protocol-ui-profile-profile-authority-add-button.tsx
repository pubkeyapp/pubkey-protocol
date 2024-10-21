import { Button } from '@mantine/core'
import { PubKeyCommunity, PubKeyProfile } from '@pubkey-protocol/anchor'
import { PublicKey } from '@solana/web3.js'
import { useMutationProfileAuthorityAdd } from '../data-access'

export function PubkeyProtocolUiProfileProfileAuthorityAddButton({
  authority,
  community,
  feePayer,
  profile: { username },
}: {
  authority: PublicKey
  community: PubKeyCommunity
  feePayer: PublicKey
  profile: PubKeyProfile
}) {
  const mutation = useMutationProfileAuthorityAdd({ community: community.publicKey })

  function submit() {
    const newAuthority = window.prompt('Enter the new authority', authority.toString())
    if (!newAuthority) {
      return
    }
    const newAuthorityPubKey = new PublicKey(newAuthority)

    return mutation
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
    <Button size="xs" variant="light" onClick={submit} loading={mutation.isPending}>
      Add
    </Button>
  )
}
