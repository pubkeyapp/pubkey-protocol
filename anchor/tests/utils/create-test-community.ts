import * as anchor from '@coral-xyz/anchor'
import { getPubKeyCommunityPda, PubkeyProtocol } from '../../src'
import { getCommunityAvatarUrl } from './get-avatar-url'

export async function createTestCommunity({
  slug,
  program,
  authority,
  wallet,
  config,
}: {
  slug: string
  program: anchor.Program<PubkeyProtocol>
  authority: anchor.web3.Keypair
  wallet: anchor.Wallet
  config: anchor.web3.PublicKey
}) {
  try {
    const [community] = getPubKeyCommunityPda({ programId: program.programId, slug })

    // console.log(
    //   `createTestCommunity: community authority ${wallet.publicKey.toString()} created ${slug} with authority ${authority.publicKey.toString()}`,
    // )

    await program.methods
      .communityCreate({
        slug,
        name: slug,
        avatarUrl: getCommunityAvatarUrl(slug),
      })
      .accountsStrict({
        community,
        communityAuthority: wallet.publicKey,
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
