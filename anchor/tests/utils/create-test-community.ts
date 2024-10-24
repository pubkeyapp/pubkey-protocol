import * as anchor from '@coral-xyz/anchor'
import { getPubKeyCommunityPda, PubkeyProtocol } from '../../src'
import { getCommunityAvatarUrl } from './get-avatar-url'

export async function createTestCommunity({
  authority,
  communityAuthority,
  config,
  program,
  slug,
}: {
  authority: anchor.web3.Keypair
  communityAuthority: anchor.web3.PublicKey
  config: anchor.web3.PublicKey
  program: anchor.Program<PubkeyProtocol>
  slug: string
}) {
  try {
    const [community] = getPubKeyCommunityPda({ programId: program.programId, slug })

    // console.log(
    //   `createTestCommunity: community authority ${communityAuthority.toString()} created ${slug} with authority ${authority.publicKey.toString()}`,
    // )

    await program.methods
      .communityCreate({
        slug,
        name: slug,
        avatarUrl: getCommunityAvatarUrl(slug),
      })
      .accountsStrict({
        community,
        communityAuthority,
        authority: authority.publicKey,
        config,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([authority])
      .rpc()

    return community
  } catch (error) {
    console.error('Error creating test community:', error)
    throw error
  }
}
