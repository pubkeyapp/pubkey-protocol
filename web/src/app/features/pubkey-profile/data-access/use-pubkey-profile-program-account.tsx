import { PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { uiToastLink } from '../../account/account-data-access'
import { useCluster } from '../../cluster/cluster-data-access'
import { usePubkeyProfileProgram } from './use-pubkey-profile-program'

export function usePubkeyProfileProgramAccount({ account }: { account: PublicKey }) {
  const { cluster, getExplorerUrl } = useCluster()
  const { program, accounts } = usePubkeyProfileProgram()

  const accountQuery = useQuery({
    queryKey: ['pubkey-profile', 'fetch', { cluster, account }],
    queryFn: () => program.account.pubkeyProfile.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['pubkey-profile', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ pubkeyProfile: account }).rpc(),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['pubkey-profile', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ pubkeyProfile: account }).rpc(),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['pubkey-profile', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ pubkeyProfile: account }).rpc(),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['pubkey-profile', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ pubkeyProfile: account }).rpc(),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
