import { Anchor, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

export function PubkeyProtocolUiCommunityAnchor({ slug, basePath }: { slug: string; basePath?: string }) {
  return basePath ? (
    <Anchor component={Link} to={`${basePath}/${slug}`} size="xl" fw="bold">
      {slug}
    </Anchor>
  ) : (
    <Text size="xl" fw="bold">
      {slug}
    </Text>
  )
}
