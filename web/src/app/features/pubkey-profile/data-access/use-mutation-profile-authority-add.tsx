import { ProfileAuthorityAddOptions } from '@pubkey-protocol/sdk'
import { PublicKey } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationProfileAuthorityAdd({ community }: { community: PublicKey }) {
  const { sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: Omit<ProfileAuthorityAddOptions, 'community'>) =>
      sdk.profileAuthorityAdd({ ...options, community }).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
