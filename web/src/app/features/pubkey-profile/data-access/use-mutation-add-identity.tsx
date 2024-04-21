import { AddIdentityOptions } from '@pubkey-program-library/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProfile } from './pubkey-profile-provider'

export function useMutationAddIdentity() {
  const { sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProfile()

  return useMutation({
    mutationFn: (options: AddIdentityOptions) => sdk.addIdentity(options).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
