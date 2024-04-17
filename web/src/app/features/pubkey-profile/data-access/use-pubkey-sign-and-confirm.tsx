import { toastError } from '@pubkey-ui/core'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { VersionedTransaction } from '@solana/web3.js'
import { useKeypair } from '../../keypair/data-access'
import { usePubkeyProfileSdk } from './use-pubkey-profile-sdk'

export function usePubkeySignAndConfirm() {
  const { signTransaction } = useWallet()
  const { feePayerSign } = useKeypair()
  const { connection } = useConnection()
  const { getExplorerUrl } = usePubkeyProfileSdk()

  async function sendAndConfirmTransaction({ transaction }: { transaction: VersionedTransaction }): Promise<string> {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
    const signature = await connection.sendTransaction(transaction, { skipPreflight: true })
    console.log(`Sent: ${signature}`)
    await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature }, 'confirmed')
    console.log(`Confirmed: ${getExplorerUrl(`tx/${signature}`)}`)
    return signature
  }

  async function signAndConfirmTransaction(tx: VersionedTransaction) {
    if (!signTransaction) {
      toastError('Wallet not connected')
      throw new Error('Wallet not connected')
    }
    const userSignedTx = await signTransaction(tx)
    const feePayerSignedTx = await feePayerSign(userSignedTx)

    return sendAndConfirmTransaction({ transaction: feePayerSignedTx })
  }

  return {
    signAndConfirmTransaction,
  }
}
