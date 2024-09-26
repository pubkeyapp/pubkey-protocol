import { AddAuthorityOptions } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationAddAuthority() {
  const { sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: AddAuthorityOptions) => sdk.addProfileAuthority(options).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
