import { Group, Text, Title } from '@mantine/core'
import { UiStack } from '@pubkey-ui/core'
import { useWallet } from '@solana/wallet-adapter-react'

import { ellipsify } from '../../account/ui/ellipsify'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { WalletButton } from '../../solana/solana-provider'
import { usePubkeyProfileSdk } from '../data-access'
import { PubkeyProfileUiCreate, PubkeyProfileUiDemo, PubkeyProfileUiList } from '../ui'

export default function PubkeyProfileFeature() {
  const { publicKey } = useWallet()
  const { sdk } = usePubkeyProfileSdk()

  return publicKey ? (
    <UiStack>
      <Title>PubKey Profile</Title>
      <Text c="dimmed">
        Create a new account by clicking the "Create" button. The state of a account is stored on-chain and can be
        manipulated by calling the program's methods (updateAvatarUrl, addAuthority, removeAuthority, addIdentity,
        removeIdentity).
      </Text>

      <Group justify="flex-end">
        test
        <ExplorerLink path={`account/${sdk.programId}`} label={ellipsify(sdk.programId.toString())} />
        <PubkeyProfileUiCreate />
      </Group>
      <PubkeyProfileUiList />
      <PubkeyProfileUiDemo />
    </UiStack>
  ) : (
    <WalletButton />
  )
}
