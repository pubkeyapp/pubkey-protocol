import { CreateCommunityOptions } from '@pubkey-protocol/sdk'

export const communities: Omit<CreateCommunityOptions, 'authority' | 'feePayer'>[] = [
  {
    name: 'PubKey',
    avatarUrl: 'https://github.com/pubkeyapp.png',
    discord: 'https://discord.gg/XxuZQeDPNf',
    github: 'https://github.com/pubkeyapp',
    website: 'https://pubkey.app',
    x: 'https://x.com/pubkeyapp',
  },
  {
    name: 'Legends of SOL',
    slug: 'los',
    avatarUrl: 'https://github.com/legends-of-sol.png',
  },
  {
    name: `Dean's List`,
    slug: 'deanslist',
    avatarUrl: 'https://github.com/dean-s-list.png',
  },
  {
    name: 'Marinade',
    avatarUrl: 'https://github.com/marinade-finance.png',
  },
]
