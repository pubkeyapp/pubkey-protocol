import { Group, HoverCard } from '@mantine/core'
import { PubKeyIdentity } from '@pubkey-protocol/anchor'
import { PubkeyProtocolUiIdentity } from './pubkey-protocol-ui-identity'
import { PubkeyProtocolUiIdentityProviderIcon } from './pubkey-protocol-ui-identity-provider-icon'

export function PubkeyProtocolUiIdentityIcon({ identity }: { identity: PubKeyIdentity }) {
  return (
    <Group>
      <HoverCard width={320} shadow="md" withArrow>
        <HoverCard.Target>
          <Group>
            <PubkeyProtocolUiIdentityProviderIcon size={32} provider={identity.provider} />
          </Group>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <PubkeyProtocolUiIdentity identity={identity} />
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  )
}
