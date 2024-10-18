import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, SystemProgram } from '@solana/web3.js'
import { PubkeyProtocol } from '../target/types/pubkey_protocol'
import { airdropAccounts } from './utils/airdropper'
import { getCommunityAvatarUrl } from './utils/get-avatar-url'
import { unique } from './utils/unique'
import { createTestCommunity } from './utils'
import { convertToAnchorIdentityProvider, IdentityProvider } from '../src'

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
    let communityPDA: anchor.web3.PublicKey
    const slug = unique('acme')

    beforeAll(async () => {
      communityPDA = await createTestCommunity(slug, program, communityAuthority, feePayer.publicKey)
    })

    it('Create Community', async () => {
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

    it('Update Community Details', async () => {
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

    it('Update Community Fee Payers', async () => {
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

      const updatedCommunity = await program.account.community.fetch(communityPDA)
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

      const updatedCommunity = await program.account.community.fetch(communityPDA)
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

      const updatedCommunity = await program.account.community.fetch(communityPDA)
      expect(updatedCommunity.authority).toEqual(communityAuthority.publicKey)
      expect(updatedCommunity.pendingAuthority).toBeNull()
    })
  })
})
