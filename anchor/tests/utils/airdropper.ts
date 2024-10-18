import * as anchor from '@coral-xyz/anchor'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export async function airdropAccounts(
  provider: anchor.Provider,
  accounts: { label: string; publicKey: anchor.web3.PublicKey }[],
): Promise<void> {
  const airdroppedAccounts = await Promise.all(
    accounts.map(async ({ label, publicKey }) => {
      const { blockhash, lastValidBlockHeight } = await provider.connection.getLatestBlockhash('confirmed')
      const signature = await provider.connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL)

      await provider.connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      })

      console.log(`Airdropped 1 SOL to: ${label}`)
      return label
    }),
  )

  console.log(`All accounts airdropped: ${airdroppedAccounts.join(', ')}`)
}
