import { Anchor, Text } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-protocol/anchor'
import { Link } from 'react-router-dom'

export function PubkeyProtocolUiProfileAnchor({ profile, to }: { profile: PubKeyProfile; to?: string }) {
  return to?.length ? (
    <Anchor component={Link} to={to} size="xl" fw="bold">
      {profile.name}
    </Anchor>
  ) : (
    <Text size="xl" fw="bold">
      {profile.name}
    </Text>
  )
}
