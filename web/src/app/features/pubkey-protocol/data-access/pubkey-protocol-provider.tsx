import { PubKeyIdentity, PubKeyIdentityProvider } from '@pubkey-protocol/anchor'
import { PubkeyProtocolSdk } from '@pubkey-protocol/sdk'
import { toastError, UiAlert, UiInfo, UiLoader, UiStack } from '@pubkey-ui/core'
import {
  AccountInfo,
  Cluster as SolanaCluster,
  ParsedAccountData,
  PublicKey,
  VersionedTransaction,
} from '@solana/web3.js'
import { useQueryClient } from '@tanstack/react-query'
import { createContext, ReactNode, useContext } from 'react'
import { Cluster, useCluster } from '../../cluster/cluster-data-access'
import { uiToastLink, useKeypair } from '../../keypair/data-access'
import { SolanaConnectionRenderProps, WalletButton } from '../../solana'
import { usePubkeyProtocolSdk } from './use-pubkey-protocol-sdk'
import { useQueryGetProgramAccount } from './use-query-get-program-account'

export interface PubKeyProfileProviderContext {
  authority: PublicKey
  cluster: Cluster
  feePayer: PublicKey
  getExplorerUrl: (path: string) => string
  getIdentityUrl: (identity: PubKeyIdentity) => string | undefined
  onError: (err: unknown) => void
  onSuccess: (tx: string) => Promise<void>
  program?: AccountInfo<ParsedAccountData> | null
  sdk: PubkeyProtocolSdk
  signAndConfirmTransaction: (tx: VersionedTransaction) => Promise<string>
}

const Context = createContext<PubKeyProfileProviderContext>({} as PubKeyProfileProviderContext)

export function PubkeyProtocolProvider({
  children,
  connection,
  publicKey,
  signTransaction,
  wallet,
}: {
  children: ReactNode
} & SolanaConnectionRenderProps) {
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

  async function signAndConfirmTransaction(tx: VersionedTransaction) {
    if (!signTransaction) {
      toastError('Wallet not connected')
      throw new Error('Wallet not connected')
    }
    const userSignedTx = await signTransaction(tx)
    const feePayerSignedTx = await feePayerSign(userSignedTx)

    return sendAndConfirmTransaction({ transaction: feePayerSignedTx })
  }

  function getIdentityUrl(identity: PubKeyIdentity) {
    switch (identity.provider) {
      case PubKeyIdentityProvider.Discord:
        return `https://discord.com/users/${identity.providerId}`
      case PubKeyIdentityProvider.Github:
        return `https://github.com/${identity.name}`
      case PubKeyIdentityProvider.Solana:
        return getExplorerUrl(`address/${identity.providerId}`)
      case PubKeyIdentityProvider.X:
        return `https://x.com/${identity.name}`
      default:
        return undefined
    }
  }

  const value: PubKeyProfileProviderContext = {
    authority: publicKey ?? PublicKey.unique(),
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

  return publicKey ? (
    programAccountQuery.isLoading ? (
      <UiLoader />
    ) : value.program ? (
      <Context.Provider value={value}>{children}</Context.Provider>
    ) : (
      <UiAlert
        message={
          <span>
            Program account not found. Make sure you have deployed the program and are on the correct cluster.
          </span>
        }
      />
    )
  ) : (
    <UiStack align="center">
      <UiInfo message="Connect your wallet to continue" />
      <WalletButton />
    </UiStack>
  )
}

export function usePubKeyProtocol() {
  return useContext(Context)
}
