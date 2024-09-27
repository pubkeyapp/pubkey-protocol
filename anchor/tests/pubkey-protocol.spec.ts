import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js'
import { getPubKeyPointerPda, getPubKeyProfilePda, PubKeyIdentityProvider } from '../src'
import { PubkeyProtocol } from '../target/types/pubkey_protocol'

function unique(str: string) {
  return `${str}_${Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substring(0, 13)}`
}

function getAvatarUrl(username: string) {
  return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}`
}

describe('pubkey-protocol', () => {
  const username = unique('alice')
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const feePayer = provider.wallet as anchor.Wallet
  const program = anchor.workspace.PubkeyProtocol as Program<PubkeyProtocol>

  const communityAuthority = Keypair.generate()
  const communityAuthority2 = Keypair.generate()
  const communityMember1 = Keypair.generate()
  const communityMember2 = Keypair.generate()

  beforeAll(async () => {
    console.log('Airdropping communityAuthority 1 SOL:', communityAuthority.publicKey.toString())
    await provider.connection.confirmTransaction({
      ...(await provider.connection.getLatestBlockhash('confirmed')),
      signature: await provider.connection.requestAirdrop(communityAuthority.publicKey, LAMPORTS_PER_SOL),
    })

    console.log('Airdropping communityAuthority2 1 SOL:', communityAuthority2.publicKey.toString())
    await provider.connection.confirmTransaction({
      ...(await provider.connection.getLatestBlockhash('confirmed')),
      signature: await provider.connection.requestAirdrop(communityAuthority2.publicKey, LAMPORTS_PER_SOL),
    })

    console.log('Airdropping communityMember1 1 SOL:', communityMember1.publicKey.toString())
    await provider.connection.confirmTransaction({
      ...(await provider.connection.getLatestBlockhash('confirmed')),
      signature: await provider.connection.requestAirdrop(communityMember1.publicKey, LAMPORTS_PER_SOL),
    })

    console.log('Airdropping communityMember2 1 SOL:', communityMember2.publicKey.toString())
    await provider.connection.confirmTransaction({
      ...(await provider.connection.getLatestBlockhash('confirmed')),
      signature: await provider.connection.requestAirdrop(communityMember2.publicKey, LAMPORTS_PER_SOL),
    })
  })

  describe('Profile', () => {
    it('Create PubkeyProfile', async () => {
      const [profile, bump] = getPubKeyProfilePda({ username, programId: program.programId })
      const [pointer, bumpPointer] = getPubKeyPointerPda({
        programId: program.programId,
        provider: PubKeyIdentityProvider.Solana,
        providerId: communityMember1.publicKey.toString(),
      })

      await program.methods
        .createProfile({
          avatarUrl: getAvatarUrl(username),
          name: 'Test Profile',
          username,
        })
        .accountsStrict({
          authority: communityMember1.publicKey,
          feePayer: feePayer.publicKey,
          profile,
          pointer,
          systemProgram: SystemProgram.programId,
        })
        .signers([communityMember1])
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

      const postBalance = await provider.connection.getBalance(communityMember1.publicKey)

      expect(postBalance).toStrictEqual(LAMPORTS_PER_SOL)
      expect(receivedBump).toStrictEqual(bump)
      expect(receivedUsername).toStrictEqual(username)
      expect(avatarUrl).toStrictEqual(getAvatarUrl(username))
      expect(authorities).toEqual([communityMember1.publicKey])
      expect(receivedFeePayer).toStrictEqual(feePayer.publicKey)

      expect(identities).toEqual([
        {
          provider: { solana: {} },
          providerId: communityMember1.publicKey.toString(),
          name: 'Primary Wallet',
        },
      ])
      expect(pointerData.bump).toStrictEqual(bumpPointer)
      expect(pointerData.providerId).toStrictEqual(communityMember1.publicKey.toString())
      expect(pointerData.provider).toStrictEqual({ solana: {} })
      expect(pointerData.profile).toStrictEqual(profile)
    })

    it('Update profile details', async () => {
      const [profile] = getPubKeyProfilePda({ username, programId: program.programId })
      const input = {
        authority: communityMember1.publicKey,
        newName: 'Test Profile',
        newAvatarUrl: getAvatarUrl(`${username}_new`),
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
      const [profile] = getPubKeyProfilePda({ username, programId: program.programId })

      await program.methods
        .addProfileAuthority({ newAuthority: communityMember2.publicKey })
        .accountsStrict({
          profile,
          authority: communityMember1.publicKey,
          feePayer: feePayer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([communityMember1])
        .rpc()

      const { authorities } = await program.account.profile.fetch(profile)

      const postBalance = await provider.connection.getBalance(communityMember1.publicKey)

      expect(postBalance).toStrictEqual(LAMPORTS_PER_SOL)
      expect(authorities.length).toStrictEqual(2)
    })

    it('Remove Authority', async () => {
      const [profile] = getPubKeyProfilePda({ username, programId: program.programId })

      await program.methods
        .removeAuthority({ authorityToRemove: communityMember2.publicKey })
        .accountsStrict({ profile, authority: communityMember1.publicKey, feePayer: feePayer.publicKey })
        .signers([communityMember1])
        .rpc()

      const { authorities } = await program.account.profile.fetch(profile)

      expect(authorities).toEqual([communityMember1.publicKey])
    })

    it('Add Identity', async () => {
      const [profile] = getPubKeyProfilePda({ username, programId: program.programId })
      const [pointer, bump] = getPubKeyPointerPda({
        programId: program.programId,
        providerId: `${username}-discord-id-123`,
        provider: PubKeyIdentityProvider.Discord,
      })
      const input = {
        providerId: `${username}-discord-id-123`,
        provider: { discord: {} },
        nickname: `${username}_discord`,
      }
      await program.methods
        .addIdentity(input)
        .accountsStrict({
          authority: communityMember1.publicKey,
          feePayer: feePayer.publicKey,
          pointer,
          profile,
          systemProgram: SystemProgram.programId,
        })
        .signers([communityMember1])
        .rpc()

      const { identities } = await program.account.profile.fetch(profile)
      const pointerData = await program.account.pointer.fetch(pointer)

      const postBalance = await provider.connection.getBalance(communityMember1.publicKey)

      expect(postBalance).toStrictEqual(LAMPORTS_PER_SOL)
      expect(identities).toEqual([
        {
          provider: { solana: {} },
          providerId: communityMember1.publicKey.toString(),
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
      const [profile] = getPubKeyProfilePda({ username, programId: program.programId })
      const [pointer] = getPubKeyPointerPda({
        programId: program.programId,
        providerId: `${username}-discord-id-123`,
        provider: PubKeyIdentityProvider.Discord,
      })

      await program.methods
        .removeIdentity({ providerId: `${username}-discord-id-123` })
        .accountsStrict({
          authority: communityMember1.publicKey,
          feePayer: feePayer.publicKey,
          pointer,
          profile,
          systemProgram: SystemProgram.programId,
        })
        .signers([communityMember1])
        .rpc()

      const { identities } = await program.account.profile.fetch(profile)
      const pointerData = await program.account.pointer.fetchNullable(pointer)

      expect(identities).toEqual([
        {
          provider: { solana: {} },
          providerId: communityMember1.publicKey.toString(),
          name: 'Primary Wallet',
        },
      ])
      expect(pointerData).toBeNull()
    })
  })

  describe('Community', () => {
    let testCommunity: anchor.web3.PublicKey
    const slug = unique('test-community')
    console.log('***SLUG***', slug)

    async function createTestCommunity(slug: string) {
      const PREFIX = 'pubkey_protocol'
      const COMMUNITY = 'community'

      const [community] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(PREFIX), Buffer.from(COMMUNITY), Buffer.from(slug)],
        program.programId,
      )

      const createCommunityArgs = {
        slug,
        name: 'Test Community',
        avatarUrl: getAvatarUrl(slug),
        discord: 'https://discord.gg/testcommunity',
        farcaster: 'https://warpcast.com/testcommunity',
        github: 'https://github.com/testcommunity',
        telegram: 'https://t.me/testcommunity',
        website: 'https://testcommunity.com',
        x: 'https://x.com/testcommunity',
      }

      await program.methods
        .createCommunity(createCommunityArgs)
        .accountsStrict({
          community,
          authority: communityAuthority.publicKey,
          feePayer: feePayer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([communityAuthority])
        .rpc()

      return community
    }

    beforeAll(async () => {
      testCommunity = await createTestCommunity(slug)
    })

    it('Create Community', async () => {
      const communityAccount = await program.account.community.fetch(testCommunity)
      console.log('communityAccount', communityAccount)
      expect(communityAccount.slug).toEqual(slug)
      expect(communityAccount.name).toEqual('Test Community')
      expect(communityAccount.avatarUrl).toEqual(getAvatarUrl(slug))
      expect(communityAccount.x).toEqual('https://x.com/testcommunity')
      expect(communityAccount.discord).toEqual('https://discord.gg/testcommunity')
      expect(communityAccount.github).toEqual('https://github.com/testcommunity')
      expect(communityAccount.website).toEqual('https://testcommunity.com')
      expect(communityAccount.authority).toEqual(communityAuthority.publicKey)
    })

    it('Update Community Details', async () => {
      await program.methods
        .updateCommunityDetails({
          name: 'Updated Test Community',
          avatarUrl: 'https://example.com/new-avatar.png',
          discord: 'https://discord.gg/updatedtestcommunity',
          farcaster: 'https://warpcast.com/updatedtestcommunity',
          github: 'https://github.com/updatedtestcommunity',
          telegram: 'https://t.me/updatedtestcommunity',
          website: 'https://updatedtestcommunity.com',
          x: 'https://x.com/updatedtestcommunity',
        })
        .accounts({
          community: testCommunity,
          authority: communityAuthority.publicKey,
        })
        .signers([communityAuthority])
        .rpc()

      const updatedCommunity = await program.account.community.fetch(testCommunity)
      expect(updatedCommunity.name).toEqual('Updated Test Community')
      expect(updatedCommunity.avatarUrl).toEqual('https://example.com/new-avatar.png')
      expect(updatedCommunity.x).toEqual('https://x.com/updatedtestcommunity')
      expect(updatedCommunity.discord).toEqual('https://discord.gg/updatedtestcommunity')
      expect(updatedCommunity.github).toEqual('https://github.com/updatedtestcommunity')
      expect(updatedCommunity.website).toEqual('https://updatedtestcommunity.com')
    })

    it('Update Community Fee Payers', async () => {
      await program.methods
        .updateCommunityFeepayers({ newFeePayers: [feePayer.publicKey, communityAuthority2.publicKey] })
        .accounts({
          community: testCommunity,
          authority: communityAuthority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([communityAuthority])
        .rpc()

      const updatedCommunity = await program.account.community.fetch(testCommunity)
      expect(updatedCommunity.feePayers).toEqual(
        expect.arrayContaining([feePayer.publicKey, communityAuthority2.publicKey]),
      )
    })

    xit('Initiate Update Community Authority', async () => {
      await program.methods
        .initiateUpdateCommunityAuthority({
          newAuthority: communityAuthority2.publicKey,
        })
        .accounts({
          authority: communityAuthority.publicKey,
        })
        .signers([communityAuthority])
        .rpc()

      const updatedCommunity = await program.account.community.fetch(testCommunity)
      expect(updatedCommunity.pendingAuthority).toEqual(communityAuthority2.publicKey)
    })

    xit('Finalize Update Community Authority', async () => {
      // First, initiate the authority update
      await program.methods
        .initiateUpdateCommunityAuthority({
          newAuthority: communityAuthority2.publicKey,
        })
        .accounts({
          authority: communityAuthority.publicKey,
        })
        .signers([communityAuthority])
        .rpc()

      // Then, finalize the authority update
      await program.methods
        .finalizeUpdateCommunityAuthority()
        .accounts({
          newAuthority: communityAuthority2.publicKey,
        })
        .signers([communityAuthority2])
        .rpc()

      const updatedCommunity = await program.account.community.fetch(testCommunity)
      expect(updatedCommunity.authority).toEqual(communityAuthority2.publicKey)
      expect(updatedCommunity.pendingAuthority).toBeNull()
    })

    xit('Cancel Update Community Authority', async () => {
      const newAuthority = Keypair.generate().publicKey

      // First, initiate the authority update
      await program.methods
        .initiateUpdateCommunityAuthority({
          newAuthority,
        })
        .accounts({
          authority: communityAuthority.publicKey,
        })
        .signers([communityAuthority])
        .rpc()

      // Then, cancel the authority update
      await program.methods
        .cancelUpdateCommunityAuthority()
        .accounts({
          authority: communityAuthority.publicKey,
        })
        .signers([communityAuthority])
        .rpc()

      const updatedCommunity = await program.account.community.fetch(testCommunity)
      expect(updatedCommunity.authority).toEqual(communityAuthority.publicKey)
      expect(updatedCommunity.pendingAuthority).toBeNull()
    })
  })
})
