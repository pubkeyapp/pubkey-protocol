import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import { usePubKeyProfile } from '../data-access'
import { PubkeyProtocolUiAvatarUpdateButton } from './pubkey-protocol-ui-avatar-update-button'
import { PubkeyProtocolUiCardAuthorities } from './pubkey-protocol-ui-card-authorities'
import { PubkeyProtocolUiCardIdentities } from './pubkey-protocol-ui-card-identities'
import { PubkeyProtocolUiListItem } from './pubkey-protocol-ui-list-item'

export function PubkeyProtocolUiCard({ profile, basePath }: { profile: PubKeyProfile; basePath?: string }) {
  const { authority } = usePubKeyProfile()

  const signAuthority = useMemo(
    () => profile.authorities?.find((a) => a.toString() === authority.toString()) ?? PublicKey.default,
    [profile.authorities, authority],
  )

  return (
    <PubkeyProtocolUiListItem profile={profile} basePath={basePath}>
      {signAuthority ? (
        <UiStack mt="md">
          <PubkeyProtocolUiCardIdentities profile={profile} signAuthority={signAuthority} />
          <PubkeyProtocolUiCardAuthorities profile={profile} signAuthority={signAuthority} />
          <PubkeyProtocolUiAvatarUpdateButton profile={profile} signAuthority={signAuthority} />
        </UiStack>
      ) : null}
    </PubkeyProtocolUiListItem>
  )
}
