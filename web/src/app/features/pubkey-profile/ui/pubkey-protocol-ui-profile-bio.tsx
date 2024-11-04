import { Text, TextProps } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-protocol/anchor'

export function PubkeyProtocolUiProfileBio({ profile, ...props }: TextProps & { profile: PubKeyProfile }) {
  return profile.bio ? (
    <Text size="sm" c="dimmed" {...props}>
      {profile.bio}
    </Text>
  ) : null
}
