import { RemoveIdentityOptions } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProfile } from './pubkey-protocol-provider'

export function useMutationRemoveIdentity() {
  const { sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProfile()

  return useMutation({
    mutationFn: (options: RemoveIdentityOptions) => sdk.removeIdentity(options).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
