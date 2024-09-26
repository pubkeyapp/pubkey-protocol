import { RemoveAuthorityOptions } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationRemoveAuthority() {
  const { sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: RemoveAuthorityOptions) => sdk.removeAuthority(options).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
