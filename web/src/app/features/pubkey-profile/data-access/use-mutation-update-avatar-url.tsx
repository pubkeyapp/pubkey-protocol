import { UpdateAvatarUrlOptions } from '@pubkey-program-library/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProfile } from './pubkey-profile-provider'

export function useMutationUpdateAvatarUrl() {
  const { sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProfile()

  return useMutation({
    mutationFn: (options: UpdateAvatarUrlOptions) => sdk.updateProfileDetails(options).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
