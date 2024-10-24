import { PublicKey } from '@solana/web3.js'
import { getPubKeyPointerPda, IdentityProvider } from '../../src'

export * from './airdropper'
export * from './create-or-get-test-config'
export * from './create-test-community'
export * from './create-test-profile'
export * from './get-avatar-url'
export * from './get-config'
export * from './unique'

export function getTestPdaPointer(options: { programId: PublicKey; provider: IdentityProvider; providerId: string }) {
  const profilePda = getPubKeyPointerPda(options)

  return { publicKey: profilePda[0], bump: profilePda[1] }
}
