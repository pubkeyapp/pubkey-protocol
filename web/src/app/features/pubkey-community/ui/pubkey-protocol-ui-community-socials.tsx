import { Group, GroupProps } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/sdk'
import { CommunitySocial } from './pubkey-protocol-ui-community-social-icon'
import { PubkeyProtocolUiCommunitySocialLink } from './pubkey-protocol-ui-community-social-link'

export function PubkeyProtocolUiCommunitySocials({ community, ...props }: GroupProps & { community: PubKeyCommunity }) {
  const { discord, farcaster, github, telegram, website, x } = community

  if (!discord && !farcaster && !github && !telegram && !website && !x) {
    return null
  }

  return (
    <Group gap="xs" {...props}>
      <PubkeyProtocolUiCommunitySocialLink link={discord} social={CommunitySocial.Discord} />
      <PubkeyProtocolUiCommunitySocialLink link={farcaster} social={CommunitySocial.Farcaster} />
      <PubkeyProtocolUiCommunitySocialLink link={github} social={CommunitySocial.Github} />
      <PubkeyProtocolUiCommunitySocialLink link={telegram} social={CommunitySocial.Telegram} />
      <PubkeyProtocolUiCommunitySocialLink link={website} social={CommunitySocial.Website} />
      <PubkeyProtocolUiCommunitySocialLink link={x} social={CommunitySocial.X} />
    </Group>
  )
}
