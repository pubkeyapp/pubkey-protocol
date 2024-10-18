import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { PublicKeyString } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationCancelUpdateCommunityAuthority({ community }: { community: PubKeyCommunity }) {
  const { feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: ({ authority }: { authority: PublicKeyString }) =>
      sdk
        .cancelUpdateCommunityAuthority({
          authority,
          feePayer,
          slug: community.slug,
        })
        .then(async (tx) => {
          const signature = await signAndConfirmTransaction(tx)

          return { tx, signature }
        }),
    onError,
    onSuccess: ({ signature }) => onSuccess(signature),
  })
}
