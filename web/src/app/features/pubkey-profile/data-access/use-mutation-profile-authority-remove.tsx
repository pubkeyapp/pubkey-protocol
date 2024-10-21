import { ProfileAuthorityRemoveOptions } from '@pubkey-protocol/sdk'
import { PublicKey } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationProfileAuthorityRemove({ community }: { community: PublicKey }) {
  const { sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: Omit<ProfileAuthorityRemoveOptions, 'community'>) =>
      sdk.profileAuthorityRemove({ ...options, community }).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
