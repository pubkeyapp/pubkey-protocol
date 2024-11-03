import { PublicKeyString } from '@pubkey-protocol/anchor'
import { PublicKey } from '@solana/web3.js'

export function isValidPublicKey(key: PublicKeyString) {
  try {
    new PublicKey(key)
    return true
  } catch (err) {
    return false
  }
}
