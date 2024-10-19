import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { PublicKeyString } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationCommunitySignerRemove({ community }: { community: PubKeyCommunity }) {
  const { authority, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: ({ signer }: { signer: PublicKeyString }) =>
      sdk
        .communitySignerRemove({
          slug: community.slug,
          signer,
          authority,
          feePayer: authority,
        })
        .then(async ({ tx }) => {
          const signature = await signAndConfirmTransaction(tx, { withFeePayer: false })

          return { tx, signature }
        }),
    onError,
    onSuccess: ({ signature }) => onSuccess(signature),
  })
}
