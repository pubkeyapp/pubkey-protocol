import {
  AddAuthorityOptions,
  AddIdentityOptions,
  RemoveAuthorityOptions,
  RemoveIdentityOptions,
  UpdateAvatarUrlOptions,
} from '@pubkey-program-library/sdk'
import { toastError } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { uiToastLink } from '../../account/account-data-access'
import { usePubkeyProfileSdk } from './use-pubkey-profile-sdk'

export function usePubkeyProfileProgramAccount({ profilePda }: { profilePda: PublicKey }) {
  const { sdk, cluster, getExplorerUrl } = usePubkeyProfileSdk()

  const profileAccountQuery = useQuery({
    queryKey: ['pubkey-profile', 'fetchProfile', { cluster, profilePda }],
    queryFn: () => sdk.getProfile({ profilePda }),
  })

  // const pointerAccountQuery = useQuery({
  //   queryKey: ['pubkey-profile', 'fetchPointer', { cluster, profilePda] }],
  //   queryFn: () => sdk.getPointer({ pointerPda: account }),
  // })

  const updateAvatarUrl = useMutation({
    mutationKey: ['pubkey-profile', 'updateAvatarUrl', { cluster, profilePda }],
    mutationFn: (options: UpdateAvatarUrlOptions) => sdk.updateAvatarUrl(options),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return profileAccountQuery.refetch()
    },
  })

  const addAuthority = useMutation({
    mutationKey: ['pubkey-profile', 'addAuthority', { cluster, profilePda }],
    mutationFn: (options: AddAuthorityOptions) => sdk.addAuthority(options),
    onError: (err) => toastError(`Error: ${err}`),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return profileAccountQuery.refetch()
    },
  })

  const removeAuthority = useMutation({
    mutationKey: ['pubkey-profile', 'removeAuthority', { cluster, profilePda }],
    mutationFn: (options: RemoveAuthorityOptions) => sdk.removeAuthority(options),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return profileAccountQuery.refetch()
    },
  })

  const addIdentity = useMutation({
    mutationKey: ['pubkey-profile', 'addIdentity', { cluster, profilePda }],
    mutationFn: (options: AddIdentityOptions) => sdk.addIdentity(options),
    onSuccess: (tx) =>
      Promise.all([
        //pointerAccountQuery.refetch(),
        profileAccountQuery.refetch(),
      ]).then(() => uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })),
  })

  const removeIdentity = useMutation({
    mutationKey: ['pubkey-profile', 'removeIdentity', { cluster, profilePda }],
    mutationFn: (options: RemoveIdentityOptions) => sdk.removeIdentity(options),
    onSuccess: (tx) =>
      Promise.all([
        //pointerAccountQuery.refetch(),
        profileAccountQuery.refetch(),
      ]).then(() => uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })),
  })

  return {
    profileAccountQuery,
    // pointerAccountQuery,
    updateAvatarUrl,
    addAuthority,
    removeAuthority,
    addIdentity,
    removeIdentity,
    authorities: profileAccountQuery.data?.authorities,
    username: profileAccountQuery.data?.username,
  }
}
