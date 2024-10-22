import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, SystemProgram } from '@solana/web3.js'
import { convertToAnchorIdentityProvider, getPubKeyCommunityPda, IdentityProvider } from '../src'
import { PubkeyProtocol } from '../target/types/pubkey_protocol'
import { airdropAccounts, createOrGetTestConfig, createTestCommunity, getCommunityAvatarUrl, unique } from './utils'

fdescribe('pubkey-protocol-community', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const feePayer = provider.wallet as anchor.Wallet
  const program = anchor.workspace.PubkeyProtocol as Program<PubkeyProtocol>
  const communityAuthority = Keypair.generate()
  const communityAuthority2 = Keypair.generate()
  const unauthorizedAuthority = Keypair.generate()

  let config: anchor.web3.PublicKey
  let community: anchor.web3.PublicKey
  let communitySlug: string

  beforeAll(async () => {
    const res = await createOrGetTestConfig(program, feePayer.publicKey)
    config = res.config

    await airdropAccounts(provider, [
      { label: 'communityAuthority', publicKey: communityAuthority.publicKey },
      { label: 'communityAuthority2', publicKey: communityAuthority2.publicKey },
      { label: 'unauthorizedAuthority', publicKey: unauthorizedAuthority.publicKey },
    ])
  })

  beforeEach(async () => {
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
    describe('create and update', () => {
      it('should create a community', async () => {
        const communityAccount = await program.account.community.fetch(community)

        expect(communityAccount.slug).toEqual(communitySlug)
        expect(communityAccount.name).toEqual(communitySlug)
        expect(communityAccount.avatarUrl).toEqual(getCommunityAvatarUrl(communitySlug))
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
          avatarUrl: getCommunityAvatarUrl(`${communitySlug}_new`),
          name: `${communitySlug} updated`,
          discord: 'https://discord.gg/users/test',
          farcaster: 'https://warpcast.com/test',
          github: 'https://github.com/test',
          telegram: 'https://t.me/test',
          website: 'https://test.com',
          x: 'https://x.com/test',
        }
        await program.methods
          .communityUpdate(input)
          .accounts({
            community,
            authority: communityAuthority.publicKey,
          })
          .signers([communityAuthority])
          .rpc()

        const updatedCommunity = await program.account.community.fetch(community)
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

    describe('Authorities', () => {
      it('should request an authority update', async () => {
        await program.methods
          .communityAuthorityRequest({
            newAuthority: communityAuthority2.publicKey,
          })
          .accountsStrict({
            community,
            authority: communityAuthority.publicKey,
          })
          .signers([communityAuthority])
          .rpc()

        const updatedCommunity = await program.account.community.fetch(community)
        expect(updatedCommunity.pendingAuthority).toEqual(communityAuthority2.publicKey)
      })

      it('should approve an authority update', async () => {
        // First, initiate the authority update
        await program.methods
          .communityAuthorityRequest({
            newAuthority: communityAuthority2.publicKey,
          })
          .accountsStrict({
            community,
            authority: communityAuthority.publicKey,
          })
          .signers([communityAuthority])
          .rpc()

        // Then, approve the authority update
        await program.methods
          .communityAuthorityApprove()
          .accountsStrict({
            community,
            newAuthority: communityAuthority2.publicKey,
          })
          .signers([communityAuthority2])
          .rpc()

        const updatedCommunity = await program.account.community.fetch(community)
        expect(updatedCommunity.authority).toEqual(communityAuthority2.publicKey)
        expect(updatedCommunity.pendingAuthority).toBeNull()
      })

      it('should decline an authority update', async () => {
        const newAuthority = Keypair.generate().publicKey

        // First, initiate the authority update
        await program.methods
          .communityAuthorityRequest({
            newAuthority,
          })
          .accountsStrict({
            community,
            authority: communityAuthority.publicKey,
          })
          .signers([communityAuthority])
          .rpc()

        // Then, decline the authority update
        await program.methods
          .communityAuthorityDecline()
          .accountsStrict({
            community,
            authority: communityAuthority.publicKey,
          })
          .signers([communityAuthority])
          .rpc()

        const updatedCommunity = await program.account.community.fetch(community)
        expect(updatedCommunity.authority).toEqual(communityAuthority.publicKey)
        expect(updatedCommunity.pendingAuthority).toBeNull()
      })
    })

    describe('Signers', () => {
      it('should add a community signer', async () => {
        await program.methods
          .communitySignerAdd({
            signer: feePayer.publicKey,
          })
          .accounts({
            community,
            authority: communityAuthority.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([communityAuthority])
          .rpc()

        const updatedCommunity = await program.account.community.fetch(community)
        expect(updatedCommunity.signers).toEqual(
          expect.arrayContaining([communityAuthority.publicKey, feePayer.publicKey]),
        )
      })

      it('should remove a community signer', async () => {
        const newSigner = Keypair.generate().publicKey

        await program.methods
          .communitySignerAdd({
            signer: newSigner,
          })
          .accounts({
            community,
            authority: communityAuthority.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([communityAuthority])
          .rpc()

        const updatedCommunityFirst = await program.account.community.fetch(community)
        expect(updatedCommunityFirst.signers).toEqual(expect.arrayContaining([communityAuthority.publicKey, newSigner]))

        await program.methods
          .communitySignerRemove({
            signer: newSigner,
          })
          .accounts({
            community,
            authority: communityAuthority.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([communityAuthority])
          .rpc()

        const updatedCommunity = await program.account.community.fetch(community)
        expect(updatedCommunity.signers).not.toContain(newSigner)
        expect(updatedCommunity.signers).toEqual(expect.arrayContaining([communityAuthority.publicKey]))
      })

      it('should not add an existing community signer twice', async () => {
        try {
          await program.methods
            .communitySignerAdd({
              signer: communityAuthority.publicKey,
            })
            .accounts({
              community,
              authority: communityAuthority.publicKey,
              systemProgram: SystemProgram.programId,
            })
            .signers([communityAuthority])
            .rpc()
          expect(true).toBe(false)
        } catch (error) {
          expect(error.error.errorCode.code).toBe('SignerAlreadyExists')
        }
      })

      it('should not remove the last signer from a community', async () => {
        try {
          await program.methods
            .communitySignerRemove({
              signer: communityAuthority.publicKey,
            })
            .accounts({
              community,
              authority: communityAuthority.publicKey,
              systemProgram: SystemProgram.programId,
            })
            .signers([communityAuthority])
            .rpc()
          expect(true).toBe(false)
        } catch (error) {
          expect(error.error.errorCode.code).toBe('SignerRequired')
        }
      })
    })

    describe('Providers', () => {
      async function communityEnableProvider(provider: IdentityProvider) {
        const communityBefore = await program.account.community.fetch(community)
        expect(communityBefore.providers).not.toContain(provider)

        await program.methods
          .communityProviderEnable({
            provider: convertToAnchorIdentityProvider(provider),
          })
          .accounts({
            community,
            authority: communityAuthority.publicKey,
            feePayer: feePayer.publicKey,
          })
          .signers([communityAuthority])
          .rpc()

        const communityAfter = await program.account.community.fetch(community)
        expect(communityAfter.providers).toContainEqual(convertToAnchorIdentityProvider(IdentityProvider.Solana))
        expect(communityAfter.providers).toContainEqual(convertToAnchorIdentityProvider(provider))
        expect(communityAfter.providers.length).toBe(communityBefore.providers.length + 1)
      }

      it('should enable a provider for a community', async () => {
        const providerToEnable = IdentityProvider.Discord
        const communityBefore = await program.account.community.fetch(community)
        expect(communityBefore.providers).not.toContain(providerToEnable)

        await program.methods
          .communityProviderEnable({
            provider: convertToAnchorIdentityProvider(providerToEnable),
          })
          .accounts({
            community,
            authority: communityAuthority.publicKey,
            feePayer: feePayer.publicKey,
          })
          .signers([communityAuthority])
          .rpc()

        const communityAfter = await program.account.community.fetch(community)
        expect(communityAfter.providers).toContainEqual(convertToAnchorIdentityProvider(IdentityProvider.Solana))
        expect(communityAfter.providers).toContainEqual(convertToAnchorIdentityProvider(providerToEnable))
        expect(communityAfter.providers.length).toBe(communityBefore.providers.length + 1)
      })

      it('should not enable the same provider twice', async () => {
        const providerToEnable = IdentityProvider.Discord
        await communityEnableProvider(providerToEnable)

        const communityAfter = await program.account.community.fetch(community)

        // Try to enable the same provider again (should fail)
        try {
          await program.methods
            .communityProviderEnable({
              provider: convertToAnchorIdentityProvider(providerToEnable),
            })
            .accounts({
              community,
              authority: communityAuthority.publicKey,
              feePayer: feePayer.publicKey,
            })
            .signers([communityAuthority])
            .rpc()

          expect(true).toBe(false)
        } catch (error) {
          expect(error.error.errorCode.code).toBe('ProviderAlreadyExists')
        }

        const communityFinal = await program.account.community.fetch(community)
        expect(communityFinal.providers.length).toBe(communityAfter.providers.length)
      })

      it('should disable a provider for a community', async () => {
        const providerToDisable = IdentityProvider.Discord
        await communityEnableProvider(providerToDisable)

        await program.methods
          .communityProviderDisable({
            provider: convertToAnchorIdentityProvider(providerToDisable),
          })
          .accounts({
            community,
            authority: communityAuthority.publicKey,
            feePayer: feePayer.publicKey,
          })
          .signers([communityAuthority])
          .rpc()

        const communityAfter = await program.account.community.fetch(community)
        expect(communityAfter.providers).not.toContainEqual(convertToAnchorIdentityProvider(providerToDisable))
      })

      it('should not disable the Solana provider', async () => {
        const providerToDisable = IdentityProvider.Solana
        const communityBefore = await program.account.community.fetch(community)
        expect(communityBefore.providers).toContainEqual(convertToAnchorIdentityProvider(providerToDisable))

        try {
          await program.methods
            .communityProviderDisable({
              provider: convertToAnchorIdentityProvider(providerToDisable),
            })
            .accounts({
              community,
              authority: communityAuthority.publicKey,
              feePayer: feePayer.publicKey,
            })
            .signers([communityAuthority])
            .rpc()
          expect(true).toBe(false)
        } catch (error) {
          expect(error.error.errorCode.code).toBe('CannotRemoveSolanaProvider')
        }

        const communityAfter = await program.account.community.fetch(community)
        expect(communityAfter.providers).toContainEqual(convertToAnchorIdentityProvider(providerToDisable))
      })
    })
  })

  describe('unauthorized', () => {
    describe('create and update', () => {
      it('should not allow a non-authority to create a community', async () => {
        const slug = unique('acme')
        const [community] = getPubKeyCommunityPda({ programId: program.programId, slug })
        try {
          await program.methods
            .communityCreate({
              slug: slug,
              name: slug,
              avatarUrl: getCommunityAvatarUrl(slug),
            })
            .accountsStrict({
              community,
              communityAuthority: unauthorizedAuthority.publicKey,
              authority: unauthorizedAuthority.publicKey,
              config,
              systemProgram: SystemProgram.programId,
            })
            .signers([unauthorizedAuthority])
            .rpc()
          expect(true).toBe(false)
        } catch (error) {
          // console.log('error', error)
          expect(error.error.errorCode.code).toEqual('UnAuthorizedCommunityAuthority')
          expect(error.error.errorCode.number).toEqual(6040)
          expect(error.error.errorMessage).toEqual('Account is not defined in config.community_authority')
        }
      })

      it('should not allow a non-authority to update a community', async () => {
        try {
          await program.methods
            .communityUpdate({
              avatarUrl: getCommunityAvatarUrl(`${communitySlug}_new`),
              name: `${communitySlug} updated`,
              discord: 'https://discord.gg/users/test',
              farcaster: 'https://warpcast.com/test',
              github: 'https://github.com/test',
              telegram: 'https://t.me/test',
              website: 'https://test.com',
              x: 'https://x.com/test',
            })
            .accounts({
              community,
              authority: unauthorizedAuthority.publicKey,
            })
            .signers([unauthorizedAuthority])
            .rpc()
          expect(true).toBe(false)
        } catch (error) {
          expect(error.error.errorCode.code).toBe('UnAuthorized')
          expect(error.error.errorCode.number).toEqual(6038)
        }
      })
    })

    describe('Authorities', () => {
      it('should not allow a non-authority to update an authority', async () => {
        try {
          await program.methods
            .communityAuthorityApprove()
            .accountsStrict({
              community,
              newAuthority: unauthorizedAuthority.publicKey,
            })
            .signers([unauthorizedAuthority])
            .rpc()
          expect(true).toBe(false)
        } catch (error) {
          expect(error.error.errorCode.code).toBe('UnAuthorized')
          expect(error.error.errorCode.number).toEqual(6038)
        }
      })

      it('should not allow a non-authority to update an authority', async () => {
        try {
          await program.methods
            .communityAuthorityDecline()
            .accountsStrict({
              community,
              authority: unauthorizedAuthority.publicKey,
            })
            .signers([unauthorizedAuthority])
            .rpc()
          expect(true).toBe(false)
        } catch (error) {
          expect(error.error.errorCode.code).toBe('UnAuthorized')
          expect(error.error.errorCode.number).toEqual(6038)
        }
      })

      it('should not allow a non-authority to update an authority', async () => {
        try {
          await program.methods
            .communityAuthorityRequest({
              newAuthority: communityAuthority2.publicKey,
            })
            .accountsStrict({
              community,
              authority: unauthorizedAuthority.publicKey,
            })
            .signers([unauthorizedAuthority])
            .rpc()
          expect(true).toBe(false)
        } catch (error) {
          expect(error.error.errorCode.code).toBe('UnAuthorized')
          expect(error.error.errorCode.number).toEqual(6038)
        }
      })
    })

    describe('Signers', () => {
      it('should not allow a non-authority to add a signer', async () => {
        try {
          await program.methods
            .communitySignerAdd({
              signer: communityAuthority2.publicKey,
            })
            .accounts({
              community,
              authority: unauthorizedAuthority.publicKey,
              systemProgram: SystemProgram.programId,
            })
            .signers([unauthorizedAuthority])
            .rpc()
          expect(true).toBe(false)
        } catch (error) {
          expect(error.error.errorCode.code).toBe('UnAuthorized')
          expect(error.error.errorCode.number).toEqual(6038)
        }
      })

      it('should not allow a non-authority to remove a signer', async () => {
        try {
          await program.methods
            .communitySignerRemove({
              signer: communityAuthority.publicKey,
            })
            .accounts({
              community,
              authority: unauthorizedAuthority.publicKey,
              systemProgram: SystemProgram.programId,
            })
            .signers([unauthorizedAuthority])
            .rpc()
          expect(true).toBe(false)
        } catch (error) {
          expect(error.error.errorCode.code).toBe('UnAuthorized')
          expect(error.error.errorCode.number).toEqual(6038)
        }
      })
    })

    describe('Providers', () => {
      it('should not allow a non-authority to enable a provider', async () => {
        const providerToEnable = IdentityProvider.Discord

        try {
          await program.methods
            .communityProviderEnable({
              provider: convertToAnchorIdentityProvider(providerToEnable),
            })
            .accounts({
              community,
              authority: unauthorizedAuthority.publicKey, // Use unauthorized authority here
              feePayer: feePayer.publicKey,
            })
            .signers([unauthorizedAuthority])
            .rpc()

          // If no error, fail the test as it should not succeed
          expect(true).toBe(false)
        } catch (error) {
          // Check that the error is related to unauthorized action
          expect(error.error.errorCode.code).toEqual('UnAuthorized')
          expect(error.error.errorCode.number).toEqual(6038)
          expect(error.error.errorMessage).toEqual('Account unauthorized to perform this action')
        }

        // Confirm the provider was not added
        const communityAfter = await program.account.community.fetch(community)
        expect(communityAfter.providers).not.toContainEqual(convertToAnchorIdentityProvider(providerToEnable))
      })
    })
  })
})
