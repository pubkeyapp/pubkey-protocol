import { AddAuthorityOptions } from '@pubkey-program-library/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProfile } from './pubkey-protocol-provider'

export function useMutationAddAuthority() {
  const { sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProfile()

  return useMutation({
    mutationFn: (options: AddAuthorityOptions) => sdk.addProfileAuthority(options).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
