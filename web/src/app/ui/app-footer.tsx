import { Box, Group, rem } from '@mantine/core'
import { UiLogo, UiThemeSwitch } from '@pubkey-ui/core'
import { Link } from 'react-router-dom'
import { ClusterUiSelect } from '../features/cluster/cluster-ui'
import { PubkeyProtocolUiCommunitySocialLink } from '../features/pubkey-community/ui'
import { CommunitySocial } from '../features/pubkey-community/ui/pubkey-protocol-ui-community-social-icon'

export function AppFooter() {
  const discord = 'https://discord.gg/XxuZQeDPNf'
  const github = 'https://github.com/pubkeyapp/pubkey-protocol'
  const telegram = 'https://t.me/pubkeyapp'
  const x = 'https://x.com/pubkeyapp'

  return (
    <Box style={{ height: rem(56) }}>
      <Group justify="space-between" align="center" h={rem(56)} px="md">
        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <Link to="/" style={{ display: 'flex' }}>
            <UiLogo height={28} />
          </Link>
          <PubkeyProtocolUiCommunitySocialLink size={'md'} link={discord} social={CommunitySocial.Discord} />
          <PubkeyProtocolUiCommunitySocialLink size={'md'} link={github} social={CommunitySocial.Github} />
          <PubkeyProtocolUiCommunitySocialLink size={'md'} link={telegram} social={CommunitySocial.Telegram} />
          <PubkeyProtocolUiCommunitySocialLink size={'md'} link={x} social={CommunitySocial.X} />
        </Group>
        <Group>
          <ClusterUiSelect />
          <UiThemeSwitch />
        </Group>
      </Group>
    </Box>
  )
}
