import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { uiToastLink } from '../../account/account-data-access'
import { useCluster } from '../../cluster/cluster-data-access'
import { getPointerPda, getProfilePda, usePubkeyProfileProgram } from './use-pubkey-profile-program'
import { PubKeyIdentityProvider } from './pubkey-profile.types'

export function usePubkeyProfileProgramAccount({ account }: { account: PublicKey }) {
  const { cluster, getExplorerUrl } = useCluster()
  const { program } = usePubkeyProfileProgram()

  const profileAccountQuery = useQuery({
    queryKey: ['pubkey-profile', 'fetchProfile', { cluster, account }],
    queryFn: () => program.account.profile.fetch(account),
  })

  const pointerAccountQuery = useQuery({
    queryKey: ['pubkey-profile', 'fetchPointer', { cluster, account }],
    queryFn: () => program.account.pointer.fetch(account),
  })

  const updateAvatarUrl = useMutation({
    mutationKey: ['pubkey-profile', 'updateAvatarUrl', { cluster, account }],
    mutationFn: ({
      newAvatarUrl,
      authority,
      username,
      feePayer,
    }: {
      newAvatarUrl: string
      authority: PublicKey
      username: string
      feePayer: Keypair
    }) => {
      return program.methods
        .updateAvatarUrl({ newAvatarUrl, authority })
        .accounts({
          feePayer: feePayer.publicKey,
          profile: getProfilePda(username, program.programId)[0],
        })
        .signers([feePayer])
        .rpc()
    },
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return profileAccountQuery.refetch()
    },
  })

  const addAuthority = useMutation({
    mutationKey: ['pubkey-profile', 'addAuthority', { cluster, account }],
    mutationFn: ({
      newAuthority,
      authority,
      feePayer,
      username,
    }: {
      newAuthority: PublicKey
      authority: PublicKey
      feePayer: Keypair
      username: string
    }) =>
      program.methods
        .addAuthority({ newAuthority })
        .accounts({
          authority,
          feePayer: feePayer.publicKey,
          profile: getProfilePda(username, program.programId)[0],
          systemProgram: SystemProgram.programId,
        })
        .signers([feePayer])
        .rpc(),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return profileAccountQuery.refetch()
    },
  })

  const removeAuthority = useMutation({
    mutationKey: ['pubkey-profile', 'removeAuthority', { cluster, account }],
    mutationFn: ({
      authorityToRemove,
      authority,
      feePayer,
      username,
    }: {
      authorityToRemove: PublicKey
      authority: PublicKey
      feePayer: Keypair
      username: string
    }) =>
      program.methods
        .removeAuthority({ authorityToRemove })
        .accounts({
          authority,
          feePayer: feePayer.publicKey,
          profile: getProfilePda(username, program.programId)[0],
        })
        .signers([feePayer])
        .rpc(),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return profileAccountQuery.refetch()
    },
  })

  const addIdentity = useMutation({
    mutationKey: ['pubkey-profile', 'addIdentity', { cluster, account }],
    mutationFn: ({
      authority,
      feePayer,
      username,
      providerId,
      provider,
      nickname,
    }: {
      authority: PublicKey
      feePayer: Keypair
      username: string
      providerId: string
      provider: PubKeyIdentityProvider
      nickname: string
    }) =>
      program.methods
        .addIdentity({
          nickname,
          provider: PubKeyIdentityProvider.Discord ? { discord: {} } : { solana: {} },
          providerId,
        })
        .accounts({
          authority,
          feePayer: feePayer.publicKey,
          profile: getProfilePda(username, program.programId)[0],
          pointer: getPointerPda({ programId: program.programId, providerId, provider })[0],
          systemProgram: SystemProgram.programId,
        })
        .signers([feePayer])
        .rpc(),
    onSuccess: async (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      await pointerAccountQuery.refetch()
      return profileAccountQuery.refetch()
    },
  })

  const removeIdentity = useMutation({
    mutationKey: ['pubkey-profile', 'removeIdentity', { cluster, account }],
    mutationFn: ({
      authority,
      feePayer,
      username,
      providerId,
      provider,
    }: {
      authority: PublicKey
      feePayer: Keypair
      username: string
      providerId: string
      provider: PubKeyIdentityProvider
    }) =>
      program.methods
        .removeIdentity({ providerId })
        .accounts({
          authority,
          feePayer: feePayer.publicKey,
          profile: getProfilePda(username, program.programId)[0],
          pointer: getPointerPda({ programId: program.programId, providerId, provider })[0],
          systemProgram: SystemProgram.programId,
        })
        .signers([feePayer])
        .rpc(),
    onSuccess: async (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      await pointerAccountQuery.refetch()
      return profileAccountQuery.refetch()
    },
  })

  return {
    profileAccountQuery,
    pointerAccountQuery,
    updateAvatarUrl,
    addAuthority,
    removeAuthority,
    addIdentity,
    removeIdentity,
  }
}
