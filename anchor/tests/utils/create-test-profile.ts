import * as anchor from '@coral-xyz/anchor'
import { SystemProgram } from '@solana/web3.js'
import { getPubKeyPointerPda, getPubKeyProfilePda, IdentityProvider, PubkeyProtocol } from '../../src'
import { getProfileAvatarUrl } from './get-avatar-url'

export async function createTestProfile({
  community,
  communityAuthority,
  profileOwner,
  program,
  username,
}: {
  community: anchor.web3.PublicKey
  communityAuthority: anchor.web3.Keypair
  profileOwner: anchor.web3.Keypair
  program: anchor.Program<PubkeyProtocol>
  username: string
}) {
  try {
    const [profile] = getPubKeyProfilePda({ username, programId: program.programId })
    const [pointer] = getPubKeyPointerPda({
      programId: program.programId,
      provider: IdentityProvider.Solana,
      providerId: profileOwner.publicKey.toString(),
    })

    await program.methods
      .profileCreate({
        avatarUrl: getProfileAvatarUrl(username),
        name: username,
        username,
      })
      .accountsStrict({
        authority: profileOwner.publicKey,
        community,
        feePayer: communityAuthority.publicKey,
        profile,
        pointer,
        systemProgram: SystemProgram.programId,
      })
      .signers([communityAuthority, profileOwner])
      .rpc()

    return profile
  } catch (error) {
    console.error('Error creating test profile:', error)
    throw error
  }
}
