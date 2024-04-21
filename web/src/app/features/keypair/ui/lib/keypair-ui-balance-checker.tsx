import { useKeypair } from '../../data-access'
import { WalletUiBalanceCheck } from '../index'

export function KeypairUiBalanceChecker() {
  const { keypair } = useKeypair()
  if (!keypair.solana) {
    return null
  }
  return <WalletUiBalanceCheck label="Fee Payer account not found" address={keypair.solana.publicKey} />
}
