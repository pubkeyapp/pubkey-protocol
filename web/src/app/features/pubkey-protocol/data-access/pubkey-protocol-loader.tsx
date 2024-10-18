import { Title } from '@mantine/core'
import { UiStack } from '@pubkey-ui/core'
import { ReactNode } from 'react'
import { SolanaConnectionLoader, WalletButton } from '../../solana'
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
      noWallet={
        <UiStack align="center" gap="xl" my="xl" py="xl">
          <Title order={2}>Connect your wallet to continue.</Title>
          <WalletButton />
        </UiStack>
      }
      {...props}
      render={(props) => <PubKeyProtocolProvider {...props}>{children}</PubKeyProtocolProvider>}
    />
  )
}
