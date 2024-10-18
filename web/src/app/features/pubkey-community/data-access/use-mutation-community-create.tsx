import { CommunityCreateOptions } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export type PubKeyCommunityCreateInput = Omit<CommunityCreateOptions, 'authority' | 'feePayer'>

export function useMutationCommunityCreate() {
  const { authority, feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: PubKeyCommunityCreateInput) =>
      sdk
        .communityCreate({
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
