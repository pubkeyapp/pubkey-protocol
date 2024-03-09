import { Button, Title } from '@mantine/core'
import { UiCard, UiLoader, UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import { ellipsify } from '../../account/account-ui'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { usePubkeyProfileProgramAccount } from '../data-access'

export function PubkeyProfileUiCard({ account }: { account: PublicKey }) {
  const { accountQuery, incrementMutation, setMutation, decrementMutation, closeMutation } =
    usePubkeyProfileProgramAccount({ account })

  const count = useMemo(() => accountQuery.data?.count ?? 0, [accountQuery.data?.count])

  return accountQuery.isLoading ? (
    <UiLoader />
  ) : (
    <UiCard>
      <UiStack align="center">
        <Title onClick={() => accountQuery.refetch()}>{count}</Title>
        <Button.Group>
          <Button
            size="xs"
            variant="outline"
            onClick={() => incrementMutation.mutateAsync()}
            disabled={incrementMutation.isPending}
          >
            Increment
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              const value = window.prompt('Set value to:', count.toString() ?? '0')
              if (!value || parseInt(value) === count || isNaN(parseInt(value))) {
                return
              }
              return setMutation.mutateAsync(parseInt(value))
            }}
            loading={setMutation.isPending}
          >
            Set
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() => decrementMutation.mutateAsync()}
            loading={decrementMutation.isPending}
          >
            Decrement
          </Button>
        </Button.Group>
        <UiStack>
          <ExplorerLink path={`account/${account}`} label={ellipsify(account.toString())} />
          <Button
            size="xs"
            variant="outline"
            color="red"
            onClick={() => {
              if (!window.confirm('Are you sure you want to close this account?')) {
                return
              }
              return closeMutation.mutateAsync()
            }}
            loading={closeMutation.isPending}
          >
            Close
          </Button>
        </UiStack>
      </UiStack>
    </UiCard>
  )
}
