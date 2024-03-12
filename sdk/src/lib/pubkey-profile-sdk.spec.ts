import { PUBKEY_PROFILE_PROGRAM_ID, PubKeyIdentityProvider } from '@pubkey-program-library/anchor'
import { Connection } from '@solana/web3.js'
import { PubKeyProfileSdk } from './pubkey-profile-sdk'

const programId = PUBKEY_PROFILE_PROGRAM_ID
const connection = new Connection('http://localhost:8899')
describe('sdk', () => {
  it('should work', () => {
    const sdk = new PubKeyProfileSdk({ programId, connection })

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
})
