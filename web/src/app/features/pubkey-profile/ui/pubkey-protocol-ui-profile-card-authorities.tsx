import { Text } from '@mantine/core'
import { ellipsify, PubKeyCommunity, PubKeyProfile, PublicKeyString } from '@pubkey-protocol/sdk'
import { UiGroup } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { UiAppCard } from '../../../ui'
import { useKeypair } from '../../keypair/data-access'
import { PubkeyProtocolUiProfileAuthorityRemoveButton } from './pubkey-protocol-ui-profile-authority-remove-button'
import { PubkeyProtocolUiProfileProfileAuthorityAddButton } from './pubkey-protocol-ui-profile-profile-authority-add-button'

export function PubkeyProtocolUiProfileCardAuthorities({
  community,
  profile,
  signAuthority,
}: {
  community: PubKeyCommunity
  profile: PubKeyProfile
  signAuthority: PublicKeyString
}) {
  const canSign = signAuthority !== PublicKey.default
  const { feePayer } = useKeypair()

  return (
    <UiAppCard
      title="Authorities"
      action={
        canSign ? (
          <PubkeyProtocolUiProfileProfileAuthorityAddButton
            authority={signAuthority}
            community={community}
            feePayer={feePayer}
            profile={profile}
          />
        ) : null
      }
    >
      {profile.authorities.map((item) => (
        <UiGroup px="xs" key={item.toString()}>
          <Text>{ellipsify(item.toString())}</Text>
          {canSign ? (
            <PubkeyProtocolUiProfileAuthorityRemoveButton
              authorityToRemove={item}
              authority={signAuthority}
              community={community}
              feePayer={feePayer}
              profile={profile}
            />
          ) : null}
        </UiGroup>
      ))}
    </UiAppCard>
  )
}
