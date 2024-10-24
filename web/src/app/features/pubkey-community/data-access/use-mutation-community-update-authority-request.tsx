import { PubKeyCommunity, PublicKeyString } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationCommunityUpdateAuthorityRequest({ community }: { community: PubKeyCommunity }) {
  const { feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: ({ authority, newAuthority }: { authority: PublicKeyString; newAuthority: PublicKeyString }) =>
      sdk
        .communityAuthorityRequest({
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
