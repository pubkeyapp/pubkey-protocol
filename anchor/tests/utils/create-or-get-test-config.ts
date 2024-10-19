import * as anchor from '@coral-xyz/anchor'
import { getPubKeyConfigPda, PubkeyProtocol } from '../../src'
import { getConfig } from './get-config'

export async function createOrGetTestConfig(program: anchor.Program<PubkeyProtocol>, authority: anchor.web3.PublicKey) {
  const existing = await getConfig(program)
  if (existing.account) {
    // console.log('Using existing config')
    return existing
  }
  try {
    const [config] = getPubKeyConfigPda({ programId: program.programId })

    await program.methods
      .configInit({
        communityAuthority: authority,
      })
      .accounts({ authority })
      .rpc()

    // console.log(`Created config with authority ${authority.toString()}`)
    const account = await getConfig(program)
    // console.log(`Config account ${config.toString()}`, account)
    return { config, account }
  } catch (error) {
    console.error('Error creating test community:', error)
    throw error
  }
}
