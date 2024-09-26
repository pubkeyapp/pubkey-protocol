import { AddIdentityOptions } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProfile } from './pubkey-protocol-provider'

export type PubKeyAddIdentity = Omit<AddIdentityOptions, 'authority' | 'feePayer'>

export function useMutationAddIdentity() {
  const { authority, feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProfile()

  return useMutation({
    mutationFn: (options: PubKeyAddIdentity) =>
      sdk.addIdentity({ ...options, authority, feePayer }).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
