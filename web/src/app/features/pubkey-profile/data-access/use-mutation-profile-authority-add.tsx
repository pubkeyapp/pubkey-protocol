import { ProfileAuthorityAddOptions, PublicKeyString } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationProfileAuthorityAdd({ community }: { community: PublicKeyString }) {
  const { sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: Omit<ProfileAuthorityAddOptions, 'community'>) =>
      sdk.profileAuthorityAdd({ ...options, community }).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
