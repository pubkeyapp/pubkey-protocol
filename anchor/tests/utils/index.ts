import * as anchor from '@coral-xyz/anchor'
import { getPubKeyCommunityPda, getPubKeyProfilePda, PubkeyProtocol } from "../../src"
import { getCommunityAvatarUrl } from './get-avatar-url'
import { SystemProgram } from '@solana/web3.js'

export async function createTestCommunity(slug: string, program: anchor.Program<PubkeyProtocol>, communityAuthority: anchor.web3.Keypair, feePayer: anchor.web3.PublicKey) {
    try {
        const [community] = getPubKeyCommunityPda({ programId: program.programId, slug })

        await program.methods
            .createCommunity({
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
        console.error('Error creating test community:', error);
        throw error;
    }
}

export async function createTestProfile(username: string, program: anchor.Program<PubkeyProtocol>, profileOwner: anchor.web3.Keypair, feePayer: anchor.web3.PublicKey) {
    try {
        const [profile] = getPubKeyProfilePda({ username, programId: program.programId })

        await program.methods
            .createProfile({
                avatarUrl: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}`,
                name: 'Test Verified User',
                username,
            })
            .accountsStrict({
                authority: profileOwner.publicKey,
                feePayer,
                profile,
                systemProgram: SystemProgram.programId,
            })
            .signers([profileOwner])
            .rpc()

        return profile
    } catch (error) {
        console.error('Error creating test profile:', error);
        throw error;
    }
}