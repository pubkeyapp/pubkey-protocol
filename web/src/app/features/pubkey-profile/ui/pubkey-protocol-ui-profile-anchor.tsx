import { Anchor, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

export function PubkeyProtocolUiProfileAnchor({
  name,
  username,
  basePath,
}: {
  name: string
  username: string
  basePath?: string
}) {
  return basePath ? (
    <Anchor component={Link} to={`${basePath}/${username}`} size="xl" fw="bold">
      {name}
    </Anchor>
  ) : (
    <Text size="xl" fw="bold">
      {name}
    </Text>
  )
}
