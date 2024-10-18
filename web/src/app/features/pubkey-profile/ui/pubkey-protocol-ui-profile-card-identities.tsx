import { PubKeyProfile } from '@pubkey-protocol/anchor'
import { UiGroup } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { useKeypair } from '../../keypair/data-access'
import { UiAppCard } from '../../../ui/ui-app-card'
import { PubkeyProtocolUiProfileButtonAddIdentity } from './pubkey-protocol-ui-profile-button-add-identity'
import { PubkeyProtocolUiProfileButtonRemoveIdentity } from './pubkey-protocol-ui-profile-button-remove-identity'
import { PubkeyProtocolUiIdentity } from './pubkey-protocol-ui-identity'

export function PubkeyProtocolUiProfileCardIdentities({
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
      title="Identities"
      action={canSign ? <PubkeyProtocolUiProfileButtonAddIdentity profile={profile} /> : null}
    >
      {profile.identities.map((item) => (
        <UiGroup px="xs" key={item.providerId}>
          <PubkeyProtocolUiIdentity identity={item} key={item.providerId} />
          {canSign ? (
            <PubkeyProtocolUiProfileButtonRemoveIdentity
              provider={item.provider}
              providerId={item.providerId}
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
