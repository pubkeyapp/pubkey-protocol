import { Button } from '@mantine/core'
import { Keypair } from '@solana/web3.js'
import { usePubkeyProfileProgram } from '../data-access'

export function PubkeyProfileUiCreate() {
  const { initialize } = usePubkeyProfileProgram()

  return (
    <Button variant="light" onClick={() => initialize.mutateAsync(Keypair.generate())} disabled={initialize.isPending}>
      Create {initialize.isPending && '...'}
    </Button>
  )
}
