import { ActionIcon, MantineSize, Tooltip } from '@mantine/core'
import { CommunitySocial, PubkeyProtocolUiCommunitySocialIcon } from './pubkey-protocol-ui-community-social-icon'

export function PubkeyProtocolUiCommunitySocialLink({
  link,
  size = 'sm',
  social,
}: {
  link?: string
  size?: MantineSize
  social: CommunitySocial
}) {
  return link ? (
    <Tooltip label={link.replace('https://', '')} withArrow>
      <ActionIcon component={'a'} href={link} target="_blank" size={size} variant="light">
        <PubkeyProtocolUiCommunitySocialIcon size={size} social={social} />
      </ActionIcon>
    </Tooltip>
  ) : null
}
