import { Container } from '@mantine/core'
import { UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'

import { useParams } from 'react-router-dom'

import { ExplorerLink } from '../cluster/cluster-ui'
import { AccountUiTokens } from './account-ui-tokens'

import { AccountUiBalance } from './ui/account-ui-balance'
import { AccountUiButtons } from './ui/account-ui-buttons'
import { AccountUiTransactions } from './ui/account-ui-transactions'
import { ellipsify } from './ui/ellipsify'

export default function AccountFeatureDetail() {
  const params = useParams()
  const address = useMemo(() => {
    if (!params.address) {
      return
    }
    try {
      return new PublicKey(params.address)
    } catch (e) {
      console.log(`Invalid public key`, e)
    }
  }, [params])
  if (!address) {
    return <div>Error loading account</div>
  }

  return (
    <Container py="xl" my="xl">
      <UiStack align="center" gap="xl">
        <AccountUiBalance order={2} address={address} />
        <ExplorerLink path={`account/${address}`} label={ellipsify(address.toString())} />
        <AccountUiButtons address={address} />
      </UiStack>

      <UiStack>
        <AccountUiTokens address={address} />
        <AccountUiTransactions address={address} />
      </UiStack>
    </Container>
  )
}
