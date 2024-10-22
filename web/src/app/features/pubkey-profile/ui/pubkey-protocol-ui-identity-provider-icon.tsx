import { IdentityProvider } from '@pubkey-protocol/sdk'
import {
  IconBrandDiscordFilled,
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
  IconBrandTelegram,
  IconBrandXFilled,
  IconCurrencySolana,
  IconLetterW,
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
      return <IconBrandDiscordFilled size={size} title={provider} />
    case IdentityProvider.Farcaster:
      // FIXME: Needs Farcaster/Warpcast icon
      return <IconLetterW size={size} title={provider} />
    case IdentityProvider.Github:
      return <IconBrandGithubFilled size={size} title={provider} />
    case IdentityProvider.Google:
      return <IconBrandGoogleFilled size={size} title={provider} />
    case IdentityProvider.Solana:
      return <IconCurrencySolana size={size} title={provider} />
    case IdentityProvider.Telegram:
      return <IconBrandTelegram size={size} title={provider} />
    case IdentityProvider.X:
      return <IconBrandXFilled size={size} title={provider} />
    default:
      return null
  }
}
