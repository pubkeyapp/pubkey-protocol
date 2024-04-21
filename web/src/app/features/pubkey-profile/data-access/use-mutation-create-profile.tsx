import { CreateProfileOptions } from '@pubkey-program-library/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProfile } from './pubkey-profile-provider'

export type PubKeyProfileCreateInput = Omit<CreateProfileOptions, 'authority' | 'feePayer'>

export function useMutationCreateProfile() {
  const { authority, feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProfile()

  return useMutation({
    mutationFn: (options: PubKeyProfileCreateInput) =>
      sdk.createProfile({ ...options, authority, feePayer }).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
