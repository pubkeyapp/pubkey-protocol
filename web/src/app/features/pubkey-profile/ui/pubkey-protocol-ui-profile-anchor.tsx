import { Anchor, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

export function PubkeyProtocolUiProfileAnchor({ username, basePath }: { username: string; basePath?: string }) {
  return basePath ? (
    <Anchor component={Link} to={`${basePath}/${username}`} size="xl" fw="bold">
      {username}
    </Anchor>
  ) : (
    <Text size="xl" fw="bold">
      {username}
    </Text>
  )
}
