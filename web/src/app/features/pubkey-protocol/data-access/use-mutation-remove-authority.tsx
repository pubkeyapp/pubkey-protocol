import { RemoveAuthorityOptions } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProfile } from './pubkey-protocol-provider'

export function useMutationRemoveAuthority() {
  const { sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProfile()

  return useMutation({
    mutationFn: (options: RemoveAuthorityOptions) => sdk.removeAuthority(options).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
