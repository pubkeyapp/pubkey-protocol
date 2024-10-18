import { Text } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-protocol/anchor'
import { UiGroup } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { ellipsify } from '../../../ui'
import { useKeypair } from '../../keypair/data-access'
import { UiAppCard } from '../../../ui/ui-app-card'
import { PubkeyProtocolUiProfileButtonAddAuthority } from './pubkey-protocol-ui-profile-button-add-authority'
import { PubkeyProtocolUiProfileButtonRemoveAuthority } from './pubkey-protocol-ui-profile-button-remove-authority'

export function PubkeyProtocolUiProfileCardAuthorities({
  profile,
  signAuthority,
}: {
  profile: PubKeyProfile
  signAuthority: PublicKey
}) {
  const canSign = signAuthority !== PublicKey.default
  const { feePayer } = useKeypair()

  return (
    <UiAppCard
      title="Authorities"
      action={
        canSign ? (
          <PubkeyProtocolUiProfileButtonAddAuthority authority={signAuthority} feePayer={feePayer} profile={profile} />
        ) : null
      }
    >
      {profile.authorities.map((item) => (
        <UiGroup px="xs" key={item.toString()}>
          <Text>{ellipsify(item.toString())}</Text>
          {canSign ? (
            <PubkeyProtocolUiProfileButtonRemoveAuthority
              authorityToRemove={item}
              authority={signAuthority}
              feePayer={feePayer}
              profile={profile}
            />
          ) : null}
        </UiGroup>
      ))}
    </UiAppCard>
  )
}
