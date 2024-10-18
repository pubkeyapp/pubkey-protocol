import { AddAuthorityOptions } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationProfileAuthorityAdd() {
  const { sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: AddAuthorityOptions) => sdk.profileAuthorityAdd(options).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
