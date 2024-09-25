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
      signature: await provider.connection.requestAirdrop(authority.publicKey, LAMPORTS_PER_SOL),
    })
  })

  describe('Profile', () => {
    it('Create PubkeyProfile', async () => {
      const username = 'alice'
      const [profile, bump] = getPubKeyProfilePda({ username: 'alice', programId: program.programId })
      const [pointer, bumpPointer] = getPubKeyPointerPda({
        programId: program.programId,
        provider: PubKeyIdentityProvider.Solana,
        providerId: authority.publicKey.toString(),
      })

      await program.methods
        .createProfile({
          avatarUrl: 'https://avatars.githubusercontent.com/u/32637757?v=4',
          name: 'Test Profile',
          username,
        })
        .accountsStrict({
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

      expect(postBalance).toStrictEqual(LAMPORTS_PER_SOL)
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

    it('Update profile details', async () => {
      const [profile] = getPubKeyProfilePda({ username: 'alice', programId: program.programId })
      const input = {
        authority: authority.publicKey,
        newName: 'Test Profile',
        newAvatarUrl: 'https://avatars.githubusercontent.com/u/36491?v=4',
      }
      await program.methods
        .updateProfileDetails(input)
        .accounts({
          profile,
          feePayer: feePayer.publicKey,
        })
        .rpc()

      const { avatarUrl: newAvatarUrl, name: newName } = await program.account.profile.fetch(profile)
      expect(newAvatarUrl).toStrictEqual(input.newAvatarUrl)
      expect(newName).toStrictEqual(input.newName)
    })

    it('Add Authority', async () => {
      const [profile] = getPubKeyProfilePda({ username: 'alice', programId: program.programId })

      await program.methods
        .addProfileAuthority({ newAuthority: authority2.publicKey })
        .accountsStrict({
          profile,
          authority: authority.publicKey,
          feePayer: feePayer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([authority])
        .rpc()

      const { authorities } = await program.account.profile.fetch(profile)

      const postBalance = await provider.connection.getBalance(authority.publicKey)

      expect(postBalance).toStrictEqual(LAMPORTS_PER_SOL)
      expect(authorities.length).toStrictEqual(2)
    })

    it('Remove Authority', async () => {
      const [profile] = getPubKeyProfilePda({ username: 'alice', programId: program.programId })

      await program.methods
        .removeAuthority({ authorityToRemove: authority2.publicKey })
        .accountsStrict({ profile, authority: authority.publicKey, feePayer: feePayer.publicKey })
        .signers([authority])
        .rpc()

      const { authorities } = await program.account.profile.fetch(profile)

      expect(authorities).toEqual([authority.publicKey])
    })

    it('Add Identity', async () => {
      const [profile] = getPubKeyProfilePda({ username: 'alice', programId: program.programId })
      const [pointer, bump] = getPubKeyPointerPda({
        programId: program.programId,
        providerId: 'alice-discord-id-123',
        provider: PubKeyIdentityProvider.Discord,
      })
      const input = {
        providerId: 'alice-discord-id-123',
        provider: { discord: {} },
        nickname: 'alice_discord',
      }
      await program.methods
        .addIdentity(input)
        .accountsStrict({
          authority: authority.publicKey,
          feePayer: feePayer.publicKey,
          pointer,
          profile,
          systemProgram: SystemProgram.programId,
        })
        .signers([authority])
        .rpc()

      const { identities } = await program.account.profile.fetch(profile)
      const pointerData = await program.account.pointer.fetch(pointer)

      const postBalance = await provider.connection.getBalance(authority.publicKey)

      expect(postBalance).toStrictEqual(LAMPORTS_PER_SOL)
      expect(identities).toEqual([
        {
          provider: { solana: {} },
          providerId: authority.publicKey.toString(),
          name: 'Primary Wallet',
        },
        {
          provider: { discord: {} },
          providerId: input.providerId,
          name: input.nickname,
        },
      ])

      expect(pointerData.bump).toStrictEqual(bump)
      expect(pointerData.providerId).toStrictEqual(input.providerId)
      expect(pointerData.provider).toStrictEqual({ discord: {} })
      expect(pointerData.profile).toStrictEqual(profile)
    })

    it('Remove Identity', async () => {
      const [profile] = getPubKeyProfilePda({ username: 'alice', programId: program.programId })
      const [pointer] = getPubKeyPointerPda({
        programId: program.programId,
        providerId: 'alice-discord-id-123',
        provider: PubKeyIdentityProvider.Discord,
      })

      await program.methods
        .removeIdentity({ providerId: 'alice-discord-id-123' })
        .accountsStrict({
          authority: authority.publicKey,
          feePayer: feePayer.publicKey,
          pointer,
          profile,
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

  xdescribe('Community', () => {
    it('Create Community', async () => {
      const slug = 'pubkey_test'
      const [community] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('pubkey_profile'), Buffer.from('community'), Buffer.from(slug)],
        program.programId,
      )
      const [pointer] = getPubKeyPointerPda({
        programId: program.programId,
        provider: PubKeyIdentityProvider.Solana,
        providerId: authority.publicKey.toString(),
      })

      await program.methods
        .createCommunity({
          slug,
          name: 'Test Community',
          avatarUrl: 'https://example.com/avatar.png',
          discord: 'https://discord.gg/testcommunity',
          github: 'https://github.com/testcommunity',
          website: 'https://testcommunity.com',
          x: 'https://x.com/testcommunity',
        })
        .accountsStrict({
          community,
          pointer,
          authority: authority.publicKey,
          feePayer: feePayer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([authority])
        .rpc()

      const communityAccount = await program.account.community.fetch(community)
      console.log('communityAccount', communityAccount)
      expect(communityAccount.slug).toEqual(slug)
      expect(communityAccount.name).toEqual('Test Community')
      expect(communityAccount.avatarUrl).toEqual('https://example.com/avatar.png')
      expect(communityAccount.x).toEqual('https://x.com/testcommunity')
      expect(communityAccount.discord).toEqual('https://discord.gg/testcommunity')
      expect(communityAccount.github).toEqual('https://github.com/testcommunity')
      expect(communityAccount.website).toEqual('https://testcommunity.com')
      expect(communityAccount.authority).toEqual(authority.publicKey)
    })

    it('Update Community Details', async () => {
      const slug = 'test-community'
      const [community] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('pubkey_profile'), Buffer.from('community'), Buffer.from(slug)],
        program.programId,
      )

      await program.methods
        .updateCommunityDetails({
          name: 'Updated Test Community',
          avatarUrl: 'https://example.com/new-avatar.png',
          x: 'https://x.com/updatedtestcommunity',
          discord: 'https://discord.gg/updatedtestcommunity',
          github: 'https://github.com/updatedtestcommunity',
          website: 'https://updatedtestcommunity.com',
        })
        .accounts({
          community,
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc()

      const updatedCommunity = await program.account.community.fetch(community)
      expect(updatedCommunity.name).toEqual('Updated Test Community')
      expect(updatedCommunity.avatarUrl).toEqual('https://example.com/new-avatar.png')
      expect(updatedCommunity.x).toEqual('https://x.com/updatedtestcommunity')
      expect(updatedCommunity.discord).toEqual('https://discord.gg/updatedtestcommunity')
      expect(updatedCommunity.github).toEqual('https://github.com/updatedtestcommunity')
      expect(updatedCommunity.website).toEqual('https://updatedtestcommunity.com')
    })

    it('Update Community Fee Payers', async () => {
      const slug = 'test-community'
      const [community] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('pubkey_profile'), Buffer.from('community'), Buffer.from(slug)],
        program.programId,
      )

      const newFeePayer = Keypair.generate().publicKey

      await program.methods
        .updateCommunityFeepayers({ newFeePayers: [feePayer.publicKey, newFeePayer] })
        .accounts({
          community,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([authority])
        .rpc()

      const updatedCommunity = await program.account.community.fetch(community)
      expect(updatedCommunity.feePayers).toEqual(expect.arrayContaining([feePayer.publicKey, newFeePayer]))
    })

    it('Initiate Update Community Authority', async () => {
      const slug = 'test-community'
      const [community] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('pubkey_profile'), Buffer.from('community'), Buffer.from(slug)],
        program.programId,
      )

      const newAuthority = Keypair.generate().publicKey

      await program.methods
        .initiateUpdateCommunityAuthority({
          newAuthority,
        })
        .accounts({
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc()

      const updatedCommunity = await program.account.community.fetch(community)
      expect(updatedCommunity.pendingAuthority).toEqual(newAuthority)
    })

    it('Finalize Update Community Authority', async () => {
      const slug = 'test-community'
      const [community] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('pubkey_profile'), Buffer.from('community'), Buffer.from(slug)],
        program.programId,
      )

      const newAuthority = Keypair.generate()

      // First, initiate the authority update
      await program.methods
        .initiateUpdateCommunityAuthority({
          newAuthority: newAuthority.publicKey,
        })
        .accounts({
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc()

      // Then, finalize the authority update
      await program.methods
        .finalizeUpdateCommunityAuthority()
        .accounts({ newAuthority: newAuthority.publicKey })
        .signers([newAuthority])
        .rpc()

      const updatedCommunity = await program.account.community.fetch(community)
      expect(updatedCommunity.authority).toEqual(newAuthority.publicKey)
      expect(updatedCommunity.pendingAuthority).toBeNull()
    })

    it('Cancel Update Community Authority', async () => {
      const slug = 'test-community'
      const [community] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('pubkey_profile'), Buffer.from('community'), Buffer.from(slug)],
        program.programId,
      )

      const newAuthority = Keypair.generate().publicKey

      // First, initiate the authority update
      await program.methods
        .initiateUpdateCommunityAuthority({
          newAuthority,
        })
        .accounts({ authority: authority.publicKey })
        .signers([authority])
        .rpc()

      // Then, cancel the authority update
      await program.methods
        .cancelUpdateCommunityAuthority()
        .accounts({ authority: authority.publicKey })
        .signers([authority])
        .rpc()

      const updatedCommunity = await program.account.community.fetch(community)
      expect(updatedCommunity.authority).toEqual(authority.publicKey)
      expect(updatedCommunity.pendingAuthority).toBeNull()
    })
  })
})
