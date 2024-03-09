import { Button, Group, Menu, Modal, Text, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { UiStack, UiWarning } from '@pubkey-ui/core'

import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { IconUserOff, IconWallet, IconWalletOff } from '@tabler/icons-react'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetBalance, useRequestAirdrop } from '../../../account/account-data-access'
import { useCluster } from '../../../cluster/cluster-data-access'

import { formatAmount, useKeypair } from '../../data-access'

export function KeypairChecker() {
  const { keypair } = useKeypair()
  if (!keypair.solana?.publicKey) {
    return null
  }
  return <KeypairBalanceCheck address={keypair.solana.publicKey} />
}
export function KeypairBalanceCheck({ address }: { address: PublicKey }) {
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
        title="Keypair not found"
        icon={<IconUserOff size={24} />}
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

export function KeypairUiModal() {
  const { importKeypair } = useKeypair()
  const [opened, { close, open }] = useDisclosure(false)
  const [secret, setSecret] = useState('')

  return (
    <>
      <Button onClick={open}>Add Keypair</Button>
      <Modal opened={opened} onClose={close} title="Add Keypair">
        <UiStack>
          <TextInput type="text" placeholder="Name" value={secret} onChange={(e) => setSecret(e.target.value)} />

          <Group justify="end">
            <Button
              onClick={() => {
                importKeypair(secret)
                close()
              }}
            >
              Save
            </Button>
          </Group>
        </UiStack>
      </Modal>
    </>
  )
}

export function KeypairUiSelect() {
  const { keypairs, setKeypair, keypair } = useKeypair()

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button variant="light">{keypair.name}</Button>
      </Menu.Target>

      <Menu.Dropdown>
        {keypairs.map((item) => (
          <Menu.Item
            key={item.name}
            onClick={() => setKeypair(item)}
            leftSection={item.active ? <IconWallet /> : <IconWalletOff />}
          >
            {item.name}
          </Menu.Item>
        ))}
        <Menu.Divider />
        <Menu.Item component={Link} to="/keypairs">
          Manage Keypairs
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
export function KeypairUiBalance() {
  const { keypair } = useKeypair()

  return keypair.publicKey ? (
    <Button variant="light" component={Link} to={`/account/${keypair.publicKey}`}>
      <KeypairSelectLabel address={keypair.publicKey} />
    </Button>
  ) : null
}

function KeypairSelectLabel({ address }: { address: string }) {
  const query = useGetBalance({ address: new PublicKey(address) })
  const value = query.isLoading ? '...' : query.data ? formatAmount(query.data / LAMPORTS_PER_SOL, 5) : '?'

  return `${value} SOL`
}
