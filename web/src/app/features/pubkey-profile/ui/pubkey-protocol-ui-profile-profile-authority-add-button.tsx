import { Button } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-protocol/anchor'
import { PublicKey } from '@solana/web3.js'
import { useMutationProfileAuthorityAdd } from '../data-access'

export function PubkeyProtocolUiProfileProfileAuthorityAddButton({
  authority,
  feePayer,
  profile: { username },
}: {
  authority: PublicKey
  feePayer: PublicKey
  profile: PubKeyProfile
}) {
  const mutation = useMutationProfileAuthorityAdd()

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
