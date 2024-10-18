import { ProfileCreateOptions } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export type PubKeyProfileCreateInput = Omit<ProfileCreateOptions, 'authority' | 'feePayer'>

export function useMutationProfileCreate() {
  const { authority, feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: PubKeyProfileCreateInput) =>
      sdk
        .profileCreate({
          ...options,
          authority,
          feePayer,
        })
        .then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
