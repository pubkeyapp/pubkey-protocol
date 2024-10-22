import { ProfileUpdateDetailsOptions, PublicKeyString } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationUpdateAvatarUrl({ community }: { community: PublicKeyString }) {
  const { authority, feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: Omit<ProfileUpdateDetailsOptions, 'authority' | 'community' | 'feePayer'>) =>
      sdk
        .profileUpdateDetails({ ...options, authority, feePayer, community })
        .then((x) => signAndConfirmTransaction(x, { withFeePayer: false })),
    onError,
    onSuccess,
  })
}
