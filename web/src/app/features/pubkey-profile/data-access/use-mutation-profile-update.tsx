import { ProfileUpdateOptions, PublicKeyString } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export type PubKeyProfileUpdateInput = Omit<ProfileUpdateOptions, 'authority' | 'community' | 'feePayer'>

export function useMutationProfileUpdate({ community }: { community: PublicKeyString }) {
  const { authority, feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: PubKeyProfileUpdateInput) =>
      sdk
        .profileUpdate({ ...options, authority, feePayer, community })
        .then((x) => signAndConfirmTransaction(x, { withFeePayer: true })),
    onError,
    onSuccess,
  })
}
