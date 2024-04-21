import { Anchor } from '@mantine/core'
import { NotificationData } from '@mantine/notifications'
import { toastError, toastSuccess } from '@pubkey-ui/core'
import { useConnection } from '@solana/wallet-adapter-react'
import { Commitment, Connection, LAMPORTS_PER_SOL, PublicKey, TransactionSignature } from '@solana/web3.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useCluster } from '../../../cluster/cluster-data-access'

export function useQueries({ address }: { address: PublicKey; commitment?: Commitment }) {
  const { connection } = useConnection()

  return {
    getBalance: {
      queryKey: ['getBalance', { endpoint: connection?.rpcEndpoint, address }],
      queryFn: () => connection.getBalance(address),
    },
    getSignatures: {
      queryKey: ['getSignatures', { endpoint: connection?.rpcEndpoint, address }],
      queryFn: () => connection.getConfirmedSignaturesForAddress2(address),
    },
    requestAirdrop: {
      mutationKey: ['requestAirdrop', { endpoint: connection?.rpcEndpoint, address }],
      mutationFn: (amount: string) => requestAndConfirmAirdrop({ address, amount, connection }),
    },
  }
}

export function useGetBalance({ address }: { address: PublicKey }) {
  return useQuery(useQueries({ address }).getBalance)
}
export function useGetSignatures({ address }: { address: PublicKey }) {
  return useQuery(useQueries({ address }).getSignatures)
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
