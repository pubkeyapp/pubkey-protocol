import { MantineSize } from '@mantine/core'
import {
  IconBrandDiscordFilled,
  IconBrandGithubFilled,
  IconBrandTelegram,
  IconBrandXFilled,
  IconLetterW,
  IconWorldWww,
} from '@tabler/icons-react'

export enum CommunitySocial {
  Discord = 'Discord',
  Farcaster = 'Farcaster',
  Github = 'Github',
  Telegram = 'Telegram',
  Website = 'Website',
  X = 'X',
}

export function PubkeyProtocolUiCommunitySocialIcon({ size, social }: { size: MantineSize; social: CommunitySocial }) {
  const iconSize = convertMantineSize(size)
  switch (social) {
    case CommunitySocial.Discord:
      return <IconBrandDiscordFilled size={iconSize} />
    case CommunitySocial.Farcaster:
      return <IconLetterW size={iconSize} />
    case CommunitySocial.Github:
      return <IconBrandGithubFilled size={iconSize} />
    case CommunitySocial.Telegram:
      return <IconBrandTelegram size={iconSize} />
    case CommunitySocial.Website:
      return <IconWorldWww size={iconSize} />
    case CommunitySocial.X:
      return <IconBrandXFilled size={iconSize} />
    default:
      return null
  }
}

function convertMantineSize(size: MantineSize) {
  switch (size) {
    case 'xs':
      return 12
    case 'sm':
      return 14
    case 'md':
      return 20
    case 'lg':
      return 24
    case 'xl':
      return 36
    default:
      return 12
  }
}
