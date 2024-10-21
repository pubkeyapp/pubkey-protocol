import { Keypair } from '@solana/web3.js'

export function getKeypairFromByteArray(byteArray: number[]) {
  return Keypair.fromSecretKey(Uint8Array.from(byteArray))
}
