import { Badge, Button } from '@mantine/core'
import { modals } from '@mantine/modals'
import { toastError, toastSuccess } from '@pubkey-ui/core'
import { useWallet } from '@solana/wallet-adapter-react'
import { Keypair } from '@solana/web3.js'
import { useKeypair } from '../../keypair/data-access'
import { usePubkeyProfileProgram } from '../data-access'
import { PubKeyProfileUiCreateForm } from './pub-key-profile-ui-create-form'

export interface PubKeyProfileCreateInput {
  avatarUrl: string
  username: string
}

export function PubkeyProfileUiCreate() {
  const { createProfile } = usePubkeyProfileProgram()
  const { keypair } = useKeypair()
  const { publicKey } = useWallet()

  if (!publicKey) {
    return (
      <Badge variant="outline" color="red">
        Connect Wallet
      </Badge>
    )
  }

  if (!keypair.solana) {
    return (
      <Badge variant="outline" color="red">
        Add Keypair
      </Badge>
    )
  }

  return (
    <Button
      loading={createProfile.isPending}
      variant="light"
      onClick={() =>
        modals.open({
          centered: true,
          title: 'Create Profile',
          children: (
            <PubKeyProfileUiCreateForm
              submit={async ({ avatarUrl, username }) => {
                return createProfile
                  .mutateAsync({
                    authority: publicKey,
                    feePayer: keypair.solana as Keypair,
                    avatarUrl,
                    username,
                  })
                  .then(() => toastSuccess(`Profile created`))
                  .catch((err) => toastError(`Error: ${err}`))
              }}
            />
          ),
        })
      }
    >
      Create
    </Button>
  )
}
