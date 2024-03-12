import {
  AddAuthorityOptions,
  AddIdentityOptions,
  RemoveAuthorityOptions,
  RemoveIdentityOptions,
  UpdateAvatarUrlOptions,
} from '@pubkey-program-library/sdk'
import { PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { uiToastLink } from '../../account/account-data-access'
import { usePubkeyProfileSdk } from './use-pubkey-profile-sdk'

export function usePubkeyProfileProgramAccount({ account }: { account: PublicKey }) {
  const { sdk, cluster, getExplorerUrl } = usePubkeyProfileSdk()

  const profileAccountQuery = useQuery({
    queryKey: ['pubkey-profile', 'fetchProfile', { cluster, account }],
    queryFn: () => sdk.getProfile({ account }),
  })

  const pointerAccountQuery = useQuery({
    queryKey: ['pubkey-profile', 'fetchPointer', { cluster, account }],
    queryFn: () => sdk.getPointer({ account }),
  })

  const updateAvatarUrl = useMutation({
    mutationKey: ['pubkey-profile', 'updateAvatarUrl', { cluster, account }],
    mutationFn: (options: UpdateAvatarUrlOptions) => sdk.updateAvatarUrl(options),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return profileAccountQuery.refetch()
    },
  })

  const addAuthority = useMutation({
    mutationKey: ['pubkey-profile', 'addAuthority', { cluster, account }],
    mutationFn: (options: AddAuthorityOptions) => sdk.addAuthority(options),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return profileAccountQuery.refetch()
    },
  })

  const removeAuthority = useMutation({
    mutationKey: ['pubkey-profile', 'removeAuthority', { cluster, account }],
    mutationFn: (options: RemoveAuthorityOptions) => sdk.removeAuthority(options),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return profileAccountQuery.refetch()
    },
  })

  const addIdentity = useMutation({
    mutationKey: ['pubkey-profile', 'addIdentity', { cluster, account }],
    mutationFn: (options: AddIdentityOptions) => sdk.addIdentity(options),
    onSuccess: (tx) =>
      Promise.all([pointerAccountQuery.refetch(), profileAccountQuery.refetch()]).then(() =>
        uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) }),
      ),
  })

  const removeIdentity = useMutation({
    mutationKey: ['pubkey-profile', 'removeIdentity', { cluster, account }],
    mutationFn: (options: RemoveIdentityOptions) => sdk.removeIdentity(options),
    onSuccess: (tx) =>
      Promise.all([pointerAccountQuery.refetch(), profileAccountQuery.refetch()]).then(() =>
        uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) }),
      ),
  })

  return {
    profileAccountQuery,
    pointerAccountQuery,
    updateAvatarUrl,
    addAuthority,
    removeAuthority,
    addIdentity,
    removeIdentity,
    authorities: profileAccountQuery.data?.authorities,
    username: profileAccountQuery.data?.username,
  }
}
