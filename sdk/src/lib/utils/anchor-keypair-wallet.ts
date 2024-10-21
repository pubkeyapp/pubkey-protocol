// Forked from https://github.com/coral-xyz/anchor/blob/master/ts/packages/anchor/src/nodewallet.ts
import { Wallet } from '@coral-xyz/anchor'
import { Keypair, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js'

/**
 * Keypair wallet.
 */
export class AnchorKeypairWallet implements Wallet {
  constructor(readonly payer: Keypair) {}

  async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
    if (isVersionedTransaction(tx)) {
      tx.sign([this.payer])
    } else {
      tx.partialSign(this.payer)
    }

    return tx
  }

  async signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> {
    return txs.map((t) => {
      if (isVersionedTransaction(t)) {
        t.sign([this.payer])
      } else {
        t.partialSign(this.payer)
      }
      return t
    })
  }

  get publicKey(): PublicKey {
    return this.payer.publicKey
  }
}

/**
 * Check if a transaction object is a VersionedTransaction or not
 *
 * @param tx
 * @returns bool
 */
export function isVersionedTransaction(tx: Transaction | VersionedTransaction): tx is VersionedTransaction {
  return 'version' in tx
}
