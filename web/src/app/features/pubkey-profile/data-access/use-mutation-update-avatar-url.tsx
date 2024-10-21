import { ProfileUpdateDetailsOptions } from '@pubkey-protocol/sdk'
import { PublicKey } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationUpdateAvatarUrl({ community }: { community: PublicKey }) {
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
