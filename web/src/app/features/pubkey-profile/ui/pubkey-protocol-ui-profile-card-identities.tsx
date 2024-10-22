import { PubKeyCommunity, PubKeyProfile, PublicKeyString } from '@pubkey-protocol/sdk'
import { UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { UiAppCard } from '../../../ui'
import { useKeypair } from '../../keypair/data-access'
import { PubkeyProtocolUiIdentity } from './pubkey-protocol-ui-identity'
import { PubkeyProtocolUiProfileButtonAddIdentity } from './pubkey-protocol-ui-profile-button-add-identity'
import { PubkeyProtocolUiProfileButtonRemoveIdentity } from './pubkey-protocol-ui-profile-button-remove-identity'

export function PubkeyProtocolUiProfileCardIdentities({
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
      title="Identities"
      action={canSign ? <PubkeyProtocolUiProfileButtonAddIdentity community={community} profile={profile} /> : null}
    >
      <UiStack px="xs" gap="xl">
        {profile.identities.map((item) => (
          <PubkeyProtocolUiIdentity
            identity={item}
            key={item.providerId}
            action={
              canSign ? (
                <PubkeyProtocolUiProfileButtonRemoveIdentity
                  authority={signAuthority}
                  community={community}
                  feePayer={feePayer}
                  profile={profile}
                  provider={item.provider}
                  providerId={item.providerId}
                />
              ) : null
            }
          ></PubkeyProtocolUiIdentity>
        ))}
      </UiStack>
    </UiAppCard>
  )
}
