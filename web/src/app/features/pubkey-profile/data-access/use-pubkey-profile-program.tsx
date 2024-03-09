import { Program } from '@coral-xyz/anchor'
import { getPubkeyProfileProgramId, PubkeyProfileIDL } from '@pubkey-ui-starter/anchor'
import { toastError } from '@pubkey-ui/core'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { uiToastLink } from '../../account/account-data-access'
import { useCluster } from '../../cluster/cluster-data-access'
import { useAnchorProvider } from '../../solana/solana-provider'

export function usePubkeyProfileProgram() {
  const { connection } = useConnection()
  const { cluster, getExplorerUrl } = useCluster()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getPubkeyProfileProgramId(cluster.network as Cluster), [cluster])
  const program = new Program(PubkeyProfileIDL, programId, provider)

  const accounts = useQuery({
    queryKey: ['pubkey-profile', 'all', { cluster }],
    queryFn: () => program.account.pubkeyProfile.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
    retry: false,
  })

  const initialize = useMutation({
    mutationKey: ['pubkey-profile', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ pubkeyProfile: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${signature}`) })
      return accounts.refetch()
    },
    onError: () => toastError('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}
