import { PubKeyProfile } from '@pubkey-protocol/anchor'
import { UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import { PubkeyProtocolUiProfileAvatarUpdateButton } from './pubkey-protocol-ui-profile-avatar-update-button'
import { PubkeyProtocolUiProfileCardAuthorities } from './pubkey-protocol-ui-profile-card-authorities'
import { PubkeyProtocolUiProfileCardIdentities } from './pubkey-protocol-ui-profile-card-identities'
import { PubkeyProtocolUiProfileListItem } from './pubkey-protocol-ui-profile-list-item'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function PubkeyProtocolUiProfileCard({ profile, basePath }: { profile: PubKeyProfile; basePath?: string }) {
  const { authority } = usePubKeyProtocol()

  const signAuthority = useMemo(
    () => profile.authorities?.find((a) => a.toString() === authority.toString()) ?? PublicKey.default,
    [profile.authorities, authority],
  )

  return (
    <PubkeyProtocolUiProfileListItem profile={profile} basePath={basePath}>
      {signAuthority ? (
        <UiStack mt="md">
          <PubkeyProtocolUiProfileCardIdentities profile={profile} signAuthority={signAuthority} />
          <PubkeyProtocolUiProfileCardAuthorities profile={profile} signAuthority={signAuthority} />
          <PubkeyProtocolUiProfileAvatarUpdateButton profile={profile} signAuthority={signAuthority} />
        </UiStack>
      ) : null}
    </PubkeyProtocolUiProfileListItem>
  )
}
