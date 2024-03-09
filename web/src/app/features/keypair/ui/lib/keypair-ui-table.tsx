import { ActionIcon, Anchor, Button, Group, Table, Text } from '@mantine/core'
import { UiAlert, UiCopy, UiDebugModal } from '@pubkey-ui/core'
import { IconCurrencySolana, IconTrash } from '@tabler/icons-react'
import { AppLabel } from '../../../../app-labels-provider'
import { useKeypair } from '../../data-access'

export function KeypairUiTable() {
  const { keypairs, generateKeypair, setKeypair, deleteKeypair } = useKeypair()

  return keypairs.length ? (
    <Table>
      <Table.Tbody>
        {keypairs?.map((item) => (
          <Table.Tr key={item.name}>
            <Table.Td>
              {item?.active ? (
                <AppLabel size="lg" publicKey={item.publicKey} />
              ) : (
                <Anchor component="button" title="Select keypair" onClick={() => setKeypair(item)}>
                  <AppLabel publicKey={item.publicKey} />
                </Anchor>
              )}

              <Group gap={4}>
                <UiCopy size="xs" text={item.publicKey} />
                <Text c="dimmed" size="xs">
                  {item.publicKey}
                </Text>
              </Group>
            </Table.Td>
            <Table.Td>
              <Group gap="xs" justify="flex-end">
                <ActionIcon disabled={!item.solana} size="sm" variant="light">
                  <IconCurrencySolana />
                </ActionIcon>
                <UiDebugModal data={item} />
                <ActionIcon
                  size="sm"
                  variant="light"
                  disabled={item.active}
                  onClick={() => {
                    if (!window.confirm('Are you sure?')) return
                    deleteKeypair(item)
                  }}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  ) : (
    <UiAlert title="No keypairs found" message={<Button onClick={() => generateKeypair()}>Generate Keypair</Button>} />
  )
}
