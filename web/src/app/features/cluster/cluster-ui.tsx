import { Anchor, AnchorProps, Button, Group, Menu, Select, Table, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { UiCopy, UiStack, UiWarning } from '@pubkey-ui/core'
import { useConnection } from '@solana/wallet-adapter-react'
import { IconNetwork, IconNetworkOff, IconTrash } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Cluster, ClusterNetwork, useCluster } from './cluster-data-access'

export function ExplorerLink({
  copy,
  path,
  label = 'View on Explorer',
  ...props
}: { path: string; copy?: string; label?: ReactNode } & AnchorProps) {
  const { getExplorerUrl } = useCluster()
  return (
    <Group align="center" gap={4} wrap="nowrap">
      {copy ? <UiCopy text={copy} /> : null}
      <Anchor href={getExplorerUrl(path)} target="_blank" rel="noopener noreferrer" {...props}>
        {label}
      </Anchor>
    </Group>
  )
}

export function ClusterUiSelect() {
  const { clusters, setCluster, cluster } = useCluster()
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button>{cluster.name}</Button>
      </Menu.Target>

      <Menu.Dropdown>
        {clusters.map((item) => (
          <Menu.Item
            key={item.name}
            onClick={() => setCluster(item)}
            leftSection={item.active ? <IconNetwork /> : <IconNetworkOff />}
          >
            {item.name}
          </Menu.Item>
        ))}
        <Menu.Divider />
        <Menu.Item component={Link} to="/clusters">
          Manage Clusters
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export function ClusterChecker({ children }: { children: ReactNode }) {
  const { cluster } = useCluster()
  const { connection } = useConnection()

  const query = useQuery({
    queryKey: ['version', { cluster, endpoint: connection.rpcEndpoint }],
    queryFn: () => connection.getVersion(),
    retry: 1,
  })
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
        title="Error connecting to cluster"
        icon={<IconNetworkOff />}
        message={
          <Group justify="center">
            <Text>
              Error connecting to cluster <strong>{cluster.name}</strong>
            </Text>
            <Button variant="light" color="yellow" size="xs" onClick={() => query.refetch()}>
              Refresh
            </Button>
          </Group>
        }
      />
    )
  }
  return children
}

export function ClusterUiModal() {
  const { addCluster } = useCluster()

  return (
    <Button
      onClick={() => {
        modals.open({
          title: 'Add Cluster',
          children: (
            <ClusterUiForm
              addCluster={(input) => {
                addCluster(input)
                modals.closeAll()
              }}
            />
          ),
        })
      }}
    >
      Add Cluster
    </Button>
  )
}

export function ClusterUiForm({ addCluster }: { addCluster: (input: Cluster) => void }) {
  const form = useForm<Cluster>({
    initialValues: {
      endpoint: '',
      name: '',
      network: ClusterNetwork.Devnet,
    },
    // Validate that the endpoint is a valid URL
    validate: (values) => {
      try {
        new URL(values.endpoint)
        return {}
      } catch (error) {
        return { endpoint: 'Invalid URL' }
      }
    },
  })

  return (
    <form onSubmit={form.onSubmit((values) => addCluster(values))}>
      <UiStack>
        <TextInput type="text" placeholder="Name" withAsterisk key={form.key('name')} {...form.getInputProps('name')} />
        <TextInput
          type="url"
          placeholder="Endpoint"
          withAsterisk
          key={form.key('endpoint')}
          {...form.getInputProps('endpoint')}
        />
        <Select
          allowDeselect={false}
          withAsterisk
          key={form.key('network')}
          data={[
            { value: ClusterNetwork.Custom, label: 'Custom' },
            { value: ClusterNetwork.Devnet, label: 'Devnet' },
            { value: ClusterNetwork.Testnet, label: 'Testnet' },
            { value: ClusterNetwork.Mainnet, label: 'Mainnet' },
          ]}
          {...form.getInputProps('network')}
        />
        <Group justify="flex-end">
          <Button type="submit">Save</Button>
        </Group>
      </UiStack>
    </form>
  )
}

export function ClusterUiTable() {
  const { clusters, setCluster, deleteCluster } = useCluster()
  return (
    <div>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name / Network / Endpoint</Table.Th>
            <Table.Th align="center">Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {clusters.map((item) => (
            <Table.Tr key={item.name}>
              <Table.Td>
                <Text size="lg">
                  {item?.active ? (
                    item.name
                  ) : (
                    <Anchor component="button" title="Select cluster" onClick={() => setCluster(item)}>
                      {item.name}
                    </Anchor>
                  )}
                </Text>
                <Text size="xs">Network: {item.network ?? 'custom'}</Text>
                <div>{item.endpoint}</div>
              </Table.Td>
              <Table.Td>
                <Button
                  disabled={item?.active}
                  onClick={() => {
                    if (!window.confirm('Are you sure?')) return
                    deleteCluster(item)
                  }}
                >
                  <IconTrash size={16} />
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  )
}
