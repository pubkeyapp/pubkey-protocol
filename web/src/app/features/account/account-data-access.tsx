import { toastError, toastSuccess } from '@pubkey-ui/core'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  TransactionSignature,
  VersionedTransaction,
} from '@solana/web3.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useCluster } from '../cluster/cluster-data-access'
import { NotificationData } from '@mantine/notifications'
import { Anchor } from '@mantine/core'

export function useQueries({ address }: { address: PublicKey }) {
  const { connection } = useConnection()
  const wallet = useWallet()

  return {
    getBalance: {
      queryKey: ['getBalance', { endpoint: connection?.rpcEndpoint, address }],
      queryFn: () => connection.getBalance(address),
    },
    getSignatures: {
      queryKey: ['getSignatures', { endpoint: connection?.rpcEndpoint, address }],
      queryFn: () => connection.getConfirmedSignaturesForAddress2(address),
    },
    getTokenAccounts: {
      queryKey: ['getTokenAccounts', { endpoint: connection?.rpcEndpoint, address }],
      queryFn: () => getAllTokenAccounts(connection, address),
    },
    getTokenBalance: {
      queryKey: ['getTokenBalance', { endpoint: connection?.rpcEndpoint, account: address }],
      queryFn: () => connection.getTokenAccountBalance(address),
    },
    requestAirdrop: {
      mutationKey: ['requestAirdrop', { endpoint: connection?.rpcEndpoint, address }],
      mutationFn: (amount: string) => requestAndConfirmAirdrop({ address, amount, connection }),
    },
    transferSol: {
      mutationKey: ['transferSol', { endpoint: connection?.rpcEndpoint, address }],
      mutationFn: async ({ amount, destination }: { amount: string; destination: PublicKey }) => {
        try {
          const { transaction, latestBlockhash } = await createTransaction({
            amount,
            connection,
            destination,
            publicKey: address,
          })

          // Send transaction and await for signature
          const signature: TransactionSignature = await wallet.sendTransaction(transaction, connection)

          // Send transaction and await for signature
          await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed')

          return signature
        } catch (error: unknown) {
          console.log('error', `Transaction failed! ${error}`)
          return
        }
      },
    },
  }
}

export function useGetBalance({ address }: { address: PublicKey }) {
  return useQuery(useQueries({ address }).getBalance)
}
export function useGetSignatures({ address }: { address: PublicKey }) {
  return useQuery(useQueries({ address }).getSignatures)
}
export function useGetTokenAccounts({ address }: { address: PublicKey }) {
  return useQuery(useQueries({ address }).getTokenAccounts)
}
export function useGetTokenBalance({ address }: { address: PublicKey }) {
  return useQuery(useQueries({ address }).getTokenBalance)
}
export function useRequestAirdrop({ address }: { address: PublicKey }) {
  const {
    requestAirdrop: { mutationKey, mutationFn },
  } = useQueries({ address })
  const onSuccess = useOnTransactionSuccess({ address })
  return useMutation({
    mutationKey,
    mutationFn,
    onSuccess,
    onError: (error: unknown) => {
      toastError(`Requesting airdrop failed! ${error}`)
    },
  })
}
export function useTransferSol({ address }: { address: PublicKey }) {
  const onSuccess = useOnTransactionSuccess({ address })
  return useMutation({
    ...useQueries({ address }).transferSol,
    onSuccess,
    onError: (error: unknown) => {
      toastError(`Sending transaction failed! ${error}`)
    },
  })
}

async function getAllTokenAccounts(connection: Connection, address: PublicKey) {
  const [tokenAccounts, token2022Accounts] = await Promise.all([
    connection.getParsedTokenAccountsByOwner(address, { programId: TOKEN_PROGRAM_ID }),
    connection.getParsedTokenAccountsByOwner(address, { programId: TOKEN_2022_PROGRAM_ID }),
  ])
  return [...tokenAccounts.value, ...token2022Accounts.value]
}

async function requestAndConfirmAirdrop({
  address,
  amount,
  connection,
}: {
  connection: Connection
  address: PublicKey
  amount: string
}) {
  const [latestBlockhash, signature] = await Promise.all([
    connection.getLatestBlockhash(),
    connection.requestAirdrop(address, parseFloat(amount) * LAMPORTS_PER_SOL),
  ])

  await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed')
  return signature
}

function useOnTransactionSuccess({ address }: { address: PublicKey }) {
  const { getExplorerUrl } = useCluster()
  const client = useQueryClient()
  const { getBalance, getSignatures } = useQueries({ address })

  return (signature?: TransactionSignature) => {
    if (signature) {
      uiToastLink({ link: getExplorerUrl(`tx/${signature}`), label: 'View Transaction' })
    }
    return Promise.all([
      client.invalidateQueries({ queryKey: getBalance.queryKey }),
      client.invalidateQueries({ queryKey: getSignatures.queryKey }),
    ])
  }
}

export function uiToastLink({
  label,
  link,
  ...props
}: Omit<NotificationData, 'message'> & { link: string; label: string }) {
  return toastSuccess({
    ...props,
    message: (
      <Anchor c="brand" href={link} target="_blank" rel="noopener noreferrer">
        {label}
      </Anchor>
    ),
  })
}

export async function createTransaction({
  publicKey,
  destination,
  amount,
  connection,
}: {
  publicKey: PublicKey
  destination: PublicKey
  amount: string
  connection: Connection
}): Promise<{
  transaction: VersionedTransaction
  latestBlockhash: { blockhash: string; lastValidBlockHeight: number }
}> {
  // Get the latest blockhash to use in our transaction
  const latestBlockhash = await connection.getLatestBlockhash()

  // Create instructions to send, in this case a simple transfer
  const instructions = [
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: destination,
      lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
    }),
  ]

  // Create a new TransactionMessage with version and compile it to legacy
  const messageLegacy = new TransactionMessage({
    payerKey: publicKey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions,
  }).compileToLegacyMessage()

  // Create a new VersionedTransaction which supports legacy and v0
  const transaction = new VersionedTransaction(messageLegacy)

  return {
    transaction,
    latestBlockhash,
  }
}
