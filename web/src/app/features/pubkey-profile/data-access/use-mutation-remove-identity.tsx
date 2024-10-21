import { ProfileIdentityRemoveOptions } from '@pubkey-protocol/sdk'
import { PublicKey } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationRemoveIdentity({ community }: { community: PublicKey }) {
  const { sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: Omit<ProfileIdentityRemoveOptions, 'community'>) =>
      sdk.profileIdentityRemove({ ...options, community }).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
