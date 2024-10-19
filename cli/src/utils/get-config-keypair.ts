import { Keypair } from '@solana/web3.js'

export const CONFIG_KEYPAIR = [
  201, 10, 173, 165, 92, 174, 15, 100, 250, 15, 234, 64, 98, 150, 19, 160, 16, 160, 107, 38, 181, 221, 186, 72, 126, 17,
  114, 130, 210, 32, 234, 238, 5, 187, 223, 34, 116, 215, 198, 124, 131, 99, 187, 52, 131, 119, 210, 162, 128, 55, 163,
  128, 3, 217, 212, 9, 48, 50, 111, 63, 253, 190, 127, 24,
]

export function getConfigKeypair() {
  return Keypair.fromSecretKey(Uint8Array.from(CONFIG_KEYPAIR))
}
