import { Text, TextProps } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/anchor'

export function PubkeyProtocolUiCommunityDescription({
  community,
  ...props
}: TextProps & { community: PubKeyCommunity }) {
  return community.description ? (
    <Text size="sm" c="dimmed" {...props}>
      {community.description}
    </Text>
  ) : null
}
