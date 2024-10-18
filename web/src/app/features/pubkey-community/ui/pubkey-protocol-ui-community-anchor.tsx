import { Anchor, Text, TextProps } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { Link } from 'react-router-dom'

export function PubkeyProtocolUiCommunityAnchor({
  community,
  name,
  slug,
  to,
  ...props
}: TextProps & {
  community: PubKeyCommunity
  name?: string
  slug?: string
  to?: string
}) {
  return to?.length ? (
    <Anchor component={Link} to={to} size="xl" fw="bold" {...props}>
      {community.name}
    </Anchor>
  ) : (
    <Text size="xl" fw="bold" {...props}>
      {community.name}
    </Text>
  )
}
