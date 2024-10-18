import { PubKeyProtocolLoader } from '../data-access'
import { PubkeyProtocolFeatureDebug } from './pubkey-protocol-feature-debug'

export default function PubkeyProtocolRoutes() {
  return (
    <PubKeyProtocolLoader>
      <PubkeyProtocolFeatureDebug />
    </PubKeyProtocolLoader>
  )
}
