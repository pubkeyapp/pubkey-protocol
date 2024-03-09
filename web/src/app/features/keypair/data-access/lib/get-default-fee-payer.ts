import { Keypair } from '@solana/web3.js'

export const FEE_PAYER = [
  70, 56, 165, 176, 206, 28, 236, 12, 82, 10, 157, 230, 111, 245, 20, 153, 78, 236, 236, 175, 139, 94, 74, 166, 234,
  105, 243, 29, 7, 128, 180, 102, 5, 188, 6, 222, 199, 100, 106, 167, 167, 226, 149, 117, 130, 48, 84, 46, 158, 67, 159,
  201, 180, 76, 27, 163, 29, 203, 181, 210, 8, 28, 97, 48,
]
export function getDefaultFeePayer() {
  return Keypair.fromSecretKey(Uint8Array.from(FEE_PAYER))
}
