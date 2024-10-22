import { ProfileIdentityRemoveOptions, PublicKeyString } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationProfileIdentityRemove({ community }: { community: PublicKeyString }) {
  const { sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: Omit<ProfileIdentityRemoveOptions, 'community'>) =>
      sdk.profileIdentityRemove({ ...options, community }).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
