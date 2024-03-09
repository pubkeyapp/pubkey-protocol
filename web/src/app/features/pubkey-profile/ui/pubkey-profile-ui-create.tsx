import { Button } from '@mantine/core'
import { Keypair } from '@solana/web3.js'
import { usePubkeyProfileProgram } from '../data-access'

export function PubkeyProfileUiCreate() {
  const { initialize } = usePubkeyProfileProgram()

  return (
    <Button loading={initialize.isPending} variant="light" onClick={() => initialize.mutateAsync(Keypair.generate())}>
      Create
    </Button>
  )
}
