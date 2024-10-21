import { ProfileIdentityAddOptions } from '@pubkey-protocol/sdk'
import { PublicKey } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export type PubKeyAddIdentity = Omit<ProfileIdentityAddOptions, 'authority' | 'community' | 'feePayer'>

export function useMutationAddIdentity({ community }: { community: PublicKey }) {
  const { authority, feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: PubKeyAddIdentity) =>
      sdk.profileIdentityAdd({ ...options, authority, community, feePayer }).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
