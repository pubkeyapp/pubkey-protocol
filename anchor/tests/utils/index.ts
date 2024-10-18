import * as anchor from '@coral-xyz/anchor'
import { SystemProgram } from '@solana/web3.js'
import {
  getPubKeyCommunityPda,
  getPubKeyPointerPda,
  getPubKeyProfilePda,
  IdentityProvider,
  PubkeyProtocol,
} from '../../src'
import { getCommunityAvatarUrl, getProfileAvatarUrl } from './get-avatar-url'

export async function createTestCommunity(
  slug: string,
  program: anchor.Program<PubkeyProtocol>,
  communityAuthority: anchor.web3.Keypair,
  feePayer: anchor.web3.PublicKey,
) {
  try {
    const [community] = getPubKeyCommunityPda({ programId: program.programId, slug })

    await program.methods
      .communityCreate({
        slug,
        name: 'Test Community',
        avatarUrl: getCommunityAvatarUrl(slug),
      })
      .accountsStrict({
        community,
        authority: communityAuthority.publicKey,
        feePayer,
        systemProgram: SystemProgram.programId,
      })
      .signers([communityAuthority])
      .rpc()

    return community
  } catch (error) {
    console.error('Error creating test community:', error)
    throw error
  }
}

export async function createTestProfile(
  username: string,
  program: anchor.Program<PubkeyProtocol>,
  profileOwner: anchor.web3.Keypair,
  feePayer: anchor.web3.PublicKey,
) {
  try {
    const [profile] = getPubKeyProfilePda({ username, programId: program.programId })
    const [pointer] = getPubKeyPointerPda({
      programId: program.programId,
      provider: IdentityProvider.Solana,
      providerId: profileOwner.publicKey.toString(),
    })

    await program.methods
      .createProfile({
        avatarUrl: getProfileAvatarUrl(username),
        name: 'Test Verified User',
        username,
      })
      .accountsStrict({
        authority: profileOwner.publicKey,
        feePayer,
        profile,
        pointer,
        systemProgram: SystemProgram.programId,
      })
      .signers([profileOwner])
      .rpc()

    return profile
  } catch (error) {
    console.error('Error creating test profile:', error)
    throw error
  }
}
