import { ProfileCreateOptions, PublicKeyString } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export type PubKeyProfileCreateInput = Omit<ProfileCreateOptions, 'authority' | 'community' | 'feePayer'>

export function useMutationProfileCreate({ community }: { community: PublicKeyString }) {
  const { authority, feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: PubKeyProfileCreateInput) =>
      sdk
        .profileCreate({
          ...options,
          community,
          authority,
          feePayer,
        })
        .then(({ tx }) => signAndConfirmTransaction(tx)),
    onError,
    onSuccess,
  })
}
