import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { PubkeyProtocol } from '../target/types/pubkey_protocol'
import { createOrGetTestConfig } from './utils'

describe('pubkey-protocol-config', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const feePayer = provider.wallet as anchor.Wallet
  const program = anchor.workspace.PubkeyProtocol as Program<PubkeyProtocol>

  describe('initialize config', () => {
    it('should create a community', async () => {
      const res = await createOrGetTestConfig(program, feePayer.publicKey)
      const config = await program.account.config.fetch(res.config)

      expect(config.communityAuthority).toEqual(feePayer.publicKey)
      expect(config.configAuthority).toEqual(feePayer.publicKey)
    })
  })
})
