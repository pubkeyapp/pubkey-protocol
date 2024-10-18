import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { PublicKeyString } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationInitiateUpdateCommunityAuthority({ community }: { community: PubKeyCommunity }) {
  const { feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: ({ authority, newAuthority }: { authority: PublicKeyString; newAuthority: PublicKeyString }) =>
      sdk
        .initiateUpdateCommunityAuthority({
          slug: community.slug,
          newAuthority,
          authority,
          feePayer,
        })
        .then(async (tx) => {
          const signature = await signAndConfirmTransaction(tx)

          return { tx, signature }
        }),
    onError,
    onSuccess: ({ signature }) => onSuccess(signature),
  })
}
