import { PubKeyIdentity } from '@pubkey-protocol/anchor'
import { IdentityProvider, PubKeyProtocolSdk, PublicKeyString } from '@pubkey-protocol/sdk'
import { toastError, UiAlert, UiLoader } from '@pubkey-ui/core'
import {
  AccountInfo,
  Cluster as SolanaCluster,
  Connection,
  ParsedAccountData,
  VersionedTransaction,
} from '@solana/web3.js'
import { useQueryClient } from '@tanstack/react-query'
import { createContext, ReactNode, useContext } from 'react'
import { Cluster, useCluster } from '../../cluster/cluster-data-access'
import { uiToastLink, useKeypair } from '../../keypair/data-access'
import { SolanaConnectionRenderProps } from '../../solana'
import { usePubkeyProtocolSdk } from './use-pubkey-protocol-sdk'
import { useQueryGetProgramAccount } from './use-query-get-program-account'

export interface PubKeyProfileProviderContext {
  authority: PublicKeyString
  cluster: Cluster
  feePayer: PublicKeyString
  getExplorerUrl: (path: string) => string
  getIdentityUrl: (identity: PubKeyIdentity) => string | undefined
  onError: (err: unknown) => void
  onSuccess: (tx: string) => Promise<void>
  program?: AccountInfo<ParsedAccountData> | null
  sdk: PubKeyProtocolSdk
  signAndConfirmTransaction: (tx: VersionedTransaction, options?: { withFeePayer: boolean }) => Promise<string>
}

const Context = createContext<PubKeyProfileProviderContext>({} as PubKeyProfileProviderContext)

export function PubKeyProtocolProvider({
  children,
  connection,
  publicKey,
  signTransaction,
  wallet,
}: {
  children: ReactNode
} & Omit<SolanaConnectionRenderProps, 'connection' | 'publicKey'> & {
    connection: Connection
    publicKey: PublicKeyString
  }) {
  const client = useQueryClient()
  const { cluster, getExplorerUrl } = useCluster()
  const { feePayer, feePayerSign } = useKeypair()
  const sdk = usePubkeyProtocolSdk({
    connection,
    network: cluster.network as SolanaCluster,
    wallet,
  })
  const programAccountQuery = useQueryGetProgramAccount({ cluster, sdk })

  async function onSuccess(tx: string) {
    await Promise.all([
      client.invalidateQueries({ queryKey: ['pubkey-protocol', 'getProfiles'] }),
      client.invalidateQueries({ queryKey: ['pubkey-protocol', 'getProfileByUsername'] }),
    ])
    uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
  }

  async function sendAndConfirmTransaction({ transaction }: { transaction: VersionedTransaction }): Promise<string> {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
    const signature = await connection.sendTransaction(transaction, { skipPreflight: true })
    console.log(`Sent: ${signature}`)
    await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature }, 'confirmed')
    console.log(`Confirmed: ${getExplorerUrl(`tx/${signature}`)}`)
    return signature
  }

  async function signAndConfirmTransaction(
    tx: VersionedTransaction,
    options: { withFeePayer: boolean } = {
      withFeePayer: true,
    },
  ) {
    if (!signTransaction) {
      toastError('Wallet not connected')
      throw new Error('Wallet not connected')
    }
    const userSignedTx = await signTransaction(tx)

    if (!options.withFeePayer) {
      return sendAndConfirmTransaction({ transaction: userSignedTx })
    }
    const feePayerSignedTx = await feePayerSign(userSignedTx)

    return sendAndConfirmTransaction({ transaction: feePayerSignedTx })
  }

  function getIdentityUrl(identity: PubKeyIdentity) {
    switch (identity.provider) {
      case IdentityProvider.Discord:
        return `https://discord.com/users/${identity.providerId}`
      case IdentityProvider.Farcaster:
        return `https://warpcast.com/${identity.name}`
      case IdentityProvider.Github:
        return `https://github.com/${identity.name}`
      case IdentityProvider.Solana:
        return getExplorerUrl(`address/${identity.providerId}`)
      case IdentityProvider.Telegram:
        return `https://t.me/${identity.name}`
      case IdentityProvider.X:
        return `https://x.com/${identity.name}`
      default:
        return undefined
    }
  }

  const value: PubKeyProfileProviderContext = {
    authority: publicKey,
    cluster,
    feePayer,
    getExplorerUrl,
    getIdentityUrl,
    onError: (err: unknown) => toastError(`Error: ${err}`),
    onSuccess,
    program: programAccountQuery.data,
    sdk,
    signAndConfirmTransaction,
  }

  return programAccountQuery.isLoading ? (
    <UiLoader />
  ) : value.program ? (
    <Context.Provider value={value}>{children}</Context.Provider>
  ) : (
    <UiAlert
      message={
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      }
    />
  )
}

export function usePubKeyProtocol() {
  return useContext(Context)
}
