import { RemoveAuthorityOptions } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationProfileAuthorityRemove() {
  const { sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: RemoveAuthorityOptions) =>
      sdk.profileAuthorityRemove(options).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
