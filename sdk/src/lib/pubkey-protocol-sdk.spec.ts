import { AnchorProvider } from '@coral-xyz/anchor'
import { IdentityProvider, PUBKEY_PROTOCOL_PROGRAM_ID } from '@pubkey-protocol/anchor'
import { airdropIfRequired, getKeypairFromFile } from '@solana-developers/helpers'
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { PubKeyProtocolSdk } from './pubkey-protocol-sdk'
import { AnchorKeypairWallet } from './utils/anchor-keypair-wallet'

import { getAvatarUrlProfile } from './utils/get-avatar-url-profile'

const programId = PUBKEY_PROTOCOL_PROGRAM_ID
const connection = new Connection('http://localhost:8899', 'confirmed')

xdescribe('sdk', () => {
  let feePayer: Keypair
  let authority: PublicKey
  const provider = new AnchorProvider(connection, new AnchorKeypairWallet(Keypair.generate()), {
    commitment: 'confirmed',
  })

  const sdk = new PubKeyProtocolSdk({ programId, connection, provider })

  beforeEach(async () => {
    feePayer = await getKeypairFromFile()
    authority = feePayer.publicKey
    await airdropIfRequired(connection, feePayer.publicKey, 10 * LAMPORTS_PER_SOL, LAMPORTS_PER_SOL)
  }, 30000)

  it('should work', () => {
    console.log('FeePayer', feePayer.publicKey.toBase58())
    const sdk = new PubKeyProtocolSdk({ programId, connection, provider })

    const [profilePDA, profileBump] = sdk.pdaProfile({ username: 'test' })
    expect(profilePDA).toBeTruthy()
    expect(profilePDA.toBase58()).toEqual('687R8BWizeLZmsWF7svEfV3d5EKgwbmDzdN7qfpBhX4M')
    expect(profileBump).toEqual(254)

    const [pointerPDA, pointerBump] = sdk.pdaPointer({
      provider: IdentityProvider.Solana,
      providerId: 'BEEMANPx2jdmfR7jpn1hRdMuM2Vj4E3azBLb6RUBrCDY',
    })
    expect(pointerPDA).toBeTruthy()
    expect(pointerPDA.toBase58()).toEqual('59rBQouDcnZkxbyKCNrAra8vKVzDwGdfjtZwPtqbWoga')
    expect(pointerBump).toEqual(253)

    expect(sdk).toBeTruthy()
  })

  xit('should create a profile', async () => {
    // ARRANGE
    const username = `test-${Date.now()}`
    const name = `Test Profile`
    const avatarUrl = getAvatarUrlProfile(username)
    // ACT
    console.log({
      authority,
      avatarUrl,
      feePayer,
      username,
    })
    const { tx: created } = await sdk.profileCreate({
      authority,
      avatarUrl,
      feePayer: feePayer.publicKey,
      name,
      username,
      community: PublicKey.unique(),
    })
    console.log('Created', created)
    const profile = await sdk.profileGet({ profile: username })
    console.log('Profile', profile)
    // ASSERT
  })
})
