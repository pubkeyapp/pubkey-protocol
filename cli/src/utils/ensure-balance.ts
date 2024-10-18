import {
  BlockheightBasedTransactionConfirmationStrategy,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js'

export async function ensureBalance(connection: Connection, feePayer: PublicKey) {
  const balance = await connection.getBalance(feePayer)
  if (balance <= 0) {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
    const signature = await connection.requestAirdrop(feePayer, LAMPORTS_PER_SOL)

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature,
    } as BlockheightBasedTransactionConfirmationStrategy)

    const newBalance = await connection.getBalance(feePayer)
    console.log(`Account airdropped ${newBalance / LAMPORTS_PER_SOL} SOL: ${feePayer.toString()}`)
  } else {
    console.log(`Account has ${balance / LAMPORTS_PER_SOL} SOL: ${feePayer.toString()}`)
  }
}
