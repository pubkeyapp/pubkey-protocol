import * as anchor from '@coral-xyz/anchor'
import { Keypair, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js'
import {
  convertToAnchorIdentityProvider,
  getPubKeyCommunityPda,
  getPubKeyPointerPda,
  getPubKeyProfilePda,
  IdentityProvider,
  PubkeyProtocol,
} from '../src'
import { createTestCommunity, createTestProfile } from './utils'
import { unique } from './utils/unique'

describe('pubkey-protocol-identity', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const feePayer = provider.wallet as anchor.Wallet
  const program = anchor.workspace.PubkeyProtocol as anchor.Program<PubkeyProtocol>

  const username = unique('harkl')
  const slug = unique('pubkey')
  const communityAuthority = Keypair.generate()
  const profileOwner = Keypair.generate()
  let community: anchor.web3.PublicKey
  let profile: anchor.web3.PublicKey
  let profilePointer: anchor.web3.PublicKey
  let profileBump: number

  const discordIdentity = {
    provider: IdentityProvider.Discord,
    providerId: Date.now().toString(),
    name: `${username}123`,
  }

  beforeAll(async () => {
    await provider.connection.requestAirdrop(profileOwner.publicKey, LAMPORTS_PER_SOL)

    await createTestCommunity(slug, program, communityAuthority, feePayer.publicKey)
    await createTestProfile(username, program, profileOwner, feePayer.publicKey)
    ;[profilePointer, profileBump] = getPubKeyPointerPda({
      programId: program.programId,
      provider: IdentityProvider.Discord,
      providerId: discordIdentity.providerId,
    })

    profile = getPubKeyProfilePda({ username, programId: program.programId })[0]
    community = getPubKeyCommunityPda({ programId: program.programId, slug })[0]
  })

  it('should add an identity', async () => {
    await program.methods
      .addIdentity({
        provider: convertToAnchorIdentityProvider(IdentityProvider.Discord),
        providerId: discordIdentity.providerId,
        name: `${username}123`,
      })
      .accountsStrict({
        authority: profileOwner.publicKey,
        feePayer: feePayer.publicKey,
        pointer: profilePointer,
        profile,
        systemProgram: SystemProgram.programId,
      })
      .signers([profileOwner])
      .rpc()

    const { identities } = await program.account.profile.fetch(profile)
    const pointerData = await program.account.pointer.fetch(profilePointer)

    const postBalance = await provider.connection.getBalance(profileOwner.publicKey)

    expect(postBalance).toStrictEqual(LAMPORTS_PER_SOL)
    expect(identities).toEqual([
      {
        provider: convertToAnchorIdentityProvider(IdentityProvider.Solana),
        providerId: profileOwner.publicKey.toBase58(),
        name: 'Primary Wallet',
        communities: [],
      },
      {
        provider: convertToAnchorIdentityProvider(discordIdentity.provider),
        providerId: discordIdentity.providerId,
        name: discordIdentity.name,
        communities: [],
      },
    ])

    expect(pointerData.bump).toStrictEqual(profileBump)
    expect(pointerData.providerId).toStrictEqual(discordIdentity.providerId)
    expect(pointerData.provider).toStrictEqual(convertToAnchorIdentityProvider(discordIdentity.provider))
    expect(pointerData.profile).toStrictEqual(profile)
  })

  it('should remove an identity', async () => {
    await program.methods
      .removeIdentity({
        providerId: discordIdentity.providerId,
      })
      .accountsStrict({
        authority: profileOwner.publicKey,
        feePayer: feePayer.publicKey,
        pointer: profilePointer,
        profile,
        systemProgram: SystemProgram.programId,
      })
      .signers([profileOwner])
      .rpc()

    const { identities } = await program.account.profile.fetch(profile)
    const pointerData = await program.account.pointer.fetchNullable(profilePointer)

    expect(identities).toEqual([
      {
        provider: convertToAnchorIdentityProvider(IdentityProvider.Solana),
        providerId: profileOwner.publicKey.toString(),
        name: 'Primary Wallet',
        communities: [],
      },
    ])
    expect(pointerData).toBeNull()
  })

  it('should verify an identity', async () => {
    const [pointer] = getPubKeyPointerPda({
      programId: program.programId,
      provider: IdentityProvider.Solana,
      providerId: profileOwner.publicKey.toString(),
    })
    await program.methods
      .verifyProfileIdentity({
        provider: convertToAnchorIdentityProvider(IdentityProvider.Solana),
        providerId: profileOwner.publicKey.toString(),
      })
      .accountsStrict({
        community,
        profile,
        pointer,
        authority: communityAuthority.publicKey,
        feePayer: feePayer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([communityAuthority])
      .rpc()

    // Fetch and check the Profile account
    const profileAccount = await program.account.profile.fetch(profile)

    const identityVerification = profileAccount.identities.find(
      (i) => i.providerId === profileOwner.publicKey.toString(),
    )
    expect(identityVerification).toBeDefined()
    if (identityVerification) {
      expect(identityVerification.communities).toContainEqual(community)
    }

    // Fetch and check the Community account
    const communityAccount = await program.account.community.fetch(community)
    expect(communityAccount.providers).toContainEqual(convertToAnchorIdentityProvider(IdentityProvider.Solana))
  })
})
