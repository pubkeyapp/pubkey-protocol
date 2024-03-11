import { PubKeyIdentityProvider } from '@pubkey-program-library/anchor'
import { IconBrandDiscordFilled, IconCurrencySolana } from '@tabler/icons-react'

export function PubkeyProfileUiProvider({ provider, size = 24 }: { provider: PubKeyIdentityProvider; size?: number }) {
  switch (provider) {
    case PubKeyIdentityProvider.Discord:
      return <IconBrandDiscordFilled size={size} />
    case PubKeyIdentityProvider.Solana:
      return <IconCurrencySolana size={size} />
    default:
      return null
  }
}
