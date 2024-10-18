import { CreateCommunityOptions } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export type PubKeyCommunityCreateInput = Omit<CreateCommunityOptions, 'authority' | 'feePayer'>

export function useMutationCreateCommunity() {
  const { authority, feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: PubKeyCommunityCreateInput) =>
      sdk
        .createCommunity({
          ...options,
          authority,
          feePayer,
        })
        .then(async ({ input, tx }) => {
          const signature = await signAndConfirmTransaction(tx)

          return { input, tx, signature }
        }),
    onError,
    onSuccess: ({ signature }) => {
      return onSuccess(signature)
    },
  })
}
