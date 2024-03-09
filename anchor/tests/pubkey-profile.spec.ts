import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { PubkeyProfile } from "../target/types/pubkey_profile";

describe("pubkey-profile", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.PubkeyProfile as Program<PubkeyProfile>;

  const pubkeyProfileKeypair = Keypair.generate()

  it('Initialize PubkeyProfile', async () => {
    await program.methods
      .initialize()
      .accounts({
        pubkeyProfile: pubkeyProfileKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([pubkeyProfileKeypair])
      .rpc()

    const currentCount = await program.account.pubkeyProfile.fetch(pubkeyProfileKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment PubkeyProfile', async () => {
    await program.methods.increment().accounts({ pubkeyProfile: pubkeyProfileKeypair.publicKey }).rpc()

    const currentCount = await program.account.pubkeyProfile.fetch(pubkeyProfileKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment PubkeyProfile Again', async () => {
    await program.methods.increment().accounts({ pubkeyProfile: pubkeyProfileKeypair.publicKey }).rpc()

    const currentCount = await program.account.pubkeyProfile.fetch(pubkeyProfileKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement PubkeyProfile', async () => {
    await program.methods.decrement().accounts({ pubkeyProfile: pubkeyProfileKeypair.publicKey }).rpc()

    const currentCount = await program.account.pubkeyProfile.fetch(pubkeyProfileKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set pubkeyProfile value', async () => {
    await program.methods.set(42).accounts({ pubkeyProfile: pubkeyProfileKeypair.publicKey }).rpc()

    const currentCount = await program.account.pubkeyProfile.fetch(pubkeyProfileKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the pubkeyProfile account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        pubkeyProfile: pubkeyProfileKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.pubkeyProfile.fetchNullable(pubkeyProfileKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
