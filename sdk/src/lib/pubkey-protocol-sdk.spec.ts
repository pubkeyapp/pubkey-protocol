import { AnchorProvider } from '@coral-xyz/anchor'
import { PUBKEY_PROTOCOL_PROGRAM_ID, PubKeyIdentityProvider } from '@pubkey-protocol/anchor'
import { airdropIfRequired, getKeypairFromFile } from '@solana-developers/helpers'
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { AnchorKeypairWallet } from './anchor-keypair-wallet'
import { PubkeyProtocolSdk } from './pubkey-protocol-sdk'

const programId = PUBKEY_PROTOCOL_PROGRAM_ID
const connection = new Connection('http://localhost:8899', 'confirmed')

xdescribe('sdk', () => {
  let feePayer: Keypair
  let authority: PublicKey
  const provider = new AnchorProvider(connection, new AnchorKeypairWallet(Keypair.generate()), {
    commitment: 'confirmed',
  })

  const sdk = new PubkeyProtocolSdk({ programId, connection, provider })

  beforeEach(async () => {
    feePayer = await getKeypairFromFile()
    authority = feePayer.publicKey
    await airdropIfRequired(connection, feePayer.publicKey, 10 * LAMPORTS_PER_SOL, LAMPORTS_PER_SOL)
  }, 30000)

  it('should work', () => {
    console.log('FeePayer', feePayer.publicKey.toBase58())
    const sdk = new PubkeyProtocolSdk({ programId, connection, provider })

    const [profilePDA, profileBump] = sdk.getProfilePda({ username: 'test' })
    expect(profilePDA).toBeTruthy()
    expect(profilePDA.toBase58()).toEqual('687R8BWizeLZmsWF7svEfV3d5EKgwbmDzdN7qfpBhX4M')
    expect(profileBump).toEqual(254)

    const [pointerPDA, pointerBump] = sdk.getPointerPda({
      provider: PubKeyIdentityProvider.Solana,
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
    const avatarUrl = `https://avatars.dicebear.com/api/avataaars/${username}.svg`
    // ACT
    console.log({
      authority,
      avatarUrl,
      feePayer,
      username,
    })
    const created = await sdk.createProfile({
      authority,
      avatarUrl,
      feePayer: feePayer.publicKey,
      name,
      username,
    })
    console.log('Created', created)
    const profile = await sdk.getProfileByUsername({ username })
    console.log('Profile', profile)
    // ASSERT
  })
})
