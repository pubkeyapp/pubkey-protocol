import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js'
import { convertToAnchorIdentityProvider, getPubKeyPointerPda, getPubKeyProfilePda, IdentityProvider } from '../src'
import { PubkeyProtocol } from '../target/types/pubkey_protocol'
import {
  airdropAccounts,
  createOrGetTestConfig,
  createTestCommunity,
  createTestProfile,
  getProfileAvatarUrl,
  getTestPdaPointer,
  unique,
} from './utils'

describe('pubkey-protocol-profile', () => {
  const username = unique('alice')
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const feePayer = provider.wallet as anchor.Wallet
  const program = anchor.workspace.PubkeyProtocol as Program<PubkeyProtocol>
  const communityAuthority = Keypair.generate()
  const aliceWalletOne = Keypair.generate()
  const aliceWalletTwo = Keypair.generate()

  let config: anchor.web3.PublicKey
  let community: anchor.web3.PublicKey
  let communitySlug: string

  beforeAll(async () => {
    const res = await createOrGetTestConfig(program, feePayer.publicKey)
    config = res.config

    await airdropAccounts(provider, [
      { label: 'communityAuthority', publicKey: communityAuthority.publicKey },
      { label: 'aliceWalletOne', publicKey: aliceWalletOne.publicKey },
      { label: 'aliceWalletTwo', publicKey: aliceWalletTwo.publicKey },
    ])
    communitySlug = unique('acme')
    community = await createTestCommunity({
      authority: communityAuthority,
      communityAuthority: feePayer.publicKey,
      config,
      program,
      slug: communitySlug,
    })
  })

  describe('authorized', () => {
    describe('Create and update', () => {
      it('should create a profile', async () => {
        const [profile, bump] = getPubKeyProfilePda({ username, programId: program.programId })
        const [pointer, bumpPointer] = getPubKeyPointerPda({
          programId: program.programId,
          provider: IdentityProvider.Solana,
          providerId: aliceWalletOne.publicKey.toString(),
        })

        await createTestProfile({
          community,
          communityAuthority,
          username,
          program,
          profileOwner: aliceWalletOne,
        })

        const {
          authorities,
          identities,
          avatarUrl,
          bump: receivedBump,
          username: receivedUsername,
        } = await program.account.profile.fetch(profile)

        const pointerData = await program.account.pointer.fetch(pointer)
        const postBalance = await provider.connection.getBalance(aliceWalletOne.publicKey)

        expect(postBalance).toStrictEqual(LAMPORTS_PER_SOL)
        expect(receivedBump).toStrictEqual(bump)
        expect(receivedUsername).toStrictEqual(username)
        expect(avatarUrl).toStrictEqual(getProfileAvatarUrl(username))
        expect(authorities).toEqual([aliceWalletOne.publicKey])

        expect(identities[0].provider).toStrictEqual({ solana: {} })
        expect(identities[0].providerId).toStrictEqual(aliceWalletOne.publicKey.toString())
        expect(identities[0].name).toStrictEqual('Primary Wallet')
        expect(identities[0].communities.map((c) => c.toString())).toStrictEqual([community.toString()])

        expect(pointerData.bump).toStrictEqual(bumpPointer)
        expect(pointerData.providerId).toStrictEqual(aliceWalletOne.publicKey.toString())
        expect(pointerData.provider).toStrictEqual({ solana: {} })
        expect(pointerData.profile).toStrictEqual(profile)
      })

      it('should update profile details', async () => {
        const [profile] = getPubKeyProfilePda({ username, programId: program.programId })
        const input = {
          authority: aliceWalletOne.publicKey,
          newName: 'Test Profile',
          newAvatarUrl: getProfileAvatarUrl(`${username}_new`),
          newBio: 'This is a test bio',
        }
        await program.methods
          .profileUpdate(input)
          .accountsStrict({
            authority: aliceWalletOne.publicKey,
            community,
            feePayer: communityAuthority.publicKey,
            profile,
          })
          .signers([communityAuthority, aliceWalletOne])
          .rpc()

        const { avatarUrl: newAvatarUrl, name: newName } = await program.account.profile.fetch(profile)
        expect(newAvatarUrl).toStrictEqual(input.newAvatarUrl)
        expect(newName).toStrictEqual(input.newName)
      })
    })
    describe('Authorities', () => {
      it('should add an authority', async () => {
        const [profile] = getPubKeyProfilePda({ username, programId: program.programId })

        await program.methods
          .profileAuthorityAdd({ newAuthority: aliceWalletTwo.publicKey })
          .accountsStrict({
            profile,
            authority: aliceWalletOne.publicKey,
            community: community,
            feePayer: communityAuthority.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([communityAuthority, aliceWalletOne])
          .rpc()

        const { authorities } = await program.account.profile.fetch(profile)

        const postBalance = await provider.connection.getBalance(aliceWalletOne.publicKey)

        expect(postBalance).toStrictEqual(LAMPORTS_PER_SOL)
        expect(authorities.length).toStrictEqual(2)
      })

      it('should remove an authority', async () => {
        const [profile] = getPubKeyProfilePda({ username, programId: program.programId })

        await program.methods
          .profileAuthorityRemove({ authorityToRemove: aliceWalletTwo.publicKey })
          .accountsStrict({
            profile,
            authority: aliceWalletOne.publicKey,
            feePayer: communityAuthority.publicKey,
            community,
          })
          .signers([communityAuthority, aliceWalletOne])
          .rpc()

        const { authorities } = await program.account.profile.fetch(profile)

        expect(authorities).toEqual([aliceWalletOne.publicKey])
      })
    })

    describe('Identities', () => {
      // const username = unique('alice')

      const discordIdentity = {
        provider: IdentityProvider.Discord,
        providerId: Date.now().toString(),
        name: `${username}123`,
      }

      const profilePda = getTestPdaPointer({
        programId: program.programId,
        provider: IdentityProvider.Discord,
        providerId: discordIdentity.providerId,
      })

      it('should add an identity', async () => {
        const [profile] = getPubKeyProfilePda({ username, programId: program.programId })

        await program.methods
          .profileIdentityAdd({
            provider: convertToAnchorIdentityProvider(IdentityProvider.Discord),
            providerId: discordIdentity.providerId,
            name: `${username}123`,
          })
          .accountsStrict({
            community,
            authority: aliceWalletOne.publicKey,
            feePayer: communityAuthority.publicKey,
            pointer: profilePda.publicKey,
            profile,
            systemProgram: SystemProgram.programId,
          })
          .signers([communityAuthority, aliceWalletOne])
          .rpc()

        const { identities } = await program.account.profile.fetch(profile)
        const pointerData = await program.account.pointer.fetch(profilePda.publicKey)

        const postBalance = await provider.connection.getBalance(aliceWalletOne.publicKey)

        expect(postBalance).toStrictEqual(LAMPORTS_PER_SOL)

        expect(identities.length).toStrictEqual(2)

        expect(identities[0].provider).toStrictEqual(convertToAnchorIdentityProvider(IdentityProvider.Solana))
        expect(identities[0].providerId).toStrictEqual(aliceWalletOne.publicKey.toString())
        expect(identities[0].name).toStrictEqual('Primary Wallet')
        expect(identities[0].communities.map((c) => c.toString())).toStrictEqual([community.toString()])

        expect(identities[1].provider).toStrictEqual(convertToAnchorIdentityProvider(discordIdentity.provider))
        expect(identities[1].providerId).toStrictEqual(discordIdentity.providerId)
        expect(identities[1].name).toStrictEqual(discordIdentity.name)
        expect(identities[1].communities.map((c) => c.toString())).toStrictEqual([community.toString()])

        expect(pointerData.bump).toStrictEqual(profilePda.bump)
        expect(pointerData.providerId).toStrictEqual(discordIdentity.providerId)
        expect(pointerData.provider).toStrictEqual(convertToAnchorIdentityProvider(discordIdentity.provider))
        expect(pointerData.profile).toStrictEqual(profile)
      })

      it('should remove an identity', async () => {
        const [profile] = getPubKeyProfilePda({ username, programId: program.programId })
        await program.methods
          .profileIdentityRemove({
            providerId: discordIdentity.providerId,
          })
          .accountsStrict({
            community,
            authority: aliceWalletOne.publicKey,
            feePayer: communityAuthority.publicKey,
            pointer: profilePda.publicKey,
            profile,
            systemProgram: SystemProgram.programId,
          })
          .signers([communityAuthority, aliceWalletOne])
          .rpc()

        const { identities } = await program.account.profile.fetch(profile)
        const pointerData = await program.account.pointer.fetchNullable(profilePda.publicKey)

        expect(identities.length).toStrictEqual(1)
        expect(identities[0].provider).toStrictEqual(convertToAnchorIdentityProvider(IdentityProvider.Solana))
        expect(identities[0].providerId).toStrictEqual(aliceWalletOne.publicKey.toString())
        expect(identities[0].name).toStrictEqual('Primary Wallet')
        expect(identities[0].communities.map((c) => c.toString())).toStrictEqual([community.toString()])

        expect(pointerData).toBeNull()
      })

      it('should verify an identity', async () => {
        const community2slug = unique('acme_2')
        const community2 = await createTestCommunity({
          authority: communityAuthority,
          communityAuthority: feePayer.publicKey,
          config,
          program,
          slug: community2slug,
        })
        const [profile] = getPubKeyProfilePda({ username, programId: program.programId })
        const [pointer] = getPubKeyPointerPda({
          programId: program.programId,
          provider: IdentityProvider.Solana,
          providerId: aliceWalletOne.publicKey.toString(),
        })
        await program.methods
          .profileIdentityVerify({
            provider: convertToAnchorIdentityProvider(IdentityProvider.Solana),
            providerId: aliceWalletOne.publicKey.toString(),
          })
          .accountsStrict({
            authority: communityAuthority.publicKey,
            community: community2,
            feePayer: communityAuthority.publicKey,
            pointer,
            profile,
          })
          .signers([communityAuthority])
          .rpc()

        // Fetch and check the Profile account
        const profileAccount = await program.account.profile.fetch(profile)

        const identityVerification = profileAccount.identities.find(
          (i) => i.providerId === aliceWalletOne.publicKey.toString(),
        )
        expect(identityVerification).toBeDefined()
        if (identityVerification) {
          expect(identityVerification.communities).toContainEqual(community)
          expect(identityVerification.communities).toContainEqual(community2)
        }
      })
    })
  })
  describe('unauthorized', () => {
    // FIXME: Add unauthorized tests
  })
})
