import { PubKeyCommunity, PublicKeyString } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationCommunityUpdateAuthorityApprove({ community }: { community: PubKeyCommunity }) {
  const { feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: ({ newAuthority }: { newAuthority: PublicKeyString }) =>
      sdk
        .communityUpdateAuthorityApprove({
          feePayer,
          newAuthority,
          slug: community.slug,
        })
        .then(async (tx) => {
          const signature = await signAndConfirmTransaction(tx)

          return { tx, signature }
        }),
    onError,
    onSuccess: ({ signature }) => {
      return onSuccess(signature)
    },
  })
}
