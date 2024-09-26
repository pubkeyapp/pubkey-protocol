import { PubkeyProtocolProvider } from '../data-access'
import { PubkeyProtocolFeatureDebug } from './pubkey-protocol-feature-debug'
import { SolanaConnectionLoader } from '../../solana'

export default function PubkeyProtocolRoutes() {
  return (
    <SolanaConnectionLoader
      render={(props) => (
        <PubkeyProtocolProvider {...props}>
          <PubkeyProtocolFeatureDebug />
        </PubkeyProtocolProvider>
      )}
    />
  )
}
