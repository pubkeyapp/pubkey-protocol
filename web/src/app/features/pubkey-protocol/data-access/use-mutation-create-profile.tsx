import { CreateProfileOptions } from '@pubkey-program-library/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProfile } from './pubkey-protocol-provider'

export type PubKeyProfileCreateInput = Omit<CreateProfileOptions, 'authority' | 'feePayer'>

export function useMutationCreateProfile() {
  const { authority, feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProfile()

  return useMutation({
    mutationFn: (options: PubKeyProfileCreateInput) =>
      sdk
        .createProfile({
          ...options,
          avatarUrl: options.avatarUrl || `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${options.username}`,
          authority,
          feePayer,
        })
        .then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
