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
  render,
}: {
  render: ({ connection, publicKey, signTransaction, wallet }: SolanaConnectionRenderProps) => ReactNode
}) {
  const { publicKey, signTransaction, wallet } = useWallet()
  const { connection } = useConnection()

  if (!connection) {
    return null
  }

  if (!wallet) {
    return <WalletMultiButton />
  }

  if (!publicKey) {
    return <Loader />
  }

  if (!signTransaction) {
    return <Loader />
  }

  return render({ connection, publicKey, signTransaction, wallet })
}
