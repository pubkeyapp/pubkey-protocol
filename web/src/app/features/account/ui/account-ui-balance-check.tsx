import { Button, Group, Text } from '@mantine/core'
import { UiWarning } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { useCluster } from '../../cluster/cluster-data-access'
import { useGetBalance, useRequestAirdrop } from '../account-data-access'

export function AccountUiBalanceCheck({
  address,
  label = 'Account not found',
}: {
  address: PublicKey
  label?: string
}) {
  const { cluster } = useCluster()
  const query = useGetBalance({ address })
  const requestAirdrop = useRequestAirdrop({ address })

  if (query.isLoading) {
    return null
  }
  if (query.isError || !query.data) {
    return (
      <UiWarning
        styles={{
          root: { display: 'flex', justifyContent: 'center' },
          title: { justifyContent: 'center' },
        }}
        title={label}
        icon={undefined}
        message={
          <Group justify="center">
            <Text>
              You are connected to <strong>{cluster.name}</strong> but your account is not found on this cluster.
            </Text>
            <Button
              variant="light"
              color="yellow"
              size="xs"
              onClick={() => requestAirdrop.mutateAsync('1').catch((err) => console.log(err))}
            >
              Request Airdrop
            </Button>
          </Group>
        }
      />
    )
  }
  return null
}
