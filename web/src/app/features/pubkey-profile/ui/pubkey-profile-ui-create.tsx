import { Button } from '@mantine/core'
import { useWallet } from '@solana/wallet-adapter-react'
import { useKeypair } from '../../keypair/data-access'
import { usePubkeyProfileProgram } from '../data-access'
import { sampleSundeep } from '../data-access/pubkey-profile.types'

export function PubkeyProfileUiCreate() {
  const { createProfile } = usePubkeyProfileProgram()
  const { keypair } = useKeypair()
  const { publicKey } = useWallet()

  return (
    <Button
      loading={createProfile.isPending}
      variant="light"
      onClick={() =>
        createProfile.mutateAsync({
          authority: publicKey!,
          feePayer: keypair.solana!,
          avatarUrl: sampleSundeep.avatarUrl,
          username: sampleSundeep.username,
        })
      }
    >
      Create
    </Button>
  )
}
