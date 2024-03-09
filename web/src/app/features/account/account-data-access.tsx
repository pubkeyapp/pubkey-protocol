import { Anchor } from '@mantine/core'
import { NotificationData } from '@mantine/notifications'
import { toastError, toastSuccess } from '@pubkey-ui/core'
import {
  burnChecked,
  closeAccount,
  ExtensionType,
  getExtensionTypes,
  getMint,
  getOrCreateAssociatedTokenAccount,
  getTransferFeeConfig,
  Mint,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  transferCheckedWithFee,
  TransferFeeConfig,
} from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  TransactionSignature,
  VersionedTransaction,
} from '@solana/web3.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useCluster } from '../cluster/cluster-data-access'

export function useQueries({ address, commitment = 'confirmed' }: { address: PublicKey; commitment?: Commitment }) {
  const { connection } = useConnection()
  const wallet = useWallet()

  return {
    burnToken: {
      mutationKey: ['burnToken', { endpoint: connection?.rpcEndpoint, address }],
      mutationFn: async (input: { amount: string; source: string; mint: string; feePayer: Keypair }) => {
        const feePayer = input.feePayer
        const mintPublicKey = new PublicKey(input.mint)
        const sourceTokenAccount = new PublicKey(input.source)

        const { mint, programId } = await getMintWithProgramId(connection, mintPublicKey, commitment)

        return burnChecked(
          connection,
          feePayer,
          sourceTokenAccount,
          mintPublicKey,
          feePayer,
          parseFloat(input.amount) * 10 ** mint.decimals,
          mint.decimals,
          [],
          undefined,
          programId,
        )
      },
    },
    closeAccount: {
      mutationKey: ['closeAccount', { endpoint: connection?.rpcEndpoint, address }],
      mutationFn: async (input: { source: string; mint: string; feePayer: Keypair }) => {
        const feePayer = input.feePayer
        const mintPublicKey = new PublicKey(input.mint)
        const sourceTokenAccount = new PublicKey(input.source)

        const programId = await getProgramId(connection, mintPublicKey, commitment)

        return closeAccount(
          connection,
          feePayer,
          sourceTokenAccount,
          feePayer.publicKey,
          feePayer,
          [],
          undefined,
          programId,
        )
      },
    },
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
    transferToken: {
      mutationKey: ['transferToken', { endpoint: connection?.rpcEndpoint, address }],
      mutationFn: async (input: {
        amount: string
        source: string
        destination: string
        mint: string
        feePayer: Keypair
      }) => {
        const destinationPublicKey = new PublicKey(input.destination)
        const feePayer = input.feePayer
        const feePayerPublicKey = feePayer.publicKey
        const mintPublicKey = new PublicKey(input.mint)
        const sourceTokenAccount = new PublicKey(input.source)

        try {
          // Get the mint account and program ID
          const { mint, programId } = await getMintWithProgramId(connection, mintPublicKey, commitment)

          // Get or create associated token account for destination
          const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            feePayer,
            mintPublicKey,
            destinationPublicKey,
            undefined,
            commitment,
            undefined,
            programId,
          )

          // Get the mint extensions
          const extensions = getExtensionTypes(mint.tlvData)

          // Check if mint has transfer fee
          if (extensions.includes(ExtensionType.TransferFeeConfig)) {
            const epoch = await connection.getEpochInfo(commitment)
            const { feeCharged, transferAmount } = getTransferFeeForMintAmount(mint, epoch.epoch, input.amount)

            return transferCheckedWithFee(
              connection,
              feePayer, // Transaction fee payer
              sourceTokenAccount, // Source Token Account
              mintPublicKey, // Mint Account address
              destinationTokenAccount.address, // Destination Token Account
              feePayerPublicKey, // Owner of Source Account
              transferAmount, // Amount to transfer
              mint.decimals, // Mint Account decimals
              feeCharged, // Transfer fee
              undefined, // Additional signers
              undefined, // Confirmation options
              programId, // Token Extension Program ID
            )
          }

          console.log('This mint does not have a transfer fee')
          console.log({
            amount: input.amount,
            source: new PublicKey(input.source),
            destination: new PublicKey(input.destination),
            destinationTokenAccount: destinationTokenAccount.address,
            mint,
          })

          throw new Error('This mint does not have a transfer fee, I can only transfer tokens with a transfer fee')
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

export function useOnTransactionSuccess({ address }: { address: PublicKey }) {
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

export function useBurnToken({ address }: { address: PublicKey }) {
  const {
    burnToken: { mutationKey, mutationFn },
  } = useQueries({ address })
  const onSuccess = useOnTransactionSuccess({ address })
  return useMutation({
    mutationKey,
    mutationFn,
    onSuccess,
    onError: (error: unknown) => {
      toastError(`Burning token failed! ${error}`)
    },
  })
}

export function useCloseAccount({ address }: { address: PublicKey }) {
  const {
    closeAccount: { mutationKey, mutationFn },
  } = useQueries({ address })
  const onSuccess = useOnTransactionSuccess({ address })
  return useMutation({
    mutationKey,
    mutationFn,
    onSuccess,
    onError: (error: unknown) => {
      toastError(`Closing account failed! ${error}`)
    },
  })
}

export async function getProgramId(
  connection: Connection,
  mintPublicKey: PublicKey,
  commitment: Commitment = 'confirmed',
) {
  return connection.getParsedAccountInfo(mintPublicKey, commitment).then((res) => {
    if (!res.value?.owner) {
      throw new Error(`Mint ${mintPublicKey} not found`)
    }
    return res.value?.owner
  })
}

export function useTransferToken({ address }: { address: PublicKey }) {
  const onSuccess = useOnTransactionSuccess({ address })
  return useMutation({
    ...useQueries({ address }).transferToken,
    onSuccess,
    onError: (error: unknown) => {
      toastError(`Sending transaction failed! ${error}`)
    },
  })
}

function getTransferFeeForMintAmount(mint: Mint, epoch: number, amount: string) {
  const transferFeeConfig: TransferFeeConfig | null = getTransferFeeConfig(mint)

  if (!transferFeeConfig) {
    throw new Error(`This mint has a transfer fee, but no transfer fee config!`)
  }

  const { maximumFee, transferFeeBasisPoints } =
    epoch < transferFeeConfig.newerTransferFee.epoch
      ? transferFeeConfig.olderTransferFee
      : transferFeeConfig.newerTransferFee

  // Transfer amount
  const transferAmount = BigInt(Math.round(parseFloat(amount) * 10 ** mint.decimals))
  // Calculate transfer fee
  const fee = (transferAmount * BigInt(transferFeeBasisPoints)) / BigInt(10_000)
  // Determine fee charged
  const feeCharged = fee > maximumFee ? maximumFee : fee

  return {
    feeCharged,
    transferAmount,
  }
}

export async function getMintWithProgramId(
  connection: Connection,
  mintPublicKey: PublicKey,
  commitment: Commitment = 'confirmed',
) {
  return getProgramId(connection, mintPublicKey, commitment).then(async (programId) => {
    const mint = await getMint(connection, mintPublicKey, commitment, programId)

    return { mint, programId }
  })
}
