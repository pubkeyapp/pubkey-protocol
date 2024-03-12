import { useKeypair } from '../../keypair/data-access'
import { AccountUiBalanceCheck } from './account-ui-balance-check'

export function AccountUiKeypairChecker() {
  const { keypair } = useKeypair()
  if (!keypair.solana) {
    return null
  }
  return <AccountUiBalanceCheck label="Fee Payer account not found" address={keypair.solana.publicKey} />
}
