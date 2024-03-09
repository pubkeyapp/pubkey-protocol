import { Group } from '@mantine/core'
import { UiCopy, UiStack } from '@pubkey-ui/core'

import { Keypair } from '@solana/web3.js'
import { AccountUiBalance } from '../../../account/ui/account-ui-balance'
import { AccountUiTokenTable } from '../../../account/ui/account-ui-token-table'
import { AccountUiTransactions } from '../../../account/ui/account-ui-transactions'
import { ExplorerLink } from '../../../cluster/cluster-ui'
import { useKeypairTokenOperations } from '../../data-access'

export function KeypairDetailScreen({ keypair }: { keypair: Keypair }) {
  const address = keypair.publicKey
  const { burnTokens, closeAccount, sendTokens } = useKeypairTokenOperations({
    keypair,
  })

  return (
    <UiStack>
      <UiStack gap={0}>
        <AccountUiBalance address={address} />
        <Group>
          <UiCopy text={address.toString()} />
          <ExplorerLink ff="monospace" label={address.toString()} path={`account/${address}`} />
        </Group>
      </UiStack>
      <AccountUiTokenTable address={address} burn={burnTokens} close={closeAccount} send={sendTokens} />
      <AccountUiTransactions address={address} />
    </UiStack>
  )
}
