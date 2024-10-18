import { Anchor, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

export function PubkeyProtocolUiCommunityAnchor({
  name,
  slug,
  basePath,
}: {
  name: string
  slug: string
  basePath?: string
}) {
  return basePath ? (
    <Anchor component={Link} to={`${basePath}/${slug}`} size="xl" fw="bold">
      {name}
    </Anchor>
  ) : (
    <Text size="xl" fw="bold">
      {name}
    </Text>
  )
}
