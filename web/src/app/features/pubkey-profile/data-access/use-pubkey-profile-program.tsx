import { CreateProfileOptions } from '@pubkey-program-library/sdk'
import { toastError } from '@pubkey-ui/core'
import { useMutation, useQuery } from '@tanstack/react-query'
import { uiToastLink } from '../../account/account-data-access'
import { usePubkeyProfileSdk } from './use-pubkey-profile-sdk'

export function usePubkeyProfileProgram() {
  const { cluster, getExplorerUrl, sdk } = usePubkeyProfileSdk()

  const profileAccounts = useQuery({
    queryKey: ['pubkey-profile', 'profile', { cluster }],
    queryFn: () => sdk.getProfiles(),
  })

  const pointerAccounts = useQuery({
    queryKey: ['pubkey-profile', 'pointer', { cluster }],
    queryFn: () => sdk.getPointers(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => sdk.getProgramAccount(),
    retry: false,
  })

  const createProfile = useMutation({
    mutationKey: ['pubkey-profile', 'createProfile', { cluster }],
    mutationFn: (options: CreateProfileOptions) => sdk.createProfile(options),
    onSuccess: (signature) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${signature}`) })
      return profileAccounts.refetch()
    },
    onError: () => toastError('Failed to create profile'),
  })

  return {
    createProfile,
    getProgramAccount,
    pointerAccounts,
    profileAccounts,
  }
}
