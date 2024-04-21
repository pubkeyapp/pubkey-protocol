import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import { usePubKeyProfile } from '../data-access'
import { PubkeyProfileUiAvatarUpdateButton } from './pubkey-profile-ui-avatar-update-button'
import { PubkeyProfileUiCardAuthorities } from './pubkey-profile-ui-card-authorities'
import { PubkeyProfileUiCardIdentities } from './pubkey-profile-ui-card-identities'
import { PubkeyProfileUiListItem } from './pubkey-profile-ui-list-item'

export function PubkeyProfileUiCard({ profile, basePath }: { profile: PubKeyProfile; basePath?: string }) {
  const { authority } = usePubKeyProfile()

  const signAuthority = useMemo(
    () => profile.authorities?.find((a) => a.toString() === authority.toString()) ?? PublicKey.default,
    [profile.authorities, authority],
  )

  return (
    <PubkeyProfileUiListItem profile={profile} basePath={basePath}>
      {signAuthority ? (
        <UiStack mt="md">
          <PubkeyProfileUiCardIdentities profile={profile} signAuthority={signAuthority} />
          <PubkeyProfileUiCardAuthorities profile={profile} signAuthority={signAuthority} />
          <PubkeyProfileUiAvatarUpdateButton profile={profile} signAuthority={signAuthority} />
        </UiStack>
      ) : null}
    </PubkeyProfileUiListItem>
  )
}
