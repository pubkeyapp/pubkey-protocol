import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from './pubkey-protocol-provider'

export function useMutationConfigInit() {
  const { authority, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()
  return useMutation({
    mutationFn: () =>
      sdk.configInit({ authority, communityAuthority: authority }).then(async ({ tx }) => {
        const signature = await signAndConfirmTransaction(tx, { withFeePayer: false })

        return { tx, signature }
      }),
    onError,
    onSuccess: ({ signature }) => {
      return onSuccess(signature)
    },
  })
}
