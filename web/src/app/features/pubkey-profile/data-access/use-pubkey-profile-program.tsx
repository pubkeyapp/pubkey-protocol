import { Program } from '@coral-xyz/anchor'
import {
  getPubKeyPointerPda,
  getPubKeyProfilePda,
  getPubkeyProfileProgramId,
  PubKeyIdentityProvider,
  PubkeyProfileIDL,
} from '@pubkey-program-library/anchor'
import { toastError } from '@pubkey-ui/core'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, SystemProgram } from '@solana/web3.js'
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

  const profileAccounts = useQuery({
    queryKey: ['pubkey-profile', 'profile', { cluster }],
    queryFn: () => program.account.profile.all(),
  })

  const pointerAccounts = useQuery({
    queryKey: ['pubkey-profile', 'pointer', { cluster }],
    queryFn: () => program.account.pointer.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
    retry: false,
  })

  const createProfile = useMutation({
    mutationKey: ['pubkey-profile', 'createProfile', { cluster }],
    mutationFn: ({ feePayer, avatarUrl, username }: { feePayer: Keypair; avatarUrl: string; username: string }) => {
      return program.methods
        .createProfile({ avatarUrl, username })
        .accounts({
          feePayer: feePayer.publicKey,
          authority: provider.wallet.publicKey,
          profile: getPubKeyProfilePda({ username, programId })[0],
          pointer: getPubKeyPointerPda({
            programId,
            provider: PubKeyIdentityProvider.Solana,
            providerId: provider.wallet.publicKey.toString(),
          })[0],
          systemProgram: SystemProgram.programId,
        })
        .signers([feePayer])
        .rpc()
    },
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
    program,
    programId,
  }
}
