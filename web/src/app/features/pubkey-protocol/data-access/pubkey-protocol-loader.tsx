import { ReactNode } from 'react'
import { SolanaConnectionLoader } from '../../solana'
import { PubKeyProtocolProvider } from './pubkey-protocol-provider'

export function PubKeyProtocolLoader({
  children,
  ...props
}: {
  children: ReactNode
  loader?: ReactNode
  noConnection?: ReactNode
  noWallet?: ReactNode
}) {
  return (
    <SolanaConnectionLoader
      {...props}
      render={(props) => <PubKeyProtocolProvider {...props}>{children}</PubKeyProtocolProvider>}
    />
  )
}
