import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { UiGroup } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { useKeypair } from '../../keypair/data-access'
import { AppCard } from './app-card'
import { PubkeyProtocolUiButtonAddIdentity } from './pubkey-protocol-ui-button-add-identity'
import { PubkeyProtocolUiButtonRemoveIdentity } from './pubkey-protocol-ui-button-remove-identity'
import { PubkeyProtocolUiIdentity } from './pubkey-protocol-ui-identity'

export function PubkeyProtocolUiCardIdentities({
  profile,
  signAuthority,
}: {
  profile: PubKeyProfile
  signAuthority: PublicKey
}) {
  const canSign = signAuthority !== PublicKey.default
  const { feePayer } = useKeypair()

  return (
    <AppCard title="Identities" action={canSign ? <PubkeyProtocolUiButtonAddIdentity profile={profile} /> : null}>
      {profile.identities.map((item) => (
        <UiGroup px="xs" key={item.providerId}>
          <PubkeyProtocolUiIdentity identity={item} key={item.providerId} />
          {canSign ? (
            <PubkeyProtocolUiButtonRemoveIdentity
              provider={item.provider}
              providerId={item.providerId}
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
