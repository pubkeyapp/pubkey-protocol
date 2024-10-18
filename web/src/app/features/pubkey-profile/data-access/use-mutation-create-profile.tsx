import { CreateProfileOptions } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export type PubKeyProfileCreateInput = Omit<CreateProfileOptions, 'authority' | 'feePayer'>

export function useMutationCreateProfile() {
  const { authority, feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: PubKeyProfileCreateInput) =>
      sdk
        .createProfile({
          ...options,
          authority,
          feePayer,
        })
        .then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
