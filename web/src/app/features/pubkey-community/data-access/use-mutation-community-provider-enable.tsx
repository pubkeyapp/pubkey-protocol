import { IdentityProvider, PubKeyCommunity, PublicKeyString } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useMutationCommunityProviderEnable({ community }: { community: PubKeyCommunity }) {
  const { feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: ({ authority, provider }: { authority: PublicKeyString; provider: IdentityProvider }) =>
      sdk
        .communityProviderEnable({
          slug: community.slug,
          provider,
          authority,
          feePayer,
        })
        .then(async ({ tx }) => {
          const signature = await signAndConfirmTransaction(tx)

          return { tx, signature }
        }),
    onError,
    onSuccess: ({ signature }) => onSuccess(signature),
  })
}
