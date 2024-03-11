import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js'
import { getPubKeyPointerPda, getPubKeyProfilePda, PubKeyIdentityProvider } from '../src'
import { PubkeyProfile } from '../target/types/pubkey_profile'

describe('pubkey-profile', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const feePayer = provider.wallet as anchor.Wallet
  const program = anchor.workspace.PubkeyProfile as Program<PubkeyProfile>

  const authority = Keypair.generate()
  const authority2 = Keypair.generate()

  beforeAll(async () => {
    console.log('Airdropping authority 1 SOL:', authority.publicKey.toString())
    await provider.connection.confirmTransaction({
      ...(await provider.connection.getLatestBlockhash('confirmed')),
      signature: await provider.connection.requestAirdrop(authority.publicKey, 1 * LAMPORTS_PER_SOL),
    })
  })

  it('Create PubkeyProfile', async () => {
    const username = 'sunguru98'
    const [profile, bump] = getPubKeyProfilePda({ username: 'sunguru98', programId: program.programId })
    const [pointer, bumpPointer] = getPubKeyPointerPda({
      programId: program.programId,
      provider: PubKeyIdentityProvider.Solana,
      providerId: authority.publicKey.toString(),
    })

    await program.methods
      .createProfile({
        avatarUrl: 'https://avatars.githubusercontent.com/u/32637757?v=4',
        username,
      })
      .accounts({
        authority: authority.publicKey,
        feePayer: feePayer.publicKey,
        profile,
        pointer,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc()

    const {
      authorities,
      identities,
      avatarUrl,
      bump: receivedBump,
      feePayer: receivedFeePayer,
      username: receivedUsername,
    } = await program.account.profile.fetch(profile)

    const pointerData = await program.account.pointer.fetch(pointer)

    const postBalance = await provider.connection.getBalance(authority.publicKey)

    expect(postBalance).toStrictEqual(1 * LAMPORTS_PER_SOL)
    expect(receivedBump).toStrictEqual(bump)
    expect(receivedUsername).toStrictEqual(username)
    expect(avatarUrl).toStrictEqual('https://avatars.githubusercontent.com/u/32637757?v=4')
    expect(authorities).toEqual([authority.publicKey])
    expect(receivedFeePayer).toStrictEqual(feePayer.publicKey)

    expect(identities).toEqual([
      {
        provider: { solana: {} },
        providerId: authority.publicKey.toString(),
        name: 'Primary Wallet',
      },
    ])
    expect(pointerData.bump).toStrictEqual(bumpPointer)
    expect(pointerData.providerId).toStrictEqual(authority.publicKey.toString())
    expect(pointerData.provider).toStrictEqual({ solana: {} })
    expect(pointerData.profile).toStrictEqual(profile)
  })

  it('Update avatarUrl', async () => {
    const [profile] = getPubKeyProfilePda({ username: 'sunguru98', programId: program.programId })

    await program.methods
      .updateAvatarUrl({
        authority: authority.publicKey,
        newAvatarUrl: 'https://avatars.githubusercontent.com/u/36491?v=4',
      })
      .accounts({
        profile,
        feePayer: feePayer.publicKey,
      })
      .rpc()

    const { avatarUrl: newAvatarUrl } = await program.account.profile.fetch(profile)
    expect(newAvatarUrl).toStrictEqual('https://avatars.githubusercontent.com/u/36491?v=4')
  })

  it('Add Authority', async () => {
    const [profile] = getPubKeyProfilePda({ username: 'sunguru98', programId: program.programId })

    await program.methods
      .addAuthority({ newAuthority: authority2.publicKey })
      .accounts({ profile, authority: authority.publicKey, feePayer: feePayer.publicKey })
      .signers([authority])
      .rpc()

    const { authorities } = await program.account.profile.fetch(profile)

    const postBalance = await provider.connection.getBalance(authority.publicKey)

    expect(postBalance).toStrictEqual(1 * LAMPORTS_PER_SOL)
    expect(authorities.length).toStrictEqual(2)
  })

  it('Remove Authority', async () => {
    const [profile] = getPubKeyProfilePda({ username: 'sunguru98', programId: program.programId })

    await program.methods
      .removeAuthority({ authorityToRemove: authority2.publicKey })
      .accounts({ profile, authority: authority.publicKey, feePayer: feePayer.publicKey })
      .signers([authority])
      .rpc()

    const { authorities } = await program.account.profile.fetch(profile)

    expect(authorities).toEqual([authority.publicKey])
  })

  it('Add Identity', async () => {
    const [profile] = getPubKeyProfilePda({ username: 'sunguru98', programId: program.programId })
    const [pointer, bump] = getPubKeyPointerPda({
      programId: program.programId,
      providerId: 'sundeepcharan',
      provider: PubKeyIdentityProvider.Discord,
    })

    await program.methods
      .addIdentity({ providerId: 'sundeepcharan', provider: { discord: {} }, nickname: 'Primary account' })
      .accounts({
        profile,
        authority: authority.publicKey,
        feePayer: feePayer.publicKey,
        pointer,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc()

    const { identities } = await program.account.profile.fetch(profile)
    const pointerData = await program.account.pointer.fetch(pointer)

    const postBalance = await provider.connection.getBalance(authority.publicKey)

    expect(postBalance).toStrictEqual(1 * LAMPORTS_PER_SOL)
    expect(identities).toEqual([
      {
        provider: { solana: {} },
        providerId: authority.publicKey.toString(),
        name: 'Primary Wallet',
      },
      {
        provider: { discord: {} },
        providerId: 'sundeepcharan',
        name: 'Primary account',
      },
    ])

    expect(pointerData.bump).toStrictEqual(bump)
    expect(pointerData.providerId).toStrictEqual('sundeepcharan')
    expect(pointerData.provider).toStrictEqual({ discord: {} })
    expect(pointerData.profile).toStrictEqual(profile)
  })

  it('Remove Identity', async () => {
    const [profile] = getPubKeyProfilePda({ username: 'sunguru98', programId: program.programId })
    const [pointer] = getPubKeyPointerPda({
      programId: program.programId,
      providerId: 'sundeepcharan',
      provider: PubKeyIdentityProvider.Discord,
    })

    await program.methods
      .removeIdentity({ providerId: 'sundeepcharan' })
      .accounts({
        profile,
        authority: authority.publicKey,
        feePayer: feePayer.publicKey,
        pointer,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc()

    const { identities } = await program.account.profile.fetch(profile)
    const pointerData = await program.account.pointer.fetchNullable(pointer)

    expect(identities).toEqual([
      {
        provider: { solana: {} },
        providerId: authority.publicKey.toString(),
        name: 'Primary Wallet',
      },
    ])
    expect(pointerData).toBeNull()
  })
})
