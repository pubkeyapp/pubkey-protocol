import { Group, Text, Title } from '@mantine/core'
import { UiStack } from '@pubkey-ui/core'
import { useWallet } from '@solana/wallet-adapter-react'
import { ellipsify } from '../../account/account-ui'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { WalletButton } from '../../solana/solana-provider'
import { usePubkeyProfileProgram } from '../data-access'
import { PubkeyProfileUiCreate, PubkeyProfileUiList } from '../ui'

export default function PubkeyProfileFeature() {
  const { publicKey } = useWallet()
  const { programId } = usePubkeyProfileProgram()

  return publicKey ? (
    <UiStack>
      <Title>PubKey Profile</Title>
      <Text c="dimmed">
        Create a new account by clicking the "Create" button. The state of a account is stored on-chain and can be
        manipulated by calling the program's methods (increment, decrement, set, and close).
      </Text>

      <Group justify="flex-end">
        <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        <PubkeyProfileUiCreate />
      </Group>
      <PubkeyProfileUiList />
    </UiStack>
  ) : (
    <WalletButton />
  )
}
