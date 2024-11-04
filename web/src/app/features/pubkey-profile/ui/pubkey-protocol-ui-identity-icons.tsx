import { Group } from '@mantine/core'
import { PubKeyIdentity } from '@pubkey-protocol/anchor'
import { PubkeyProtocolUiIdentityIcon } from './pubkey-protocol-ui-identity-icon'

export function PubkeyProtocolUiIdentityIcons({ identities }: { identities: PubKeyIdentity[] }) {
  return (
    <Group>
      {identities.map((identity) => (
        <PubkeyProtocolUiIdentityIcon identity={identity} key={identity.providerId} />
      ))}
    </Group>
  )
}
