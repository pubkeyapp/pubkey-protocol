import { IconBrandDiscordFilled, IconCurrencySolana } from '@tabler/icons-react'
import { PubKeyIdentityProvider } from '../data-access/pubkey-profile.types'

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
