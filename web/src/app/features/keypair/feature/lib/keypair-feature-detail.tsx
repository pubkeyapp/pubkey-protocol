import { Group } from '@mantine/core'
import { UiCopy, UiStack } from '@pubkey-ui/core'
import { Keypair } from '@solana/web3.js'
import { ExplorerLink } from '../../../cluster/cluster-ui'
import { KeypairFeatureBalance } from './keypair-feature-balance'
import { KeypairFeatureTransactions } from './keypair-feature-transactions'

export function KeypairDetailScreen({ keypair }: { keypair: Keypair }) {
  const address = keypair.publicKey

  return (
    <UiStack>
      <UiStack gap={0}>
        <KeypairFeatureBalance address={address} />
        <Group>
          <UiCopy text={address.toString()} />
          <ExplorerLink ff="monospace" label={address.toString()} path={`account/${address}`} />
        </Group>
      </UiStack>
      <KeypairFeatureTransactions address={address} />
    </UiStack>
  )
}
