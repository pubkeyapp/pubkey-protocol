import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, SystemProgram } from '@solana/web3.js'
import { convertToAnchorIdentityProvider, IdentityProvider } from '../src'
import { PubkeyProtocol } from '../target/types/pubkey_protocol'
import { createTestCommunity } from './utils'
import { airdropAccounts } from './utils/airdropper'
import { getCommunityAvatarUrl } from './utils/get-avatar-url'
import { unique } from './utils/unique'

describe('pubkey-protocol-community', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const feePayer = provider.wallet as anchor.Wallet
  const program = anchor.workspace.PubkeyProtocol as Program<PubkeyProtocol>

  const communityAuthority = Keypair.generate()
  const communityAuthority2 = Keypair.generate()

  beforeAll(async () => {
    await airdropAccounts(provider, [
      { label: 'communityAuthority', publicKey: communityAuthority.publicKey },
      { label: 'communityAuthority2', publicKey: communityAuthority2.publicKey },
    ])
  })

  describe('create and update', () => {
    let communityPDA: anchor.web3.PublicKey
    const slug = unique('acme')

    beforeAll(async () => {
      communityPDA = await createTestCommunity(slug, program, communityAuthority, feePayer.publicKey)
    })

    it('should create a community', async () => {
      const communityAccount = await program.account.community.fetch(communityPDA)

      expect(communityAccount.slug).toEqual(slug)
      expect(communityAccount.name).toEqual('Test Community')
      expect(communityAccount.avatarUrl).toEqual(getCommunityAvatarUrl(slug))
      expect(communityAccount.authority).toEqual(communityAuthority.publicKey)
      expect(communityAccount.pendingAuthority).toBeNull()
      expect(communityAccount.providers).toContainEqual(convertToAnchorIdentityProvider(IdentityProvider.Solana))
      expect(communityAccount.discord).toBeNull()
      expect(communityAccount.farcaster).toBeNull()
      expect(communityAccount.github).toBeNull()
      expect(communityAccount.telegram).toBeNull()
      expect(communityAccount.website).toBeNull()
      expect(communityAccount.x).toBeNull()
    })

    it('should update community details', async () => {
      const input = {
        avatarUrl: getCommunityAvatarUrl(`${slug}_new`),
        name: 'Updated Test Community',
        discord: 'https://discord.gg/users/test',
        farcaster: 'https://warpcast.com/test',
        github: 'https://github.com/test',
        telegram: 'https://t.me/test',
        website: 'https://test.com',
        x: 'https://x.com/test',
      }
      await program.methods
        .updateCommunityDetails(input)
        .accounts({
          community: communityPDA,
          authority: communityAuthority.publicKey,
        })
        .signers([communityAuthority])
        .rpc()

      const updatedCommunity = await program.account.community.fetch(communityPDA)
      expect(updatedCommunity.name).toEqual(input.name)
      expect(updatedCommunity.discord).toEqual(input.discord)
      expect(updatedCommunity.farcaster).toEqual(input.farcaster)
      expect(updatedCommunity.github).toEqual(input.github)
      expect(updatedCommunity.telegram).toEqual(input.telegram)
      expect(updatedCommunity.website).toEqual(input.website)
      expect(updatedCommunity.x).toEqual(input.x)
      expect(updatedCommunity.avatarUrl).toEqual(input.avatarUrl)
    })
  })

  describe('Fee payers', () => {
    let communityPDA: anchor.web3.PublicKey

    beforeEach(async () => {
      communityPDA = await createTestCommunity(unique('acme'), program, communityAuthority, feePayer.publicKey)
    })

    it('should update community fee payers', async () => {
      await program.methods
        .updateCommunityFeepayers({ newFeePayers: [feePayer.publicKey, communityAuthority2.publicKey] })
        .accounts({
          community: communityPDA,
          authority: communityAuthority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([communityAuthority])
        .rpc()

      const updatedCommunity = await program.account.community.fetch(communityPDA)
      expect(updatedCommunity.feePayers).toEqual(
        expect.arrayContaining([feePayer.publicKey, communityAuthority2.publicKey]),
      )
    })
  })

  describe('Providers', () => {
    let communityPDA: anchor.web3.PublicKey
    beforeEach(async () => {
      communityPDA = await createTestCommunity(unique('acme'), program, communityAuthority, feePayer.publicKey)
    })

    it('should add a provider to a community', async () => {
      const providerToAdd = IdentityProvider.Discord
      const communityBefore = await program.account.community.fetch(communityPDA)
      expect(communityBefore.providers).not.toContain(providerToAdd)

      // Call the add_community_provider instruction
      await program.methods
        .addCommunityProvider({
          provider: convertToAnchorIdentityProvider(providerToAdd),
        })
        .accountsStrict({
          community: communityPDA,
          authority: communityAuthority.publicKey,
          feePayer: feePayer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([communityAuthority])
        .rpc()

      const communityAfter = await program.account.community.fetch(communityPDA)
      expect(communityAfter.providers).toContainEqual(convertToAnchorIdentityProvider(IdentityProvider.Solana))
      expect(communityAfter.providers).toContainEqual(convertToAnchorIdentityProvider(providerToAdd))
      expect(communityAfter.providers.length).toBe(communityBefore.providers.length + 1)
    })

    it('should not add the same provider twice', async () => {
      const providerToAdd = IdentityProvider.Discord

      // Call the add_community_provider instruction
      await program.methods
        .addCommunityProvider({
          provider: convertToAnchorIdentityProvider(providerToAdd),
        })
        .accountsStrict({
          community: communityPDA,
          authority: communityAuthority.publicKey,
          feePayer: feePayer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([communityAuthority])
        .rpc()

      const communityAfter = await program.account.community.fetch(communityPDA)

      // Try to add the same provider again (should fail)
      try {
        await program.methods
          .addCommunityProvider({
            provider: convertToAnchorIdentityProvider(providerToAdd),
          })
          .accountsStrict({
            community: communityPDA,
            authority: communityAuthority.publicKey,
            feePayer: feePayer.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([communityAuthority])
          .rpc()

        expect(true).toBe(false)
      } catch (error) {
        expect(error.error.errorCode.code).toBe('ProviderAlreadyExists')
      }

      const communityFinal = await program.account.community.fetch(communityPDA)
      expect(communityFinal.providers.length).toBe(communityAfter.providers.length)
    })
  })

  describe('Authorities', () => {
    let communityPDA: anchor.web3.PublicKey

    beforeEach(async () => {
      communityPDA = await createTestCommunity(unique('acme'), program, communityAuthority, feePayer.publicKey)
    })

    it('should initiate an authority update', async () => {
      await program.methods
        .initiateUpdateCommunityAuthority({
          newAuthority: communityAuthority2.publicKey,
        })
        .accountsStrict({
          community: communityPDA,
          authority: communityAuthority.publicKey,
        })
        .signers([communityAuthority])
        .rpc()

      const updatedCommunity = await program.account.community.fetch(communityPDA)
      expect(updatedCommunity.pendingAuthority).toEqual(communityAuthority2.publicKey)
    })

    it('should finalize an authority update', async () => {
      // First, initiate the authority update
      await program.methods
        .initiateUpdateCommunityAuthority({
          newAuthority: communityAuthority2.publicKey,
        })
        .accountsStrict({
          community: communityPDA,
          authority: communityAuthority.publicKey,
        })
        .signers([communityAuthority])
        .rpc()

      // Then, finalize the authority update
      await program.methods
        .finalizeUpdateCommunityAuthority()
        .accountsStrict({
          community: communityPDA,
          newAuthority: communityAuthority2.publicKey,
        })
        .signers([communityAuthority2])
        .rpc()

      const updatedCommunity = await program.account.community.fetch(communityPDA)
      expect(updatedCommunity.authority).toEqual(communityAuthority2.publicKey)
      expect(updatedCommunity.pendingAuthority).toBeNull()
    })

    it('should cancel an authority update', async () => {
      const newAuthority = Keypair.generate().publicKey

      // First, initiate the authority update
      await program.methods
        .initiateUpdateCommunityAuthority({
          newAuthority,
        })
        .accountsStrict({
          community: communityPDA,
          authority: communityAuthority.publicKey,
        })
        .signers([communityAuthority])
        .rpc()

      // Then, cancel the authority update
      await program.methods
        .cancelUpdateCommunityAuthority()
        .accountsStrict({
          community: communityPDA,
          authority: communityAuthority.publicKey,
        })
        .signers([communityAuthority])
        .rpc()

      const updatedCommunity = await program.account.community.fetch(communityPDA)
      expect(updatedCommunity.authority).toEqual(communityAuthority.publicKey)
      expect(updatedCommunity.pendingAuthority).toBeNull()
    })
  })
})
