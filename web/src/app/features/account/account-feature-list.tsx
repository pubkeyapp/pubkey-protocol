import { useWallet } from '@solana/wallet-adapter-react'
import { Navigate } from 'react-router-dom'
import { WalletButton } from '../solana/solana-provider'

export default function AccountFeatureList() {
  const { publicKey } = useWallet()

  if (publicKey) {
    return <Navigate to={publicKey.toString()} replace />
  }

  return <WalletButton />
}
