import { ProfileAuthorityRemoveOptions, PublicKeyString } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationProfileAuthorityRemove({ community }: { community: PublicKeyString }) {
  const { sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: Omit<ProfileAuthorityRemoveOptions, 'community'>) =>
      sdk.profileAuthorityRemove({ ...options, community }).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
