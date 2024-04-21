import { useWallet } from '@solana/wallet-adapter-react'

import { WalletUiBalanceCheck } from './wallet-ui-balance-check'

export function WalletUiBalanceChecker() {
  const { publicKey } = useWallet()
  if (!publicKey) {
    return null
  }
  return <WalletUiBalanceCheck address={publicKey} />
}
