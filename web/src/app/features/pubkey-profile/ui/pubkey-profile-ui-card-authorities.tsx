import { Divider, Paper, Text } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { UiGroup, UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { ellipsify } from '../../account/ui/ellipsify'
import { useKeypair } from '../../keypair/data-access'
import { PubKeyProfileUiButtonAddAuthority } from './pubkey-profile-ui-button-add-authority'
import { PubKeyProfileUiButtonRemoveAuthority } from './pubkey-profile-ui-button-remove-authority'

export function PubkeyProfileUiCardAuthorities({
  profile,
  signAuthority,
}: {
  profile: PubKeyProfile
  signAuthority: PublicKey
}) {
  const canSign = signAuthority !== PublicKey.default
  const { feePayer } = useKeypair()

  return (
    <Paper withBorder py="sm">
      <UiStack>
        <UiGroup px="xs">
          <Text size="lg" fw={500}>
            Authorities
          </Text>
          {canSign ? (
            <PubKeyProfileUiButtonAddAuthority authority={signAuthority} feePayer={feePayer} profile={profile} />
          ) : null}
        </UiGroup>
        <Divider />

        {profile.authorities.map((item) => (
          <UiGroup px="xs" key={item.toString()}>
            <Text>{ellipsify(item.toString())}</Text>
            {canSign ? (
              <PubKeyProfileUiButtonRemoveAuthority
                authorityToRemove={item}
                authority={signAuthority}
                feePayer={feePayer}
                profile={profile}
              />
            ) : null}
          </UiGroup>
        ))}
      </UiStack>
    </Paper>
  )
}
