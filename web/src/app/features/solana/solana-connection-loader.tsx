import { WalletMultiButton } from '@pubkeyapp/wallet-adapter-mantine-ui'
import { useConnection, useWallet, Wallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js'
import { ReactNode } from 'react'
import { Loader } from '@mantine/core'

export interface SolanaConnectionRenderProps {
  connection: Connection
  publicKey: PublicKey
  signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>
  wallet: Wallet
}

export function SolanaConnectionLoader({
  loader = <Loader />,
  noConnection = <div>No Solana Connection in context</div>,
  noWallet = <WalletMultiButton />,
  render,
}: {
  loader?: ReactNode
  noConnection?: ReactNode
  noWallet?: ReactNode
  render: ({ connection, publicKey, signTransaction, wallet }: SolanaConnectionRenderProps) => ReactNode
}) {
  const { publicKey, signTransaction, wallet } = useWallet()
  const { connection } = useConnection()

  if (!connection) {
    return noConnection
  }

  if (!wallet) {
    return noWallet
  }

  if (!publicKey) {
    return loader
  }

  if (!signTransaction) {
    return loader
  }

  return render({ connection, publicKey, signTransaction, wallet })
}
