import * as anchor from '@coral-xyz/anchor'
import { getPubKeyConfigPda, PubkeyProtocol } from '../../src'

export async function getConfig(program: anchor.Program<PubkeyProtocol>) {
  const [config] = getPubKeyConfigPda({ programId: program.programId })

  const account = await program.account.config.fetchNullable(config)

  return { config, account }
}
