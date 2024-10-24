import { CommunityCreateOptions } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export type PubKeyCommunityCreateInput = Omit<CommunityCreateOptions, 'authority' | 'communityAuthority' | 'feePayer'>

export function useMutationCommunityCreate() {
  const { authority, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: PubKeyCommunityCreateInput) => {
      console.log('options', options)
      return sdk
        .communityCreate({
          ...options,
          authority,
          communityAuthority: authority,
        })
        .then(async ({ input, tx }) => {
          const signature = await signAndConfirmTransaction(tx, { withFeePayer: false })

          return { input, tx, signature }
        })
    },
    onError,
    onSuccess: ({ signature }) => {
      return onSuccess(signature)
    },
  })
}
