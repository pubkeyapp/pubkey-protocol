import { IdentityProvider } from '@pubkey-protocol/anchor'
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
  provider: IdentityProvider
  size?: number
}) {
  switch (provider) {
    case IdentityProvider.Discord:
      return <IconBrandDiscordFilled size={size} />
    case IdentityProvider.Github:
      return <IconBrandGithubFilled size={size} />
    case IdentityProvider.Google:
      return <IconBrandGoogleFilled size={size} />
    case IdentityProvider.Solana:
      return <IconCurrencySolana size={size} />
    case IdentityProvider.X:
      return <IconBrandXFilled size={size} />
    default:
      return null
  }
}
