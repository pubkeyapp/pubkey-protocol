import { Text } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { UiGroup } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { ellipsify } from '../../account/ui/ellipsify'
import { useKeypair } from '../../keypair/data-access'
import { AppCard } from './app-card'
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
    <AppCard
      title="Authorities"
      action={
        canSign ? (
          <PubKeyProfileUiButtonAddAuthority authority={signAuthority} feePayer={feePayer} profile={profile} />
        ) : null
      }
    >
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
    </AppCard>
  )
}
