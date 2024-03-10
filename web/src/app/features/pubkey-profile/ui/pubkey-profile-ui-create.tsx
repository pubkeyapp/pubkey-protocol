import { Button } from '@mantine/core'
import { usePubkeyProfileProgram } from '../data-access'
import { useKeypair } from '../../keypair/data-access'
import { sampleSundeep } from '../data-access/pubkey-profile.types'

export function PubkeyProfileUiCreate() {
  const { createProfile } = usePubkeyProfileProgram()
  const { keypair } = useKeypair()

  return (
    <Button
      loading={createProfile.isPending}
      variant="light"
      onClick={() =>
        createProfile.mutateAsync({
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
