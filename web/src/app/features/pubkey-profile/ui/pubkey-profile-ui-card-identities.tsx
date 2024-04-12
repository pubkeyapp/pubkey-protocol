import { Divider, Paper, Text } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { UiGroup, UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { useKeypair } from '../../keypair/data-access'
import { PubKeyProfileUiButtonAddIdentity } from './pubkey-profile-ui-button-add-identity'
import { PubKeyProfileUiButtonRemoveIdentity } from './pubkey-profile-ui-button-remove-identity'
import { PubkeyProfileUiIdentity } from './pubkey-profile-ui-identity'

export function PubkeyProfileUiCardIdentities({
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
            Identities
          </Text>
          {canSign ? (
            <PubKeyProfileUiButtonAddIdentity authority={signAuthority} feePayer={feePayer} profile={profile} />
          ) : null}
        </UiGroup>
        <Divider />

        {profile.identities.map((item) => (
          <UiGroup px="xs" key={item.providerId}>
            <PubkeyProfileUiIdentity identity={item} key={item.providerId} />
            {canSign ? (
              <PubKeyProfileUiButtonRemoveIdentity
                provider={item.provider}
                providerId={item.providerId}
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
