import { Badge, Button } from '@mantine/core'
import { modals } from '@mantine/modals'
import { toastError, toastSuccess } from '@pubkey-ui/core'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useKeypair } from '../../keypair/data-access'
import { usePubkeyProfileProgram } from '../data-access'
import { PubkeyProfileUiCreateForm } from './pubkey-profile-ui-create-form'

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
            <PubkeyProfileUiCreateForm
              submit={async ({ avatarUrl, username }) => {
                return createProfile
                  .mutateAsync({
                    authority: publicKey,
                    feePayer: keypair.solana?.publicKey as PublicKey,
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
