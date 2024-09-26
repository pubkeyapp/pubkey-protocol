import { RemoveIdentityOptions } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationRemoveIdentity() {
  const { sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: RemoveIdentityOptions) => sdk.removeIdentity(options).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
