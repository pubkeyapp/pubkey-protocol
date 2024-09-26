import { PubKeyIdentityProvider } from '@pubkey-protocol/anchor'
import {
  IconBrandDiscordFilled,
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
  IconBrandXFilled,
  IconCurrencySolana,
} from '@tabler/icons-react'

export function PubkeyProtocolUiIdentityProviderIcon({
  provider,
  size = 24,
}: {
  provider: PubKeyIdentityProvider
  size?: number
}) {
  switch (provider) {
    case PubKeyIdentityProvider.Discord:
      return <IconBrandDiscordFilled size={size} />
    case PubKeyIdentityProvider.Github:
      return <IconBrandGithubFilled size={size} />
    case PubKeyIdentityProvider.Google:
      return <IconBrandGoogleFilled size={size} />
    case PubKeyIdentityProvider.Solana:
      return <IconCurrencySolana size={size} />
    case PubKeyIdentityProvider.X:
      return <IconBrandXFilled size={size} />
    default:
      return null
  }
}
