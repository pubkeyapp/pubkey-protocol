import { ProfileDeleteOptions, PublicKeyString } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export type PubKeyProfileDeleteInput = Omit<ProfileDeleteOptions, 'authority' | 'community' | 'feePayer'>

export function useMutationProfileDelete({ community }: { community: PublicKeyString }) {
  const { authority, feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: PubKeyProfileDeleteInput) =>
      sdk
        .profileDelete({
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
