import { UpdateProfileOptions } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationUpdateAvatarUrl() {
  const { sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: UpdateProfileOptions) => sdk.updateProfile(options).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
