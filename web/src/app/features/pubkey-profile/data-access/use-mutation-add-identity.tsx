import { AddIdentityOptions } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export type PubKeyAddIdentity = Omit<AddIdentityOptions, 'authority' | 'feePayer'>

export function useMutationAddIdentity() {
  const { authority, feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: PubKeyAddIdentity) =>
      sdk.addIdentity({ ...options, authority, feePayer }).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
