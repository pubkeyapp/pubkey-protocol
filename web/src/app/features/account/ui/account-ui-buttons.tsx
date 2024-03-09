import { Button, ButtonProps, Group, Modal, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useState } from 'react'
import { useCluster } from '../../cluster/cluster-data-access'
import { useRequestAirdrop, useTransferSol } from '../account-data-access'

export function AccountUiButtons({ address }: { address: PublicKey }) {
  const wallet = useWallet()
  const { cluster } = useCluster()

  return (
    <Group gap={2}>
      <ModalAirdrop disabled={cluster.network?.includes('mainnet')} address={address} />
      <ModalSend disabled={wallet.publicKey?.toString() !== address.toString()} address={address} />
      <ModalReceive address={address} />
    </Group>
  )
}

function ModalReceive({ address, ...props }: { address: PublicKey }) {
  const [opened, { close, open }] = useDisclosure(false)

  return (
    <>
      <Button onClick={open} {...props}>
        Receive
      </Button>
      <Modal opened={opened} onClose={close} title="Receive">
        <p>You can receive assets by sending them to your public key:</p>
        <code>{address.toString()}</code>
      </Modal>
    </>
  )
}

function ModalAirdrop({ address, ...props }: ButtonProps & { address: PublicKey }) {
  const [opened, { close, open }] = useDisclosure(false)
  const mutation = useRequestAirdrop({ address })
  const [amount, setAmount] = useState('2')

  return (
    <>
      <Button onClick={open} {...props}>
        Airdrop
      </Button>
      <Modal opened={opened} onClose={close} title="Airdrop">
        <TextInput
          disabled={mutation.isPending}
          type="number"
          step="any"
          min="0"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button
          disabled={!amount || mutation.isPending}
          onClick={() => {
            mutation.mutateAsync(amount).then(() => close())
          }}
        >
          Request Airdrop
        </Button>
      </Modal>
    </>
  )
}

function ModalSend({ address, ...props }: ButtonProps & { address: PublicKey }) {
  const [opened, { close, open }] = useDisclosure(false)
  const wallet = useWallet()
  const mutation = useTransferSol({ address })
  const [destination, setDestination] = useState('')
  const [amount, setAmount] = useState('1')

  if (!address || !wallet.sendTransaction) {
    return <div>Wallet not connected</div>
  }

  return (
    <>
      <Button onClick={open} {...props}>
        Send
      </Button>
      <Modal opened={opened} onClose={close} title="Send">
        <TextInput
          disabled={mutation.isPending}
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <TextInput
          disabled={mutation.isPending}
          type="number"
          step="any"
          min="0"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button
          disabled={!destination || !amount || mutation.isPending}
          onClick={() => {
            mutation
              .mutateAsync({
                destination: new PublicKey(destination),
                amount,
              })
              .then(() => close())
          }}
        >
          Send
        </Button>
      </Modal>
    </>
  )
}
