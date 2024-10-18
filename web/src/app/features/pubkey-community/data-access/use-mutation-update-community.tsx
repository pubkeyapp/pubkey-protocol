import { UpdateCommunityOptions } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export type PubKeyCommunityUpdateInput = Omit<UpdateCommunityOptions, 'authority' | 'feePayer'>

export function useMutationUpdateCommunity() {
  const { authority, feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: PubKeyCommunityUpdateInput) =>
      sdk
        .updateCommunity({
          ...options,
          authority,
          feePayer,
        })
        .then(async ({ input, tx }) => {
          const signature = await signAndConfirmTransaction(tx)

          return { input, tx, signature }
        }),
    onError,
    onSuccess: ({ signature }) => onSuccess(signature),
  })
}
