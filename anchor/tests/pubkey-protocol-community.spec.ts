import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js'
import { PubkeyProtocol } from '../target/types/pubkey_protocol'
import { getPubKeyPointerPda, getPubKeyProfilePda, PubKeyIdentityProvider } from '../src'
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

  describe('Community', () => {
    let testCommunity: anchor.web3.PublicKey
    const slug = unique('acme')

    async function createTestCommunity(slug: string) {
      const PREFIX = 'pubkey_protocol'
      const COMMUNITY = 'community'

      const [community] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(PREFIX), Buffer.from(COMMUNITY), Buffer.from(slug)],
        program.programId,
      )

      const createCommunityInput = {
        slug,
        name: 'Test Community',
        avatarUrl: getCommunityAvatarUrl(slug),
        discord: 'https://discord.gg/testcommunity',
        farcaster: 'https://warpcast.com/testcommunity',
        github: 'https://github.com/testcommunity',
        telegram: 'https://t.me/testcommunity',
        website: 'https://testcommunity.com',
        x: 'https://x.com/testcommunity',
      }

      await program.methods
        .createCommunity(createCommunityInput)
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

      expect(communityAccount.slug).toEqual(slug)
      expect(communityAccount.name).toEqual('Test Community')
      expect(communityAccount.avatarUrl).toEqual(getCommunityAvatarUrl(slug))
      expect(communityAccount.x).toEqual('https://x.com/testcommunity')
      expect(communityAccount.discord).toEqual('https://discord.gg/testcommunity')
      expect(communityAccount.github).toEqual('https://github.com/testcommunity')
      expect(communityAccount.website).toEqual('https://testcommunity.com')
      expect(communityAccount.authority).toEqual(communityAuthority.publicKey)
    })

    it('Update Community Details', async () => {
      const input = {
        name: 'Updated Test Community',
        avatarUrl: getCommunityAvatarUrl(`${slug}_new`),
        discord: 'https://discord.gg/updatedtestcommunity',
        farcaster: 'https://warpcast.com/updatedtestcommunity',
        github: 'https://github.com/updatedtestcommunity',
        telegram: 'https://t.me/updatedtestcommunity',
        website: 'https://updatedtestcommunity.com',
        x: 'https://x.com/updatedtestcommunity',
      }
      await program.methods
        .updateCommunityDetails(input)
        .accounts({
          community: testCommunity,
          authority: communityAuthority.publicKey,
        })
        .signers([communityAuthority])
        .rpc()

      const updatedCommunity = await program.account.community.fetch(testCommunity)
      expect(updatedCommunity.name).toEqual(input.name)
      expect(updatedCommunity.avatarUrl).toEqual(input.avatarUrl)
      expect(updatedCommunity.x).toEqual(input.x)
      expect(updatedCommunity.discord).toEqual(input.discord)
      expect(updatedCommunity.github).toEqual(input.github)
      expect(updatedCommunity.website).toEqual(input.website)
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

    describe('Community Profile Verification', () => {
      let testProfile: anchor.web3.PublicKey
      const profileUsername = unique('user')
      const profileOwner = Keypair.generate()

      beforeAll(async () => {
        await provider.connection.requestAirdrop(profileOwner.publicKey, LAMPORTS_PER_SOL)

        const [profile] = getPubKeyProfilePda({ username: profileUsername, programId: program.programId })
        const [pointer] = getPubKeyPointerPda({
          programId: program.programId,
          provider: PubKeyIdentityProvider.Solana,
          providerId: profileOwner.publicKey.toString(),
        })

        await program.methods
          .createProfile({
            avatarUrl: `https://example.com/avatar/${profileUsername}`,
            name: 'Test Verified User',
            username: profileUsername,
          })
          .accountsStrict({
            authority: profileOwner.publicKey,
            feePayer: feePayer.publicKey,
            profile,
            pointer,
            systemProgram: SystemProgram.programId,
          })
          .signers([profileOwner])
          .rpc()

        testProfile = profile
      })

      it('Verify Profile for Community', async () => {
        await program.methods
          .verifyProfileForCommunity()
          .accountsStrict({
            community: testCommunity,
            profile: testProfile,
            authority: communityAuthority.publicKey,
            feePayer: feePayer.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([communityAuthority])
          .rpc()

        // Fetch and check the Community account
        const communityAccount = await program.account.community.fetch(testCommunity)
        const profileVerification = communityAccount.verifiedProfiles.find((v) => v.profile.equals(testProfile))
        expect(profileVerification).toBeDefined()
        expect(profileVerification.verifiedAt).not.toBeNull()
        expect(profileVerification.verifiedBy).toEqual(communityAuthority.publicKey)

        // Fetch and check the Profile account
        const profileAccount = await program.account.profile.fetch(testProfile)
        const communityVerification = profileAccount.communityVerifications.find((v) =>
          v.community.equals(testCommunity),
        )
        expect(communityVerification).toBeDefined()
        expect(communityVerification.verifiedAt).not.toBeNull()
        expect(communityVerification.verifiedBy).toEqual(communityAuthority.publicKey)
      })

      it('Fails to Verify Profile for Community with Unauthorized Authority', async () => {
        const unauthorizedAuthority = Keypair.generate()

        await expect(
          program.methods
            .verifyProfileForCommunity()
            .accountsStrict({
              community: testCommunity,
              profile: testProfile,
              authority: unauthorizedAuthority.publicKey,
              feePayer: feePayer.publicKey,
              systemProgram: SystemProgram.programId,
            })
            .signers([unauthorizedAuthority])
            .rpc(),
        ).rejects.toThrow(/Unauthorized/)
      })

      it('Fails to Verify Already Verified Profile', async () => {
        // Second verification after test above instatiated profile (should fail)
        await expect(
          program.methods
            .verifyProfileForCommunity()
            .accountsStrict({
              community: testCommunity,
              profile: testProfile,
              authority: communityAuthority.publicKey,
              feePayer: feePayer.publicKey,
              systemProgram: SystemProgram.programId,
            })
            .signers([communityAuthority])
            .rpc(),
        ).rejects.toThrow(/CommunityVerificationAlreadyExists/)
      })
    })
  })
})
