import { Anchor, Text, TextProps } from '@mantine/core'
import { Link } from 'react-router-dom'

export function PubkeyProtocolUiCommunityAnchor({
  name,
  slug,
  basePath,
  ...props
}: TextProps & {
  name: string
  slug: string
  basePath?: string
}) {
  return basePath ? (
    <Anchor component={Link} to={`${basePath}/${slug}`} size="xl" fw="bold" {...props}>
      {name}
    </Anchor>
  ) : (
    <Text size="xl" fw="bold" {...props}>
      {name}
    </Text>
  )
}
