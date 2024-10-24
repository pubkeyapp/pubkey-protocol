import { ProfileIdentityAddOptions, PublicKeyString } from '@pubkey-protocol/sdk'
import { useMutation } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export type PubKeyAddIdentity = Omit<ProfileIdentityAddOptions, 'authority' | 'community' | 'feePayer'>

export function useMutationProfileIdentityAdd({ community }: { community: PublicKeyString }) {
  const { authority, feePayer, sdk, signAndConfirmTransaction, onError, onSuccess } = usePubKeyProtocol()

  return useMutation({
    mutationFn: (options: PubKeyAddIdentity) =>
      sdk.profileIdentityAdd({ ...options, authority, community, feePayer }).then(signAndConfirmTransaction),
    onError,
    onSuccess,
  })
}
